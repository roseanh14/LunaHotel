import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUserProfile() {
            setError('');
            try {
                const response = await ApiService.getUserProfile();

                if (!response || !response.user || !response.user.id) {
                    setUser(null);
                    return;
                }

                const fromDb = Array.isArray(response.user.bookings) ? response.user.bookings : [];
                const fromSession = ApiService.getSessionBookingsForLoggedInUser(response.user.id);
                setUser({ ...response.user, bookings: [...fromSession, ...fromDb] });

                try {
                    const userPlusBookings = await ApiService.getUserBookings(response.user.id);
                    if (userPlusBookings && userPlusBookings.user) {
                        setUser(userPlusBookings.user);
                    }
                } catch {
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
                            : 'Failed to load profile.';

                setError(errorMessage);
                setUser(null);
            }
        }

        void fetchUserProfile();
    }, []);

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    const bookings = user && Array.isArray(user.bookings) ? user.bookings : [];

    const leadGuestName = (booking) => {
        const fromBooking = booking && booking.user && typeof booking.user.name === 'string' ? booking.user.name.trim() : '';
        const legacy = fromBooking === 'Demo guest' || fromBooking === 'Guest';
        if (fromBooking && !legacy) {
            return fromBooking;
        }
        return user && typeof user.name === 'string' ? user.name : '';
    };

    const contactEmailForBooking = (booking) => {
        const fromBooking = booking?.user?.email && String(booking.user.email).trim();
        const fromAccount = user?.email && String(user.email).trim();
        return fromBooking || fromAccount || '—';
    };

    const contactPhoneForBooking = (booking) => {
        const fromBooking = booking?.user?.phoneNumber && String(booking.user.phoneNumber).trim();
        const fromAccount = user?.phoneNumber && String(user.phoneNumber).trim();
        return fromBooking || fromAccount || '—';
    };

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

            <section className="bookings-section" aria-labelledby="profile-bookings-heading">
                <h3 id="profile-bookings-heading">My Booking History</h3>
                <div className="booking-list">
                    {bookings.length > 0 ? (
                        bookings.map((booking) => {
                            const roomType =
                                booking.room && booking.room.roomType ? booking.room.roomType : '—';
                            const photo = booking.room && booking.room.roomPhotoUrl ? booking.room.roomPhotoUrl : null;
                            return (
                                <article
                                    key={
                                        booking.id != null
                                            ? String(booking.id)
                                            : String(booking.bookingConfirmationCode || '')
                                    }
                                    className="profile-booking-card"
                                >
                                    <header className="profile-booking-card__header">
                                        <span className="profile-booking-card__code">
                                            {booking.bookingConfirmationCode}
                                        </span>
                                        <span className="profile-booking-card__room">{roomType}</span>
                                    </header>
                                    <dl className="profile-booking-dl">
                                        <div className="profile-booking-dl__row">
                                            <dt>Lead guest</dt>
                                            <dd>{leadGuestName(booking)}</dd>
                                        </div>
                                        <div className="profile-booking-dl__row">
                                            <dt>Email</dt>
                                            <dd>{contactEmailForBooking(booking)}</dd>
                                        </div>
                                        <div className="profile-booking-dl__row">
                                            <dt>Phone</dt>
                                            <dd>{contactPhoneForBooking(booking)}</dd>
                                        </div>
                                        <div className="profile-booking-dl__row">
                                            <dt>Check-in</dt>
                                            <dd>{booking.checkInDate}</dd>
                                        </div>
                                        <div className="profile-booking-dl__row">
                                            <dt>Check-out</dt>
                                            <dd>{booking.checkOutDate}</dd>
                                        </div>
                                        <div className="profile-booking-dl__row">
                                            <dt>Guests</dt>
                                            <dd>{booking.totalNumOfGuest}</dd>
                                        </div>
                                    </dl>
                                    {photo ? (
                                        <div className="profile-booking-card__media">
                                            <img
                                                src={photo}
                                                alt={`${roomType} — Luna Hotel`}
                                                className="profile-booking-card__img"
                                            />
                                        </div>
                                    ) : null}
                                </article>
                            );
                        })
                    ) : (
                        <p className="bookings-section__empty">No bookings found.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ProfilePage;