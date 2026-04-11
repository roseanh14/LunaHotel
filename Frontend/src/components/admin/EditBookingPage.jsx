import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const EditBookingPage = () => {
    const navigate = useNavigate();
    const { bookingCode } = useParams();

    const [bookingDetails, setBookingDetails] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccessMessage] = useState('');

    useEffect(() => {
        async function fetchBookingDetails() {
            try {
                if (!bookingCode) {
                    setError('Missing booking code.');
                    return;
                }

                const response = await ApiService.getBookingByConfirmationCode(bookingCode);
                setBookingDetails(response && response.booking ? response.booking : null);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to fetch booking details.');
            }
        }

        void fetchBookingDetails();
    }, [bookingCode]);

    const archiveBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to archive this booking?')) {
            return;
        }

        try {
            const response = await ApiService.cancelBooking(bookingId);

            if (response && response.statusCode === 200) {
                setSuccessMessage('The booking was successfully archived.');

                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/admin/manage-bookings');
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
                        : 'Failed to archive booking.';

            setError(errorMessage);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="find-booking-page">
            <h2>Booking Details</h2>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

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

                    <h3>Booker Details</h3>
                    <div>
                        <p>Name: {bookingDetails.user && bookingDetails.user.name ? bookingDetails.user.name : ''}</p>
                        <p>Email: {bookingDetails.user && bookingDetails.user.email ? bookingDetails.user.email : ''}</p>
                        <p>
                            Phone Number:{' '}
                            {bookingDetails.user && bookingDetails.user.phoneNumber
                                ? bookingDetails.user.phoneNumber
                                : ''}
                        </p>
                    </div>

                    <br />
                    <hr />
                    <br />

                    <h3>Room Details</h3>
                    <div>
                        <p>Room Type: {bookingDetails.room && bookingDetails.room.roomType ? bookingDetails.room.roomType : ''}</p>
                        <p>
                            Room Price: $
                            {bookingDetails.room && bookingDetails.room.roomPrice
                                ? bookingDetails.room.roomPrice
                                : ''}
                        </p>
                        <p>
                            Room Description:{' '}
                            {bookingDetails.room && bookingDetails.room.roomDescription
                                ? bookingDetails.room.roomDescription
                                : ''}
                        </p>
                        {bookingDetails.room && bookingDetails.room.roomPhotoUrl && (
                            <img
                                src={bookingDetails.room.roomPhotoUrl}
                                alt="Room"
                            />
                        )}
                    </div>

                    <button
                        className="archive-booking"
                        onClick={() => archiveBooking(bookingDetails.id)}
                    >
                        Archive Booking
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditBookingPage;