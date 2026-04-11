import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService.js';
import { enrichRoomForModal } from '../../utils/roomModalDefaults.js';
import RoomFeatureIconStrip from './RoomFeatureIconStrip.jsx';

const RoomResult = ({ roomSearchResults, afterAvailabilitySearch = false }) => {
    const navigate = useNavigate();
    const [modalRoom, setModalRoom] = useState(null);
    const isAdmin = ApiService.isAdmin();
    const showGuestPII = isAdmin;
    const showAvailabilityBadges = isAdmin || afterAvailabilitySearch;

    const display = modalRoom ? enrichRoomForModal(modalRoom) : null;
    const aboutText =
        display && (display.roomDescription || display.description)
            ? String(display.roomDescription || display.description)
            : '';

    useEffect(() => {
        if (!modalRoom) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') setModalRoom(null);
        };
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [modalRoom]);

    const closeModal = () => setModalRoom(null);

    const ariaLabelForCard = (room) =>
        `${room.roomType}, $${room.roomPrice} per night. Opens overview.`;

    const bookDisabled =
        !isAdmin && showAvailabilityBadges && Boolean(modalRoom?.isBooked);

    return (
        <section className="room-results">
            {roomSearchResults && roomSearchResults.length > 0 ? (
                <>
                    <div className="room-list">
                        {roomSearchResults.map((room) => (
                            <div
                                key={room.id}
                                className="room-list-item room-list-item--interactive"
                                role="button"
                                tabIndex={0}
                                onClick={() => setModalRoom(room)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setModalRoom(room);
                                    }
                                }}
                                aria-label={ariaLabelForCard(room)}
                            >
                                <img
                                    className="room-list-item-image"
                                    src={room.roomPhotoUrl}
                                    alt=""
                                />

                                <div className="room-details">
                                    <h3>{room.roomType}</h3>
                                    <p>Price: ${room.roomPrice} / night</p>
                                    {showGuestPII && room.bookings?.length > 0 && (
                                        <ul
                                            className="room-bookings-list"
                                            aria-label="Reservations (staff only)"
                                        >
                                            {room.bookings.map((b) => (
                                                <li
                                                    key={
                                                        b.id ??
                                                        `${b.checkInDate}-${b.bookingConfirmationCode ?? ''}`
                                                    }
                                                >
                                                    <span className="room-bookings-guest">
                                                        {b.guestName ?? 'Guest'}
                                                    </span>
                                                    <span className="room-bookings-dates">
                                                        {' '}
                                                        · {b.checkInDate} → {b.checkOutDate}
                                                    </span>
                                                    {b.bookingConfirmationCode ? (
                                                        <span className="room-bookings-code">
                                                            {' '}
                                                            · {b.bookingConfirmationCode}
                                                        </span>
                                                    ) : null}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {room.roomDescription ? (
                                        <p className="room-card-text">{room.roomDescription}</p>
                                    ) : null}
                                </div>

                                <div className="book-now-div">
                                    <span
                                        className={`book-now-button room-list-cta${isAdmin ? ' edit-room-button' : ''}`}
                                        aria-hidden="true"
                                    >
                                        {isAdmin ? 'Edit Room' : 'View room'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {display ? (
                        <div
                            className="room-modal-backdrop"
                            role="presentation"
                            onClick={closeModal}
                        >
                            <div
                                className="room-modal"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="room-modal-title"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    type="button"
                                    className="room-modal-close"
                                    onClick={closeModal}
                                    aria-label="Close"
                                >
                                    ×
                                </button>
                                <div className="room-modal-image-wrap">
                                    <img
                                        src={display.roomPhotoUrl}
                                        alt=""
                                        className="room-modal-image"
                                    />
                                </div>
                                <div className="room-modal-body">
                                    <h2 id="room-modal-title" className="room-modal-title">
                                        {display.roomType}
                                    </h2>
                                    {display.roomTagline ? (
                                        <p className="room-modal-tagline">{display.roomTagline}</p>
                                    ) : null}

                                    <div className="room-modal-meta">
                                        <span className="room-modal-meta-item">
                                            ${display.roomPrice} / night
                                        </span>
                                        <span className="room-modal-meta-item">
                                            Sleeps up to {display.maxGuests}
                                        </span>
                                    </div>

                                    {showAvailabilityBadges && display.isBooked ? (
                                        <p className="room-modal-note">
                                            No availability for the dates you searched.
                                        </p>
                                    ) : null}
                                    {showAvailabilityBadges &&
                                    !display.isBooked &&
                                    display.bookings?.length > 0 ? (
                                        <p className="room-modal-note">
                                            This category has other reservations on file — your
                                            dates may still be open.
                                        </p>
                                    ) : null}

                                    {aboutText ? (
                                        <>
                                            <h3 className="room-modal-section-title">
                                                About this room
                                            </h3>
                                            <p className="room-modal-text">{aboutText}</p>
                                        </>
                                    ) : null}

                                    {display.amenitiesInRoom?.length > 0 ? (
                                        <>
                                            <h3 className="room-modal-section-title">
                                                Amenities in your room
                                            </h3>
                                            <ul className="room-modal-amenities">
                                                {display.amenitiesInRoom.map((item) => (
                                                    <li key={item}>{item}</li>
                                                ))}
                                            </ul>
                                        </>
                                    ) : null}

                                    <h3 className="room-modal-section-title">Room highlights</h3>
                                    <RoomFeatureIconStrip
                                        iconKeys={display.roomFeatureIconKeys}
                                    />

                                    <h3 className="room-modal-section-title">
                                        Resort services included
                                    </h3>
                                    <p className="room-modal-text">
                                        {display.resortServicesIncluded}
                                    </p>

                                    {showGuestPII && display.bookings?.length > 0 ? (
                                        <>
                                            <h3 className="room-modal-section-title">
                                                Staff: reservations on file
                                            </h3>
                                            <ul
                                                className="room-bookings-list room-bookings-list--modal"
                                                aria-label="Reservations (staff only)"
                                            >
                                                {display.bookings.map((b) => (
                                                    <li
                                                        key={
                                                            b.id ??
                                                            `${b.checkInDate}-${b.bookingConfirmationCode ?? ''}`
                                                        }
                                                    >
                                                        <span className="room-bookings-guest">
                                                            {b.guestName ?? 'Guest'}
                                                        </span>
                                                        <span className="room-bookings-dates">
                                                            {' '}
                                                            · {b.checkInDate} → {b.checkOutDate}
                                                        </span>
                                                        {b.bookingConfirmationCode ? (
                                                            <span className="room-bookings-code">
                                                                {' '}
                                                                · {b.bookingConfirmationCode}
                                                            </span>
                                                        ) : null}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    ) : null}

                                    <div className="room-modal-actions">
                                        <button
                                            type="button"
                                            className="book-now-button"
                                            disabled={bookDisabled}
                                            onClick={() => {
                                                navigate(`/room-details-book/${display.id}`);
                                                closeModal();
                                            }}
                                        >
                                            {bookDisabled
                                                ? 'Unavailable for these dates'
                                                : 'Book this room'}
                                        </button>
                                        {isAdmin ? (
                                            <button
                                                type="button"
                                                className="room-modal-secondary-btn"
                                                onClick={() => {
                                                    navigate(`/admin/edit-room/${display.id}`);
                                                    closeModal();
                                                }}
                                            >
                                                Edit in admin
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </>
            ) : (
                <p>No rooms found.</p>
            )}
        </section>
    );
};

export default RoomResult;
