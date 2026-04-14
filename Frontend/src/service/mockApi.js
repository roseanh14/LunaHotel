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

    return data;
}

export async function mockGetAvailableRoomsByDateAndType(checkInDate, checkOutDate, roomType) {
    await mockDelay(200);
    return getMockAvailableByDateAndType(checkInDate, checkOutDate, roomType);
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

export async function mockBookRoom(roomId, userId, booking) {
    await mockDelay(250);

    void roomId;
    void userId;
    void booking;

    const sixDigits = String(100000 + Math.floor(Math.random() * 900000));
    const code = `LH-${sixDigits}`;

    return {
        statusCode: 200,
        bookingConfirmationCode: code,
    };
}

export async function mockGetAllBookings() {
    await mockDelay(180);

    return {
        bookingList: MOCK_BOOKINGS_ADMIN.map((bookingItem) => ({ ...bookingItem })),
    };
}

export async function mockGetBookingByConfirmationCode(bookingCode) {
    await mockDelay(200);

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