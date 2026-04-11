import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const EditRoomPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [roomDetails, setRoomDetails] = useState({
        roomPhotoUrl: '',
        roomType: '',
        roomPrice: '',
        roomDescription: '',
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const getErrorMessage = (errorValue, fallbackMessage) => {
        if (
            errorValue &&
            errorValue.response &&
            errorValue.response.data &&
            typeof errorValue.response.data.message === 'string'
        ) {
            return errorValue.response.data.message;
        }

        if (errorValue instanceof Error) {
            return errorValue.message;
        }

        if (typeof errorValue === 'string') {
            return errorValue;
        }

        return fallbackMessage;
    };

    const showTemporaryError = (errorValue, fallbackMessage) => {
        setError(getErrorMessage(errorValue, fallbackMessage));
        setTimeout(() => {
            setError('');
        }, 5000);
    };

    const showSuccessAndRedirect = (message) => {
        setSuccess(message);

        setTimeout(() => {
            setSuccess('');
            navigate('/admin/manage-rooms');
        }, 3000);
    };

    const requireRoomId = () => {
        if (!roomId) {
            showTemporaryError('Missing room ID.', 'Missing room ID.');
            return false;
        }

        return true;
    };

    const executeRoomAction = async (action, successMessage, fallbackMessage) => {
        try {
            if (!requireRoomId()) {
                return;
            }

            const result = await action();

            if (result && result.statusCode === 200) {
                showSuccessAndRedirect(successMessage);
            }
        } catch (errorValue) {
            showTemporaryError(errorValue, fallbackMessage);
        }
    };

    useEffect(() => {
        async function fetchRoomDetails() {
            try {
                if (!roomId) {
                    setError('Missing room ID.');
                    return;
                }

                const response = await ApiService.getRoomById(roomId);
                const roomData =
                    response &&
                    response.room &&
                    typeof response.room === 'object'
                        ? response.room
                        : null;

                setRoomDetails({
                    roomPhotoUrl:
                        roomData && typeof roomData.roomPhotoUrl === 'string'
                            ? roomData.roomPhotoUrl
                            : '',
                    roomType:
                        roomData && typeof roomData.roomType === 'string'
                            ? roomData.roomType
                            : '',
                    roomPrice:
                        roomData && roomData.roomPrice != null
                            ? String(roomData.roomPrice)
                            : '',
                    roomDescription:
                        roomData && typeof roomData.roomDescription === 'string'
                            ? roomData.roomDescription
                            : '',
                });
            } catch (errorValue) {
                setError(getErrorMessage(errorValue, 'Failed to fetch room details.'));
            }
        }

        void fetchRoomDetails();
    }, [roomId]);

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleRoomTypeChange = (e) => {
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

    const buildRoomFormData = () => {
        const formData = new FormData();
        formData.append('roomType', roomDetails.roomType);
        formData.append('roomPrice', roomDetails.roomPrice);
        formData.append('roomDescription', roomDetails.roomDescription);

        if (file instanceof File) {
            formData.append('photo', file);
        }

        return formData;
    };

    const handleUpdate = async () => {
        await executeRoomAction(
            () => ApiService.updateRoom(roomId, buildRoomFormData()),
            'Room updated successfully.',
            'Failed to update room.'
        );
    };

    const handleDelete = async () => {
        if (!window.confirm('Do you want to delete this room?')) {
            return;
        }

        await executeRoomAction(
            () => ApiService.deleteRoom(roomId),
            'Room deleted successfully.',
            'Failed to delete room.'
        );
    };

    return (
        <div className="edit-room-container">
            <h2>Edit Room</h2>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div className="edit-room-form">
                <div className="form-group">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Room Preview"
                            className="room-photo-preview"
                        />
                    ) : (
                        roomDetails.roomPhotoUrl && (
                            <img
                                src={roomDetails.roomPhotoUrl}
                                alt="Room"
                                className="room-photo"
                            />
                        )
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
                    <input
                        type="text"
                        name="roomType"
                        value={roomDetails.roomType}
                        onChange={handleRoomTypeChange}
                    />
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

                <button className="update-button" onClick={handleUpdate}>
                    Update Room
                </button>

                <button className="delete-button" onClick={handleDelete}>
                    Delete Room
                </button>
            </div>
        </div>
    );
};

export default EditRoomPage;