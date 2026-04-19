import {
    getMockRoomListResponse,
    getMockRoomTypes,
    getMockRoomById,
    getMockAvailableByDateAndType,
    MOCK_BOOKINGS_ADMIN,
    getMockBookingByCode,
} from '../data/mockHotelData.js';

export function isMockApiEnabled() {
    const env = typeof import.meta !== 'undefined' ? import.meta.env : undefined;
    return env && env['VITE_USE_MOCK_DATA'] === 'true';
}

const SESSION_BOOKINGS_KEY = 'luna_mock_session_bookings_v1';

function readSessionBookings() {
    try {
        const raw = sessionStorage.getItem(SESSION_BOOKINGS_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeSessionBookings(list) {
    try {
        sessionStorage.setItem(SESSION_BOOKINGS_KEY, JSON.stringify(list));
    } catch {
    }
}

function normalizeBookingCode(code) {
    return String(code || '')
        .trim()
        .toUpperCase()
        .replace(/\s/g, '');
}

function mapSessionRowToFindResponse(row) {
    const room = row.room || {};
    return {
        booking: {
            bookingConfirmationCode: normalizeBookingCode(row.bookingConfirmationCode),
            checkInDate: row.checkInDate,
            checkOutDate: row.checkOutDate,
            numOfAdults: row.numOfAdults,
            numOfChildren: row.numOfChildren ?? 0,
            user: {
                name: row.guestName || 'Guest',
                email: row.guestEmail || '',
                phoneNumber: row.guestPhone || '',
            },
            room: {
                roomType: room.roomType,
                roomPhotoUrl: room.roomPhotoUrl,
                roomPrice: room.roomPrice,
                roomDescription: room.roomDescription,
            },
        },
    };
}

function mapSessionRowToProfileBooking(row) {
    const room = row.room || {};
    return {
        id: row.id,
        bookingConfirmationCode: row.bookingConfirmationCode,
        checkInDate: row.checkInDate,
        checkOutDate: row.checkOutDate,
        totalNumOfGuest: row.totalNumOfGuest,
        numOfAdults: row.numOfAdults,
        room: {
            roomType: room.roomType,
            roomPhotoUrl: room.roomPhotoUrl,
        },
        user: {
            name: row.guestName || 'Guest',
        },
    };
}

export function getSessionBookingsForUser(userId) {
    const uid = String(userId);
    return readSessionBookings()
        .filter((b) => String(b.userId) === uid)
        .map(mapSessionRowToProfileBooking);
}

export function getSessionBookingByCode(bookingCode) {
    const want = normalizeBookingCode(bookingCode);
    const row = readSessionBookings().find((b) => normalizeBookingCode(b.bookingConfirmationCode) === want);
    return row ? mapSessionRowToFindResponse(row) : null;
}

function sessionStayOverlapsSearch(searchIn, searchOut, stayIn, stayOut) {
    const si = String(searchIn || '');
    const so = String(searchOut || '');
    const bi = String(stayIn || '');
    const bo = String(stayOut || '');
    return bi < so && bo > si;
}

function sessionBlocksRoomForDates(roomId, checkInDate, checkOutDate) {
    const rid = String(roomId);
    return readSessionBookings().some((row) => {
        if (String(row.roomId) !== rid) {
            return false;
        }
        return sessionStayOverlapsSearch(checkInDate, checkOutDate, row.checkInDate, row.checkOutDate);
    });
}

function mockDelay(ms = 200) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export async function mockGetAllRooms() {
    await mockDelay();
    return getMockRoomListResponse();
}

export async function mockGetRoomTypes() {
    await mockDelay(120);
    return getMockRoomTypes();
}

export async function mockGetRoomById(roomId) {
    await mockDelay(150);

    const data = getMockRoomById(roomId);

    if (!data) {
        throw new Error('Room not found');
    }

    const sid = String(roomId);
    const sessionExtras = readSessionBookings()
        .filter((row) => String(row.roomId) === sid)
        .map((row) => ({
            id: `session-${row.id}`,
            guestName: row.guestName,
            bookingConfirmationCode: row.bookingConfirmationCode,
            checkInDate: row.checkInDate,
            checkOutDate: row.checkOutDate,
        }));

    const room = data.room ? { ...data.room } : null;
    if (room) {
        const baseBookings = Array.isArray(room.bookings) ? room.bookings.map((b) => ({ ...b })) : [];
        room.bookings = [...baseBookings, ...sessionExtras];
    }

    return { ...data, room };
}

export async function mockGetAvailableRoomsByDateAndType(checkInDate, checkOutDate, roomType) {
    await mockDelay(200);
    const base = getMockAvailableByDateAndType(checkInDate, checkOutDate, roomType);
    const list = (base.roomList || []).map((room) => {
        const blockedBySession = sessionBlocksRoomForDates(room.id, checkInDate, checkOutDate);
        return {
            ...room,
            isBooked: Boolean(room.isBooked) || blockedBySession,
        };
    });
    return { ...base, roomList: list };
}

export async function mockGetUserProfile() {
    await mockDelay(100);

    return {
        user: {
            id: 101,
            name: 'Guest',
            email: 'guest@lunahotel.com',
            phoneNumber: '+1 (555) 010-4277',
        },
    };
}

export async function mockGetUserBookings(userId) {
    await mockDelay(120);

    void userId;

    const profile = await mockGetUserProfile();
    return {
        statusCode: 200,
        message: 'successful',
        user: {
            ...profile.user,
            bookings: [],
        },
    };
}

export async function mockUpdateMyProfile(profileUpdates) {
    await mockDelay(150);

    const current = await mockGetUserProfile();
    const nextUser = {
        ...current.user,
        ...(profileUpdates && typeof profileUpdates === 'object' ? profileUpdates : {}),
    };

    return {
        statusCode: 200,
        user: nextUser,
        message: 'successful',
    };
}

export async function mockDeleteMyAccount() {
    await mockDelay(150);
    return {
        statusCode: 200,
        message: 'successful',
    };
}

export async function mockBookRoom(roomId, userId, booking, booker) {
    await mockDelay(250);

    const sixDigits = String(100000 + Math.floor(Math.random() * 900000));
    const code = `LH-${sixDigits}`;

    const roomPayload = getMockRoomById(roomId);
    const room = roomPayload && roomPayload.room ? roomPayload.room : null;
    const adults = booking && typeof booking.numOfAdults === 'number' ? booking.numOfAdults : 1;
    const children = booking && typeof booking.numOfChildren === 'number' ? booking.numOfChildren : 0;
    const totalNumOfGuest = adults + children;

    const name =
        booker && typeof booker.name === 'string' && booker.name.trim() ? booker.name.trim() : 'Guest';
    const email = booker && typeof booker.email === 'string' ? booker.email.trim() : '';
    const phone =
        booker && typeof booker.phoneNumber === 'string' ? booker.phoneNumber.trim() : '';

    const row = {
        id: Date.now(),
        bookingConfirmationCode: code,
        userId: String(userId),
        roomId: String(roomId),
        checkInDate: booking && booking.checkInDate ? String(booking.checkInDate) : '',
        checkOutDate: booking && booking.checkOutDate ? String(booking.checkOutDate) : '',
        numOfAdults: adults,
        numOfChildren: children,
        totalNumOfGuest,
        guestName: name,
        guestEmail: email,
        guestPhone: phone,
        room: room
            ? {
                  roomType: room.roomType,
                  roomPhotoUrl: room.roomPhotoUrl,
                  roomPrice: room.roomPrice,
                  roomDescription: room.roomDescription || room.description,
              }
            : {},
    };

    const list = readSessionBookings();
    list.push(row);
    writeSessionBookings(list);

    return {
        statusCode: 200,
        bookingConfirmationCode: code,
    };
}

export async function mockGetAllBookings() {
    await mockDelay(180);

    const sessionAsAdmin = readSessionBookings().map((row) => ({
        id: row.id,
        bookingConfirmationCode: row.bookingConfirmationCode,
        checkInDate: row.checkInDate,
        checkOutDate: row.checkOutDate,
        totalNumOfGuest: row.totalNumOfGuest,
    }));

    return {
        bookingList: [...sessionAsAdmin, ...MOCK_BOOKINGS_ADMIN.map((bookingItem) => ({ ...bookingItem }))],
    };
}

export async function mockGetBookingByConfirmationCode(bookingCode) {
    await mockDelay(200);

    const fromSession = getSessionBookingByCode(bookingCode);
    if (fromSession) {
        return fromSession;
    }

    const data = getMockBookingByCode(bookingCode);

    if (!data) {
        const error = new Error('Booking not found');
        error.response = {
            data: {
                message: 'No booking matches this code.',
            },
        };
        throw error;
    }

    return data;
}