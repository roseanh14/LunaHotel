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

    const normalizePickerDate = (value) => {
        return value instanceof Date ? value : null;
    };

    useEffect(() => {
        async function fetchRoomTypes() {
            try {
                const types = await ApiService.getRoomTypes();
                const safeTypes = Array.isArray(types)
                    ? types.filter((type) => typeof type === 'string')
                    : [];
                setRoomTypes(safeTypes);
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
        const safeStartDate = startDate instanceof Date ? startDate : null;
        const safeEndDate = endDate instanceof Date ? endDate : null;

        if (!safeStartDate || !safeEndDate || !roomType) {
            showMessage(
                'Please select check-in date, check-out date, and room type before searching.',
                7000
            );
            return;
        }

        try {
            const formattedStartDate = safeStartDate.toISOString().split('T')[0];
            const formattedEndDate = safeEndDate.toISOString().split('T')[0];

            const response = await ApiService.getAvailableRoomsByDateAndType(
                formattedStartDate,
                formattedEndDate,
                roomType
            );

            if (response && response.statusCode === 200) {
                const safeRoomList =
                    response && Array.isArray(response.roomList) ? response.roomList : [];

                if (safeRoomList.length === 0) {
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

                if (typeof onSearchSuccess === 'function') {
                    onSearchSuccess();
                }

                if (typeof handleSearchResult === 'function') {
                    handleSearchResult(safeRoomList);
                }
            }
        } catch (error) {
            showMessage(
                error &&
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? String(error.response.data.message)
                    : 'Search could not be completed. Please try again.',
                8000
            );
        }
    };

    const selectedStartDate = startDate instanceof Date ? startDate : null;
    const selectedEndDate = endDate instanceof Date ? endDate : null;
    const minEndDate = selectedStartDate instanceof Date ? selectedStartDate : null;

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
                        selected={selectedStartDate}
                        onChange={(date) => {
                            const normalizedDate = normalizePickerDate(date);
                            setStartDate(normalizedDate);
                        }}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select check-in date"
                        showMonthYearDropdown
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
                        selected={selectedEndDate}
                        onChange={(date) => {
                            const normalizedDate = normalizePickerDate(date);
                            setEndDate(normalizedDate);
                        }}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select check-out date"
                        minDate={minEndDate}
                        showMonthYearDropdown
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