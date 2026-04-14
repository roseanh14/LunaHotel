import React, { useState } from 'react';
import ApiService from '../../service/ApiService';

const FindBookingPage = () => {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [bookingDetails, setBookingDetails] = useState(null);
    const [error, setError] = useState(null);

    const normalizeConfirmationCode = (value) => {
        if (typeof value !== 'string') return '';
        // Keep hyphens (mock codes can be like "LH-123456"), but remove trailing punctuation/spaces.
        return value.trim().toUpperCase().replace(/[\s.,;:]+$/g, '');
    };

    const handleSearch = async () => {
        const normalizedCode = normalizeConfirmationCode(confirmationCode);
        if (!normalizedCode) {
            setError('Please Enter a booking confirmation code');
            setTimeout(() => setError(''), 5000);
            return;
        }
        try {
            const response = await ApiService.getBookingByConfirmationCode(normalizedCode);
            setBookingDetails(response.booking);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="find-booking-page">
            <h2>Find Booking</h2>
            <p className="find-booking-hint">
                Enter the confirmation code from your booking confirmation email. Only the code from
                your own reservation will show your details.
            </p>
            <div className="find-booking-form">
                <label htmlFor="booking-confirmation-code" className="find-booking-label">
                    Booking confirmation code
                </label>
                <input
                    id="booking-confirmation-code"
                    className="find-booking-input"
                    required
                    type="text"
                    autoComplete="off"
                    placeholder="Enter your booking confirmation code"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                />
                <button type="button" className="find-booking-submit" onClick={handleSearch}>
                    Find
                </button>
            </div>
            {error && <p className="find-booking-error">{error}</p>}
            {bookingDetails && (
                <div className="booking-details">
                    <h3>Booking Details</h3>
                    <p>Confirmation Code: {bookingDetails.bookingConfirmationCode}</p>
                    <p>Check-in Date: {bookingDetails.checkInDate}</p>
                    <p>Check-out Date: {bookingDetails.checkOutDate}</p>
                    <p>Guests: {bookingDetails.numOfAdults}</p>

                    <br />
                    <hr />
                    <br />
                    <h3>Booker details</h3>
                    <div>
                        <p> Name: {bookingDetails.user.name}</p>
                        <p> Email: {bookingDetails.user.email}</p>
                        <p> Phone Number: {bookingDetails.user.phoneNumber}</p>
                    </div>

                    <br />
                    <hr />
                    <br />
                    <h3>Room Details</h3>
                    <div>
                        <p> Room Type: {bookingDetails.room.roomType}</p>
                        <img src={bookingDetails.room.roomPhotoUrl} alt="" sizes="" srcSet="" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindBookingPage;
