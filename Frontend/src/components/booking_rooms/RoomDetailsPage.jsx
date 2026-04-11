import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import RoomFeatureIconStrip from '../common/RoomFeatureIconStrip.jsx';
import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

const RoomDetailsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { roomId } = useParams();
    const [roomDetails, setRoomDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track any errors
    const [checkInDate, setCheckInDate] = useState(null); // State variable for check-in date
    const [checkOutDate, setCheckOutDate] = useState(null); // State variable for check-out date
    const [numAdults, setNumAdults] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalGuests, setTotalGuests] = useState(1);
    const [showDatePicker, setShowDatePicker] = useState(false); // State variable to control date picker visibility
    const [userId, setUserId] = useState(''); // Set user id
    const [showMessage, setShowMessage] = useState(false); // State variable to control message visibility
    const [confirmationCode, setConfirmationCode] = useState(''); // State variable for booking confirmation code
    const [errorMessage, setErrorMessage] = useState(''); // State variable for error message

    useEffect(() => {
        let cancelled = false;
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await ApiService.getRoomById(roomId);
                if (!cancelled) {
                    setRoomDetails(response.room);
                    setError(null);
                }
                if (!cancelled && ApiService.isAuthenticated()) {
                    try {
                        const userProfile = await ApiService.getUserProfile();
                        if (!cancelled) setUserId(String(userProfile.user.id));
                    } catch {
                        if (!cancelled) setUserId('');
                    }
                } else if (!cancelled) {
                    setUserId('');
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.response?.data?.message || err.message);
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        fetchData();
        return () => {
            cancelled = true;
        };
    }, [roomId]);


    const handleConfirmBooking = async () => {
        // Check if check-in and check-out dates are selected
        if (!checkInDate || !checkOutDate) {
            setErrorMessage('Please select check-in and check-out dates.');
            setTimeout(() => setErrorMessage(''), 5000); // Clear error message after 5 seconds
            return;
        }

        if (isNaN(numAdults) || numAdults < 1) {
            setErrorMessage('Please enter a valid number of guests.');
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }

        const oneDay = 24 * 60 * 60 * 1000;
        const startDate = new Date(checkInDate);
        const endDate = new Date(checkOutDate);
        const totalDays = Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;

        const totalGuests = numAdults;

        // Calculate total price
        const roomPricePerNight = roomDetails.roomPrice;
        const totalPrice = roomPricePerNight * totalDays;

        setTotalPrice(totalPrice);
        setTotalGuests(totalGuests);
    };

    const acceptBooking = async () => {
        if (!userId) {
            setErrorMessage('Please log in to complete your booking.');
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }
        try {

            // Ensure checkInDate and checkOutDate are Date objects
            const startDate = new Date(checkInDate);
            const endDate = new Date(checkOutDate);

            // Log the original dates for debugging
            console.log("Original Check-in Date:", startDate);
            console.log("Original Check-out Date:", endDate);

            // Convert dates to YYYY-MM-DD format, adjusting for time zone differences
            const formattedCheckInDate = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
            const formattedCheckOutDate = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];


            // Log the original dates for debugging
            console.log("Formated Check-in Date:", formattedCheckInDate);
            console.log("Formated Check-out Date:", formattedCheckOutDate);

            // Create booking object
            const booking = {
                checkInDate: formattedCheckInDate,
                checkOutDate: formattedCheckOutDate,
                numOfAdults: numAdults,
            };
            console.log(booking)
            console.log(checkOutDate)

            // Make booking
            const response = await ApiService.bookRoom(roomId, userId, booking);
            if (response.statusCode === 200) {
                setConfirmationCode(response.bookingConfirmationCode); // Set booking confirmation code
                setShowMessage(true); // Show message
                // Hide message and navigate to homepage after 5 seconds
                setTimeout(() => {
                    setShowMessage(false);
                    navigate('/rooms'); // Navigate to rooms
                }, 10000);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
            setTimeout(() => setErrorMessage(''), 5000); // Clear error message after 5 seconds
        }
    };

    if (isLoading) {
        return <p className='room-detail-loading'>Loading room details...</p>;
    }

    if (error) {
        return <p className='room-detail-loading'>{error}</p>;
    }

    if (!roomDetails) {
        return <p className='room-detail-loading'>Room not found.</p>;
    }

    const {
        roomType,
        roomPrice,
        roomPhotoUrl,
        description,
        bookings,
        roomDescription,
        roomFeatureIconKeys,
    } = roomDetails;
    const aboutText = description || roomDescription || '';
    const isStaff = ApiService.isAdmin();
    const isAuthed = ApiService.isAuthenticated();

    return (
        <div className="room-details-booking">
            {showMessage && (
                <p className="booking-success-message">
                    Booking successful! Confirmation code: {confirmationCode}. An SMS and email of your booking details have been sent to you.
                </p>
            )}
            {errorMessage && (
                <p className="error-message">
                    {errorMessage}
                </p>
            )}
            <h2 className="room-details-booking-title">Room Details</h2>
            <div className="room-details-image-wrap">
                <img src={roomPhotoUrl} alt={roomType} className="room-details-image" />
            </div>
            <div className="room-details-info">
                <h3>{roomType}</h3>
                <p>Price: ${roomPrice} / night</p>
                {aboutText ? <p className="room-detail-about">{aboutText}</p> : null}
                <h4 className="room-detail-subheading">Room highlights</h4>
                <RoomFeatureIconStrip iconKeys={roomFeatureIconKeys} />
            </div>
            {isStaff && bookings && bookings.length > 0 && (
                <div>
                    <h3>Existing Booking Details (staff)</h3>
                    <ul className="booking-list">
                        {bookings.map((booking, index) => (
                            <li key={booking.id} className="booking-item">
                                <span className="booking-number">Booking {index + 1} </span>
                                <span className="booking-text">Check-in: {booking.checkInDate} </span>
                                <span className="booking-text">Out: {booking.checkOutDate}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {isAuthed ? (
                <div className="booking-info">
                    <button className="book-now-button" onClick={() => setShowDatePicker(true)}>
                        Book Now
                    </button>
                    <button className="go-back-button" onClick={() => setShowDatePicker(false)}>
                        Go Back
                    </button>
                    {showDatePicker && (
                        <div className="date-picker-container">
                            <DatePicker
                                className="detail-search-field"
                                selected={checkInDate}
                                onChange={(date) => setCheckInDate(date)}
                                selectsStart
                                startDate={checkInDate}
                                endDate={checkOutDate}
                                placeholderText="Check-in Date"
                                dateFormat="dd/MM/yyyy"
                            />
                            <DatePicker
                                className="detail-search-field"
                                selected={checkOutDate}
                                onChange={(date) => setCheckOutDate(date)}
                                selectsEnd
                                startDate={checkInDate}
                                endDate={checkOutDate}
                                minDate={checkInDate}
                                placeholderText="Check-out Date"
                                dateFormat="dd/MM/yyyy"
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
                                <button className="confirm-booking" onClick={handleConfirmBooking}>
                                    Confirm Booking
                                </button>
                            </div>
                        </div>
                    )}
                    {totalPrice > 0 && (
                        <div className="total-price">
                            <p>Total Price: ${totalPrice}</p>
                            <p>Guests: {totalGuests}</p>
                            <button onClick={acceptBooking} className="accept-booking">
                                Accept Booking
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="room-booking-login-prompt">
                    <p>
                        To <strong>book</strong> it, you must be logged in or registered—only then can you
                        choose dates and complete a reservation.
                    </p>
                    <div className="room-booking-login-actions">
                        <Link className="book-now-button room-booking-login-link" to="/login" state={{ from: location }}>
                            Log in to book
                        </Link>
                        <Link className="go-back-button room-booking-login-link" to="/register">
                            Register
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomDetailsPage;