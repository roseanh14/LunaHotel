import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService.js';

const AddRoomPage = () => {
    const navigate = useNavigate();

    const [roomDetails, setRoomDetails] = useState({
        roomType: '',
        roomPrice: '',
        roomDescription: '',
    });

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [roomTypes, setRoomTypes] = useState([]);
    const [newRoomType, setNewRoomType] = useState(false);

    useEffect(() => {
        async function fetchRoomTypes() {
            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(Array.isArray(types) ? types.filter((type) => typeof type === 'string') : []);
            } catch (error) {
                console.error(
                    'Error fetching room types:',
                    error instanceof Error ? error.message : 'Unknown error'
                );
            }
        }

        void fetchRoomTypes();
    }, []);

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleRoomTypeInputChange = (e) => {
        setRoomDetails({
            ...roomDetails,
            roomType: e.target.value,
        });
    };

    const handleRoomPriceChange = (e) => {
        setRoomDetails({
            ...roomDetails,
            roomPrice: e.target.value,
        });
    };

    const handleRoomDescriptionChange = (e) => {
        setRoomDetails({
            ...roomDetails,
            roomDescription: e.target.value,
        });
    };

    const handleRoomTypeChange = (e) => {
        const selectedValue = e.target.value;

        if (selectedValue === 'new') {
            setNewRoomType(true);
            setRoomDetails({
                ...roomDetails,
                roomType: '',
            });
            return;
        }

        setNewRoomType(false);
        setRoomDetails({
            ...roomDetails,
            roomType: selectedValue,
        });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files && e.target.files[0] ? e.target.files[0] : null;

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        if (selectedFile instanceof File) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setPreview('');
        }
    };

    const addRoom = async () => {
        const { roomType, roomPrice, roomDescription } = roomDetails;

        if (!roomType || !roomPrice || !roomDescription) {
            setError('All room details must be provided.');
            setTimeout(() => setError(''), 5000);
            return;
        }

        if (!window.confirm('Do you want to add this room to Luna Hotel?')) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('roomType', roomType);
            formData.append('roomPrice', roomPrice);
            formData.append('roomDescription', roomDescription);

            if (file instanceof File) {
                formData.append('photo', file);
            }

            const result = await ApiService.addRoom(formData);

            if (result?.statusCode === 200) {
                setSuccess('Room added successfully to Luna Hotel.');

                setTimeout(() => {
                    setSuccess('');
                    navigate('/admin/manage-rooms');
                }, 3000);
            }
        } catch (error) {
            const errorMessage =
                error &&
                error.response &&
                error.response.data &&
                typeof error.response.data.message === 'string'
                    ? error.response.data.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to add room.';

            setError(errorMessage);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="edit-room-container">
            <h2>Add New Room</h2>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div className="edit-room-form">
                <div className="form-group">
                    {preview && (
                        <img
                            src={preview}
                            alt="Room Preview"
                            className="room-photo-preview"
                        />
                    )}

                    <input
                        type="file"
                        name="roomPhoto"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="form-group">
                    <label>Room Type</label>
                    <select
                        value={newRoomType ? 'new' : roomDetails.roomType}
                        onChange={handleRoomTypeChange}
                    >
                        <option value="">Select a room type</option>
                        {roomTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                        <option value="new">Other (please specify)</option>
                    </select>

                    {newRoomType && (
                        <input
                            type="text"
                            name="roomType"
                            placeholder="Enter new room type"
                            value={roomDetails.roomType}
                            onChange={handleRoomTypeInputChange}
                        />
                    )}
                </div>

                <div className="form-group">
                    <label>Room Price</label>
                    <input
                        type="text"
                        name="roomPrice"
                        value={roomDetails.roomPrice}
                        onChange={handleRoomPriceChange}
                    />
                </div>

                <div className="form-group">
                    <label>Room Description</label>
                    <textarea
                        name="roomDescription"
                        value={roomDetails.roomDescription}
                        onChange={handleRoomDescriptionChange}
                    />
                </div>

                <button className="update-button" onClick={addRoom}>
                    Add Room
                </button>
            </div>
        </div>
    );
};

export default AddRoomPage;