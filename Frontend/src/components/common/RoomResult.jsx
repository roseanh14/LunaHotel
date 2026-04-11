import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService.js';

const RoomResult = ({ roomSearchResults, afterAvailabilitySearch = false }) => {
    const navigate = useNavigate();
    const isAdmin = ApiService.isAdmin();
    const showGuestPII = isAdmin;

    const goToRoomDetail = (roomId) => {
        navigate(`/room-details-book/${roomId}`);
    };

    const ariaLabelForCard = (room) =>
        `${room.roomType}, $${room.roomPrice} per night. Open room details.`;

    return (
        <section
            className={`room-results${afterAvailabilitySearch ? ' room-results--post-search' : ''}`}
        >
            {roomSearchResults && roomSearchResults.length > 0 ? (
                <div className="room-list">
                    {roomSearchResults.map((room) => (
                        <div
                            key={room.id}
                            className="room-list-item room-list-item--interactive"
                            role="link"
                            tabIndex={0}
                            onClick={() => goToRoomDetail(room.id)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    goToRoomDetail(room.id);
                                }
                            }}
                            aria-label={ariaLabelForCard(room)}
                        >
                            <img className="room-list-item-image" src={room.roomPhotoUrl} alt="" />

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

                            {isAdmin ? (
                                <div
                                    className="book-now-div"
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => e.stopPropagation()}
                                >
                                    <Link
                                        to={`/admin/edit-room/${room.id}`}
                                        className="book-now-button edit-room-button room-list-cta-link"
                                    >
                                        Edit Room
                                    </Link>
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No rooms found.</p>
            )}
        </section>
    );
};

export default RoomResult;
