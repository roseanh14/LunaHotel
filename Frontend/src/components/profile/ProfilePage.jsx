import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const response = await ApiService.getUserProfile();

                if (!response || !response.user || !response.user.id) {
                    setUser(null);
                    return;
                }

                const userPlusBookings = await ApiService.getUserBookings(response.user.id);
                setUser(userPlusBookings && userPlusBookings.user ? userPlusBookings.user : null);
            } catch (error) {
                const errorMessage =
                    error &&
                    error.response &&
                    error.response.data &&
                    typeof error.response.data.message === 'string'
                        ? error.response.data.message
                        : error instanceof Error
                            ? error.message
                            : 'Failed to load profile.';

                setError(errorMessage);
            }
        }

        void fetchUserProfile();
    }, []);

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    const bookings = user && Array.isArray(user.bookings) ? user.bookings : [];

    return (
        <div className="profile-page">
            {user && <h2>Welcome, {user.name}</h2>}

            <div className="profile-actions">
                <button className="edit-profile-button" onClick={handleEditProfile}>
                    Edit Profile
                </button>
            </div>

            {error && <p className="error-message">{error}</p>}

            {user && (
                <div className="profile-details">
                    <h3>My Profile Details</h3>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                        <strong>Phone Number:</strong> {user.phoneNumber}
                    </p>
                </div>
            )}

            <div className="bookings-section">
                <h3>My Booking History</h3>
                <div className="booking-list">
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <div key={booking.id} className="booking-item">
                                <p>
                                    <strong>Booked by:</strong>{' '}
                                    {booking.user && booking.user.name ? booking.user.name : ''}
                                </p>
                                <p>
                                    <strong>Booking Code:</strong> {booking.bookingConfirmationCode}
                                </p>
                                <p>
                                    <strong>Check-in Date:</strong> {booking.checkInDate}
                                </p>
                                <p>
                                    <strong>Check-out Date:</strong> {booking.checkOutDate}
                                </p>
                                <p>
                                    <strong>Guests:</strong> {booking.totalNumOfGuest}
                                </p>
                                <p>
                                    <strong>Room Type:</strong>{' '}
                                    {booking.room && booking.room.roomType ? booking.room.roomType : ''}
                                </p>
                                {booking.room && booking.room.roomPhotoUrl ? (
                                    <img
                                        src={booking.room.roomPhotoUrl}
                                        alt="Room"
                                        className="room-photo"
                                    />
                                ) : null}
                            </div>
                        ))
                    ) : (
                        <p>No bookings found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;