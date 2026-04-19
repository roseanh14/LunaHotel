import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import RoomFeatureIconStrip from '../common/RoomFeatureIconStrip.jsx';
import { enrichRoomForModal } from '../../utils/roomModalDefaults.js';
import DatePicker from 'react-datepicker';

const RoomDetailsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { roomId } = useParams();

    const [roomDetails, setRoomDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [numAdults, setNumAdults] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalGuests, setTotalGuests] = useState(1);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [userId, setUserId] = useState('');
    const [bookerContact, setBookerContact] = useState(null);
    const [showMessage, setShowMessage] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [availabilityStatus, setAvailabilityStatus] = useState('idle');
    const [availabilityNote, setAvailabilityNote] = useState('');
    const [availabilityRevision, setAvailabilityRevision] = useState(0);
    const bookingAlertRef = useRef(null);

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

    const normalizePickerDate = (value) => {
        return value instanceof Date ? value : null;
    };

    const formatDateForApi = (dateValue) => {
        const normalizedDate = new Date(
            dateValue.getTime() - dateValue.getTimezoneOffset() * 60000
        );

        return normalizedDate.toISOString().split('T')[0];
    };

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            try {
                setIsLoading(true);

                if (!roomId) {
                    if (!cancelled) {
                        setError('Room not found.');
                    }
                    return;
                }

                const response = await ApiService.getRoomById(roomId);

                if (!cancelled) {
                    setRoomDetails(response && response.room ? response.room : null);
                    setError('');
                }

                if (!cancelled && ApiService.isAuthenticated()) {
                    try {
                        const userProfile = await ApiService.getUserProfile();

                        if (
                            !cancelled &&
                            userProfile &&
                            userProfile.user &&
                            userProfile.user.id != null
                        ) {
                            setUserId(String(userProfile.user.id));
                            const u = userProfile.user;
                            setBookerContact({
                                name: typeof u.name === 'string' ? u.name : '',
                                email: typeof u.email === 'string' ? u.email : '',
                                phoneNumber: typeof u.phoneNumber === 'string' ? u.phoneNumber : '',
                            });
                        } else if (!cancelled) {
                            setUserId('');
                            setBookerContact(null);
                        }
                    } catch {
                        if (!cancelled) {
                            setUserId('');
                            setBookerContact(null);
                        }
                    }
                } else if (!cancelled) {
                    setUserId('');
                    setBookerContact(null);
                }
            } catch (errorValue) {
                if (!cancelled) {
                    setError(getErrorMessage(errorValue, 'Failed to load room details.'));
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        void fetchData();

        return () => {
            cancelled = true;
        };
    }, [roomId]);

    useEffect(() => {
        const state = location && location.state ? location.state : null;
        if (!state || typeof state !== 'object') {
            return;
        }

        const parseStateDate = (value) => {
            if (!value) return null;
            if (value instanceof Date) return value;
            if (typeof value === 'string') {
                const parsed = new Date(value);
                return Number.isNaN(parsed.getTime()) ? null : parsed;
            }
            return null;
        };

        const checkInFromState = parseStateDate(state.checkInDate);
        const checkOutFromState = parseStateDate(state.checkOutDate);

        if (checkInFromState) {
            setCheckInDate(checkInFromState);
        }
        if (checkOutFromState) {
            setCheckOutDate(checkOutFromState);
        }

        if (checkInFromState && checkOutFromState) {
            setShowDatePicker(true);
        }
    }, [location]);

    useEffect(() => {
        const safeCheckInDate = checkInDate instanceof Date ? checkInDate : null;
        const safeCheckOutDate = checkOutDate instanceof Date ? checkOutDate : null;

        const roomTypeForSearch =
            roomDetails && typeof roomDetails.roomType === 'string' ? roomDetails.roomType : null;

        if (!safeCheckInDate || !safeCheckOutDate || !roomTypeForSearch) {
            setAvailabilityStatus('idle');
            setAvailabilityNote('');
            return;
        }

        const sameRoomId = (candidateId) => {
            if (candidateId == null) return false;
            return String(candidateId) === String(roomId);
        };

        let cancelled = false;
        async function checkAvailability() {
            try {
                setAvailabilityStatus('checking');
                setAvailabilityNote('Checking availability for your dates…');

                const response = await ApiService.getAvailableRoomsByDateAndType(
                    formatDateForApi(safeCheckInDate),
                    formatDateForApi(safeCheckOutDate),
                    roomTypeForSearch
                );

                const list = response && Array.isArray(response.roomList) ? response.roomList : [];
                const match = list.find((r) => r && sameRoomId(r.id));
                const blocked = Boolean(match && match.isBooked === true);
                const isAvailable = Boolean(match) && !blocked;

                if (cancelled) return;
                if (isAvailable) {
                    setAvailabilityStatus('available');
                    setAvailabilityNote('Available for your selected dates.');
                } else {
                    setAvailabilityStatus('unavailable');
                    setAvailabilityNote(
                        match
                            ? 'Not available for your selected dates. Try different dates.'
                            : 'This room is not available for the selected dates.'
                    );
                }
            } catch {
                if (cancelled) return;
                setAvailabilityStatus('error');
                setAvailabilityNote('Availability could not be checked right now.');
            }
        }

        void checkAvailability();
        return () => {
            cancelled = true;
        };
    }, [checkInDate, checkOutDate, roomDetails, roomId, availabilityRevision]);

    useEffect(() => {
        if (!bookingAlertRef.current) return;
        if (!errorMessage && !showMessage) return;
        bookingAlertRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [errorMessage, showMessage]);

    const handleBookingGoBack = () => {
        if (showDatePicker) {
            setShowDatePicker(false);
            setTotalPrice(0);
            setTotalGuests(1);
            setErrorMessage('');
            return;
        }
        navigate(-1);
    };

    const handleConfirmBooking = async () => {
        const safeCheckInDate = checkInDate instanceof Date ? checkInDate : null;
        const safeCheckOutDate = checkOutDate instanceof Date ? checkOutDate : null;

        if (!safeCheckInDate || !safeCheckOutDate) {
            setErrorMessage('Please select check-in and check-out dates.');
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }

        if (isNaN(numAdults) || numAdults < 1) {
            setErrorMessage('Please enter a valid number of guests.');
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }

        if (!roomDetails || typeof roomDetails.roomPrice !== 'number') {
            setErrorMessage('Room price is unavailable.');
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }

        if (availabilityStatus === 'unavailable') {
            setErrorMessage('This room is not available for those dates.');
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }

        const oneDay = 24 * 60 * 60 * 1000;
        const totalDays = Math.max(
            1,
            Math.round((safeCheckOutDate.getTime() - safeCheckInDate.getTime()) / oneDay)
        );

        const calculatedTotalGuests = numAdults;
        const roomPricePerNight = roomDetails.roomPrice;
        const calculatedTotalPrice = roomPricePerNight * totalDays;

        setTotalPrice(calculatedTotalPrice);
        setTotalGuests(calculatedTotalGuests);
    };

    const acceptBooking = async () => {
        const safeCheckInDate = checkInDate instanceof Date ? checkInDate : null;
        const safeCheckOutDate = checkOutDate instanceof Date ? checkOutDate : null;

        if (!userId) {
            setErrorMessage('Please log in to complete your booking.');
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }

        if (!roomId) {
            setErrorMessage('Room not found.');
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }

        if (!safeCheckInDate || !safeCheckOutDate) {
            setErrorMessage('Please select check-in and check-out dates.');
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }

        if (availabilityStatus === 'unavailable') {
            setErrorMessage('This room is not available for those dates.');
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }

        try {
            const booking = {
                checkInDate: formatDateForApi(safeCheckInDate),
                checkOutDate: formatDateForApi(safeCheckOutDate),
                numOfAdults: numAdults,
            };

            const response = await ApiService.bookRoom(roomId, userId, booking, bookerContact || undefined);

            if (response && response.statusCode === 200) {
                setErrorMessage('');
                setConfirmationCode(
                    typeof response.bookingConfirmationCode === 'string'
                        ? response.bookingConfirmationCode
                        : ''
                );
                setShowMessage(true);
                setAvailabilityStatus('idle');
                setAvailabilityNote('');

                try {
                    const refreshed = await ApiService.getRoomById(roomId);
                    if (refreshed && refreshed.room) {
                        setRoomDetails(refreshed.room);
                    }
                } catch {
                }
                setAvailabilityRevision((n) => n + 1);

                setTimeout(() => {
                    setShowMessage(false);
                    navigate('/rooms');
                }, 10000);
            }
        } catch (errorValue) {
            setErrorMessage(getErrorMessage(errorValue, 'Failed to complete booking.'));
            setTimeout(() => setErrorMessage(''), 5000);
        }
    };

    if (isLoading) {
        return (
            <div className="room-details-page">
                <div className="room-details-surface">
                    <div className="room-details-booking">
                        <p className="room-detail-loading">Loading room details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="room-details-page">
                <div className="room-details-surface">
                    <div className="room-details-booking">
                        <p className="room-detail-loading">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!roomDetails) {
        return (
            <div className="room-details-page">
                <div className="room-details-surface">
                    <div className="room-details-booking">
                        <p className="room-detail-loading">Room not found.</p>
                    </div>
                </div>
            </div>
        );
    }

    const room = enrichRoomForModal(roomDetails);
    const roomType = typeof room.roomType === 'string' ? room.roomType : '';
    const roomPrice = room.roomPrice != null ? room.roomPrice : 0;
    const roomPhotoUrl = typeof room.roomPhotoUrl === 'string' ? room.roomPhotoUrl : '';
    const description = typeof room.description === 'string' ? room.description : '';
    const bookings = Array.isArray(room.bookings) ? room.bookings : [];
    const roomDescription =
        typeof room.roomDescription === 'string' ? room.roomDescription : '';
    const roomFeatureIconKeys = Array.isArray(room.roomFeatureIconKeys)
        ? room.roomFeatureIconKeys
        : [];
    const roomTagline = typeof room.roomTagline === 'string' ? room.roomTagline : '';
    const maxGuests = room.maxGuests != null ? room.maxGuests : '';
    const amenitiesInRoom = Array.isArray(room.amenitiesInRoom) ? room.amenitiesInRoom : [];
    const resortServicesIncluded =
        typeof room.resortServicesIncluded === 'string' ? room.resortServicesIncluded : '';
    const aboutText = description || roomDescription || '';
    const isStaff = ApiService.isAdmin();
    const isAuthed = ApiService.isAuthenticated();

    const selectedCheckInDate = checkInDate instanceof Date ? checkInDate : null;
    const selectedCheckOutDate = checkOutDate instanceof Date ? checkOutDate : null;
    const minCheckOutDate = selectedCheckInDate instanceof Date ? selectedCheckInDate : null;

    return (
        <div className="room-details-page">
            {!isAuthed ? (
                <div className="room-booking-login-prompt room-booking-login-prompt--bar room-booking-login-prompt--page-top">
                    <p>
                        To <span className="luna-color">book</span> it, log in or register—then you
                        can pick dates and complete your reservation.
                    </p>

                    <div className="room-booking-login-actions">
                        <Link
                            className="book-now-button room-booking-login-link"
                            to="/login"
                            state={{ from: location }}
                        >
                            Log in to book
                        </Link>

                        <Link className="go-back-button room-booking-login-link" to="/register">
                            Register
                        </Link>
                    </div>
                </div>
            ) : null}

            <div className="room-details-surface">
                <div className="room-details-booking">
                    <div
                        className={
                            isAuthed
                                ? 'room-details-booking-inner room-details-booking-inner--with-aside'
                                : 'room-details-booking-inner'
                        }
                    >
                        <div className="room-details-main">
                            <h2 className="room-details-booking-title">
                                Room <span className="luna-color">Details</span>
                            </h2>

                            <div className="room-details-image-wrap">
                                <img src={roomPhotoUrl} alt={roomType} className="room-details-image" />
                            </div>

                            <div className="room-details-info">
                                <h3>{roomType}</h3>
                                {roomTagline ? <p className="room-detail-tagline">{roomTagline}</p> : null}
                                <p className="room-detail-price-line">Price: ${roomPrice} / night</p>
                                <p className="room-detail-sleeps">Up to {maxGuests} guests</p>
                                {aboutText ? <p className="room-detail-about">{aboutText}</p> : null}

                                {amenitiesInRoom.length > 0 ? (
                                    <>
                                        <h4 className="room-detail-subheading">Amenities in your room</h4>
                                        <ul className="room-detail-amenities-list">
                                            {amenitiesInRoom.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    </>
                                ) : null}

                                <h4 className="room-detail-subheading">Room highlights</h4>
                                <RoomFeatureIconStrip iconKeys={roomFeatureIconKeys} />

                                {resortServicesIncluded ? (
                                    <>
                                        <h4 className="room-detail-subheading">Included across the resort</h4>
                                        <p className="room-detail-resort-copy">{resortServicesIncluded}</p>
                                    </>
                                ) : null}
                            </div>

                            {isStaff && bookings.length > 0 ? (
                                <div className="room-details-staff-block">
                                    <h3 className="room-details-staff-title">Existing bookings (staff)</h3>
                                    <ul className="booking-list">
                                        {bookings.map((booking, index) => (
                                            <li key={booking.id} className="booking-item">
                                                <span className="booking-number">Booking {index + 1} </span>
                                                <span className="booking-text">
                                                    Check-in: {booking.checkInDate}{' '}
                                                </span>
                                                <span className="booking-text">
                                                    Out: {booking.checkOutDate}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}
                        </div>

                        {isAuthed ? (
                            <aside className="room-details-aside" aria-label="Booking">
                                <div className="booking-info">
                                    <button
                                        type="button"
                                        className="book-now-button"
                                        onClick={() => setShowDatePicker(true)}
                                    >
                                        Book Now
                                    </button>

                                    <button type="button" className="go-back-button" onClick={handleBookingGoBack}>
                                        Go Back
                                    </button>

                                    {availabilityNote && !showMessage ? (
                                        <p
                                            className={`room-availability room-availability--${availabilityStatus}`}
                                            aria-live="polite"
                                        >
                                            {availabilityNote}
                                        </p>
                                    ) : null}

                                    {(showMessage || errorMessage) && (
                                        <div className="booking-alerts" ref={bookingAlertRef}>
                                            {showMessage ? (
                                                <p className="success-message" role="status" aria-live="polite">
                                                    Booking successful! Confirmation code:{' '}
                                                    <span className="booking-confirmation-code">
                                                        {confirmationCode}
                                                    </span>
                                                </p>
                                            ) : null}
                                            {errorMessage ? (
                                                <p className="error-message" role="alert">
                                                    {errorMessage}
                                                </p>
                                            ) : null}
                                        </div>
                                    )}

                                    {showDatePicker && (
                                        <div className="date-picker-container">
                                            <DatePicker
                                                className="detail-search-field"
                                                calendarClassName="luna-datepicker"
                                                popperClassName="luna-datepicker-popper"
                                                selected={selectedCheckInDate}
                                                onChange={(date) => {
                                                    const normalizedDate = normalizePickerDate(date);
                                                    setCheckInDate(normalizedDate);
                                                }}
                                                selectsStart
                                                startDate={selectedCheckInDate}
                                                endDate={selectedCheckOutDate}
                                                placeholderText="Check-in Date"
                                                dateFormat="dd/MM/yyyy"
                                                showMonthYearDropdown
                                                popperPlacement="bottom-start"
                                            />

                                            <DatePicker
                                                className="detail-search-field"
                                                calendarClassName="luna-datepicker"
                                                popperClassName="luna-datepicker-popper"
                                                selected={selectedCheckOutDate}
                                                onChange={(date) => {
                                                    const normalizedDate = normalizePickerDate(date);
                                                    setCheckOutDate(normalizedDate);
                                                }}
                                                selectsEnd
                                                startDate={selectedCheckInDate}
                                                endDate={selectedCheckOutDate}
                                                minDate={minCheckOutDate}
                                                placeholderText="Check-out Date"
                                                dateFormat="dd/MM/yyyy"
                                                showMonthYearDropdown
                                                popperPlacement="bottom-start"
                                            />

                                            <div className="guest-container">
                                                <div className="guest-div">
                                                    <label>Guests:</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="8"
                                                        value={numAdults}
                                                        onChange={(e) =>
                                                            setNumAdults(parseInt(e.target.value, 10) || 1)
                                                        }
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    className="confirm-booking"
                                                    onClick={handleConfirmBooking}
                                                >
                                                    Confirm Booking
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {totalPrice > 0 && (
                                        <div className="total-price">
                                            <p>Total Price: ${totalPrice}</p>
                                            <p>Guests: {totalGuests}</p>
                                            <button
                                                type="button"
                                                onClick={acceptBooking}
                                                className="accept-booking"
                                            >
                                                Accept Booking
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </aside>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetailsPage;