import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../../service/ApiService';

const LEGACY_PLACEHOLDER_NAMES = new Set(['', 'Guest', 'Demo guest']);

function mergeBookerWithProfile(booking, profileUser) {
    if (!booking || !profileUser) {
        return booking;
    }
    const rawName = typeof booking.user?.name === 'string' ? booking.user.name.trim() : '';
    const useProfile =
        LEGACY_PLACEHOLDER_NAMES.has(rawName) ||
        (!booking.user?.email && !booking.user?.phoneNumber && profileUser.name);

    if (!useProfile) {
        return booking;
    }

    return {
        ...booking,
        user: {
            ...booking.user,
            name: profileUser.name || rawName || '—',
            email: profileUser.email || booking.user?.email || '—',
            phoneNumber: profileUser.phoneNumber || booking.user?.phoneNumber || '—',
        },
    };
}

function leadGuestFromBooking(booking, accountUser) {
    const fromBooking =
        booking && booking.user && typeof booking.user.name === 'string' ? booking.user.name.trim() : '';
    const legacy = fromBooking === 'Demo guest' || fromBooking === 'Guest';
    if (fromBooking && !legacy) {
        return fromBooking;
    }
    return accountUser && typeof accountUser.name === 'string' ? accountUser.name : '';
}

function normalizeConfirmationCode(value) {
    if (typeof value !== 'string') return '';
    return value.trim().toUpperCase().replace(/[\s.,;:]+$/g, '');
}

const FindBookingPage = () => {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [accountUser, setAccountUser] = useState(null);
    const [myBookings, setMyBookings] = useState([]);
    const [highlightedCode, setHighlightedCode] = useState('');
    const [guestResult, setGuestResult] = useState(null);
    const [standaloneHit, setStandaloneHit] = useState(null);
    const cardRefs = useRef({});

    useEffect(() => {
        let cancelled = false;

        async function loadAccountBookings() {
            if (!ApiService.isAuthenticated()) {
                setAccountUser(null);
                setMyBookings([]);
                return;
            }

            try {
                const response = await ApiService.getUserProfile();
                if (cancelled || !response?.user?.id) {
                    setAccountUser(null);
                    setMyBookings([]);
                    return;
                }

                setAccountUser(response.user);
                const fromDb = Array.isArray(response.user.bookings) ? response.user.bookings : [];
                const fromSession = ApiService.getSessionBookingsForLoggedInUser(response.user.id);
                setMyBookings([...fromSession, ...fromDb]);

                try {
                    const full = await ApiService.getUserBookings(response.user.id);
                    if (!cancelled && full?.user?.bookings) {
                        setMyBookings(full.user.bookings);
                    }
                } catch {
                }
            } catch {
                if (!cancelled) {
                    setAccountUser(null);
                    setMyBookings([]);
                }
            }
        }

        void loadAccountBookings();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!highlightedCode) return;
        const el = cardRefs.current[highlightedCode];
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [highlightedCode, myBookings]);

    const handleSearch = async () => {
        const normalizedCode = normalizeConfirmationCode(confirmationCode);
        if (!normalizedCode) {
            setError('Please enter a booking confirmation code');
            setTimeout(() => setError(''), 5000);
            return;
        }

        setHasSearched(true);
        setGuestResult(null);
        setStandaloneHit(null);
        setHighlightedCode('');

        try {
            const response = await ApiService.getBookingByConfirmationCode(normalizedCode);
            let booking = response.booking;
            if (!booking) {
                setError('No booking data returned.');
                setTimeout(() => setError(''), 5000);
                return;
            }

            if (ApiService.isAuthenticated()) {
                try {
                    const prof = await ApiService.getUserProfile();
                    if (prof?.user) {
                        booking = mergeBookerWithProfile(booking, prof.user);
                    }
                } catch {
                }
            }

            setError(null);

            if (!ApiService.isAuthenticated()) {
                setGuestResult(booking);
                return;
            }

            let listForMatch = myBookings;
            try {
                const prof = await ApiService.getUserProfile();
                if (prof?.user?.id) {
                    const full = await ApiService.getUserBookings(prof.user.id);
                    if (full?.user?.bookings) {
                        listForMatch = full.user.bookings;
                        setMyBookings(full.user.bookings);
                    }
                }
            } catch {
            }

            const inMyList = listForMatch.some(
                (b) => normalizeConfirmationCode(b.bookingConfirmationCode) === normalizedCode
            );

            if (inMyList) {
                setHighlightedCode(normalizedCode);
            } else {
                setStandaloneHit(booking);
            }
        } catch (err) {
            setGuestResult(null);
            setStandaloneHit(null);
            setHighlightedCode('');
            setError(err.response?.data?.message || err.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    const renderBookingCard = (b) => {
        const roomType = b.room?.roomType || '—';
        const photo = b.room?.roomPhotoUrl || null;
        const guestName = leadGuestFromBooking(b, accountUser) || '—';
        const fromBookingEmail = b.user?.email && String(b.user.email).trim();
        const fromBookingPhone = b.user?.phoneNumber && String(b.user.phoneNumber).trim();
        const fromAccountEmail = accountUser?.email && String(accountUser.email).trim();
        const fromAccountPhone = accountUser?.phoneNumber && String(accountUser.phoneNumber).trim();
        const email = fromBookingEmail || fromAccountEmail || '—';
        const phone = fromBookingPhone || fromAccountPhone || '—';
        const guestCount =
            b.totalNumOfGuest != null && b.totalNumOfGuest !== ''
                ? b.totalNumOfGuest
                : b.numOfAdults != null
                  ? b.numOfAdults
                  : '—';

        return (
            <article className="profile-booking-card">
                <header className="profile-booking-card__header">
                    <span className="profile-booking-card__code">{b.bookingConfirmationCode}</span>
                    <span className="profile-booking-card__room">{roomType}</span>
                </header>
                <dl className="profile-booking-dl">
                    <div className="profile-booking-dl__row">
                        <dt>Lead guest</dt>
                        <dd>{guestName}</dd>
                    </div>
                    <div className="profile-booking-dl__row">
                        <dt>Email</dt>
                        <dd>{email}</dd>
                    </div>
                    <div className="profile-booking-dl__row">
                        <dt>Phone</dt>
                        <dd>{phone}</dd>
                    </div>
                    <div className="profile-booking-dl__row">
                        <dt>Check-in</dt>
                        <dd>{b.checkInDate}</dd>
                    </div>
                    <div className="profile-booking-dl__row">
                        <dt>Check-out</dt>
                        <dd>{b.checkOutDate}</dd>
                    </div>
                    <div className="profile-booking-dl__row">
                        <dt>Guests</dt>
                        <dd>{guestCount}</dd>
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
    };

    return (
        <div className="find-booking-page">
            <div className="find-booking-page__inner">
                <section className="find-booking-search-panel" aria-labelledby="find-booking-title">
                    <h2 id="find-booking-title">Find my booking</h2>
                    <p className="find-booking-hint">
                        Enter the confirmation code from your email. If you are signed in, the matching reservation
                        in your list below is highlighted.
                    </p>
                    <div className="find-booking-form">
                        <label htmlFor="booking-confirmation-code" className="find-booking-label">
                            Booking confirmation code
                        </label>
                        <input
                            id="booking-confirmation-code"
                            className="find-booking-input"
                            type="text"
                            autoComplete="off"
                            placeholder="e.g. LH-855586"
                            value={confirmationCode}
                            onChange={(e) => setConfirmationCode(e.target.value)}
                        />
                        <button type="button" className="find-booking-submit" onClick={handleSearch}>
                            Find
                        </button>
                    </div>
                    {error ? <p className="find-booking-error">{error}</p> : null}
                </section>

                {ApiService.isAuthenticated() && accountUser ? (
                    <section className="find-booking-reservations-section" aria-labelledby="find-reservations-heading">
                        <h3 id="find-reservations-heading">Your reservations</h3>
                        {myBookings.length > 0 ? (
                            <div className="find-booking-my-grid">
                                {myBookings.map((b) => {
                                    const norm = normalizeConfirmationCode(b.bookingConfirmationCode);
                                    const isHit = Boolean(highlightedCode && norm === highlightedCode);
                                    return (
                                        <div
                                            key={
                                                b.id != null
                                                    ? `booking-${b.id}`
                                                    : `booking-${b.bookingConfirmationCode || 'row'}`
                                            }
                                            className={isHit ? 'find-booking-grid-item find-booking-grid-item--hit' : 'find-booking-grid-item'}
                                            ref={(el) => {
                                                if (el) {
                                                    cardRefs.current[norm] = el;
                                                } else {
                                                    delete cardRefs.current[norm];
                                                }
                                            }}
                                        >
                                            {renderBookingCard(b)}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="find-booking-overview-empty">You do not have any saved reservations yet.</p>
                        )}

                        {standaloneHit ? (
                            <div className="find-booking-standalone-hit">
                                <p className="find-booking-standalone-hit-note">
                                    This code is valid, but it is not listed among your reservations here (different
                                    account or older data). Details from the search:
                                </p>
                                {renderBookingCard(standaloneHit)}
                            </div>
                        ) : null}
                    </section>
                ) : null}

                {!ApiService.isAuthenticated() && guestResult ? (
                    <div className="find-booking-guest-result">{renderBookingCard(guestResult)}</div>
                ) : null}

                {!ApiService.isAuthenticated() && hasSearched && !error && !guestResult ? (
                    <p className="find-booking-empty-msg">No booking matches this search.</p>
                ) : null}
            </div>
        </div>
    );
};

export default FindBookingPage;
