import {
    getMockRoomListResponse,
    getMockRoomTypes,
    getMockRoomById,
    getMockAvailableByDateAndType,
    MOCK_BOOKINGS_ADMIN,
    getMockBookingByCode,
} from '../data/mockHotelData.js';

export function isMockApiEnabled() {
    return import.meta.env.VITE_USE_MOCK_DATA === 'true';
}

export function mockDelay(ms = 200) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
    if (!data) throw new Error('Room not found');
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

export async function mockBookRoom(_roomId, _userId, _booking) {
    await mockDelay(250);
    const sixDigits = String(100000 + Math.floor(Math.random() * 900000));
    const code = `LH-${sixDigits}`;
    return { statusCode: 200, bookingConfirmationCode: code };
}

export async function mockGetAllBookings() {
    await mockDelay(180);
    return { bookingList: MOCK_BOOKINGS_ADMIN.map((b) => ({ ...b })) };
}

export async function mockGetBookingByConfirmationCode(bookingCode) {
    await mockDelay(200);
    const data = getMockBookingByCode(bookingCode);
    if (!data) {
        const err = new Error('Booking not found');
        err.response = { data: { message: 'No booking matches this code.' } };
        throw err;
    }
    return data;
}
