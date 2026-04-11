import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ApiService from '../../service/ApiService.js';

const RoomSearch = ({ handleSearchResult, onSearchSuccess }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [roomType, setRoomType] = useState('');
    const [roomTypes, setRoomTypes] = useState([]);
    const [searchMessage, setSearchMessage] = useState(null);
    const messageTimeoutRef = useRef(null);

    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types);
            } catch (error) {
                console.error('Error fetching room types:', error.message);
            }
        };

        fetchRoomTypes();
    }, []);

    useEffect(() => {
        return () => {
            if (messageTimeoutRef.current) {
                window.clearTimeout(messageTimeoutRef.current);
            }
        };
    }, []);

    const showMessage = (text, timeout = 7000) => {
        if (messageTimeoutRef.current) {
            window.clearTimeout(messageTimeoutRef.current);
        }
        setSearchMessage(text);
        messageTimeoutRef.current = window.setTimeout(() => {
            setSearchMessage(null);
            messageTimeoutRef.current = null;
        }, timeout);
    };

    const handleInternalSearch = async () => {
        if (!startDate || !endDate || !roomType) {
            showMessage(
                'Please select check-in date, check-out date, and room type before searching.',
                7000
            );
            return;
        }

        try {
            const formattedStartDate = startDate.toISOString().split('T')[0];
            const formattedEndDate = endDate.toISOString().split('T')[0];

            const response = await ApiService.getAvailableRoomsByDateAndType(
                formattedStartDate,
                formattedEndDate,
                roomType
            );

            if (response.statusCode === 200) {
                if (response.roomList.length === 0) {
                    showMessage(
                        'No rooms match those dates and room type. Try different dates or another category.',
                        8000
                    );
                    return;
                }

                setSearchMessage(null);
                if (messageTimeoutRef.current) {
                    window.clearTimeout(messageTimeoutRef.current);
                    messageTimeoutRef.current = null;
                }
                onSearchSuccess?.();
                handleSearchResult(response.roomList);
            }
        } catch (error) {
            showMessage(
                error?.response?.data?.message
                    ? String(error.response.data.message)
                    : 'Search could not be completed. Please try again.',
                8000
            );
        }
    };

    return (
        <section className="room-search-wrap">
            <div className="search-container">
                <div className="search-field">
                    <label>
                        Check-in Date
                        <span className="search-required-mark" aria-hidden="true">
                            *
                        </span>
                        <span className="visually-hidden"> (required)</span>
                    </label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select check-in date"
                    />
                </div>

                <div className="search-field">
                    <label>
                        Check-out Date
                        <span className="search-required-mark" aria-hidden="true">
                            *
                        </span>
                        <span className="visually-hidden"> (required)</span>
                    </label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select check-out date"
                    />
                </div>

                <div className="search-field">
                    <label>
                        Room Type
                        <span className="search-required-mark" aria-hidden="true">
                            *
                        </span>
                        <span className="visually-hidden"> (required)</span>
                    </label>
                    <select
                        className="room-type-select"
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                    >
                        <option disabled value="">
                            Select room type
                        </option>
                        {roomTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                {searchMessage ? (
                    <p className="search-form-message" role="alert">
                        {searchMessage}
                    </p>
                ) : null}

                <button className="home-search-button" onClick={handleInternalSearch}>
                    Search Rooms
                </button>
            </div>
        </section>
    );
};

export default RoomSearch;
