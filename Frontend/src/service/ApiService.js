import axios from 'axios';
import * as mockApi from './mockApi.js';

export default class ApiService {
    static BASE_URL = 'http://localhost:4040';

    static useMock() {
        return mockApi.isMockApiEnabled();
    }

    static getHeader() {
        const token = localStorage.getItem('token');

        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    }

    static async registerUser(registration) {
        const response = await axios.post(`${this.BASE_URL}/auth/register`, registration);
        return response.data;
    }

    static async loginUser(loginDetails) {
        const response = await axios.post(`${this.BASE_URL}/auth/login`, loginDetails);
        return response.data;
    }

    static async getAllUsers() {
        const response = await axios.get(`${this.BASE_URL}/users/all`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async getUserProfile() {
        if (this.useMock() && !this.isAuthenticated()) {
            return mockApi.mockGetUserProfile();
        }

        const response = await axios.get(`${this.BASE_URL}/users/get-logged-in-profile-info`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async updateMyProfile(profileUpdates) {
        if (this.useMock() && !this.isAuthenticated()) {
            return mockApi.mockUpdateMyProfile(profileUpdates);
        }

        const response = await axios.put(`${this.BASE_URL}/users/update-my-profile`, profileUpdates, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async deleteMyAccount() {
        if (this.useMock() && !this.isAuthenticated()) {
            return mockApi.mockDeleteMyAccount();
        }

        const response = await axios.delete(`${this.BASE_URL}/users/delete-my-account`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async getUser(userId) {
        const response = await axios.get(`${this.BASE_URL}/users/get-by-id/${userId}`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async getUserBookings(userId) {
        if (this.useMock() && !this.isAuthenticated()) {
            return mockApi.mockGetUserBookings(userId);
        }

        const response = await axios.get(`${this.BASE_URL}/users/get-user-bookings/${userId}`, {
            headers: this.getHeader(),
        });

        if (this.useMock() && this.isAuthenticated()) {
            const extra = mockApi.getSessionBookingsForUser(userId);
            const data = response.data;
            if (data && data.user) {
                const existing = Array.isArray(data.user.bookings) ? data.user.bookings : [];
                return {
                    ...data,
                    user: {
                        ...data.user,
                        bookings: [...extra, ...existing],
                    },
                };
            }
        }

        return response.data;
    }

    static getSessionBookingsForLoggedInUser(userId) {
        if (!this.useMock() || !this.isAuthenticated() || userId == null) {
            return [];
        }
        return mockApi.getSessionBookingsForUser(userId);
    }

    static async deleteUser(userId) {
        const response = await axios.delete(`${this.BASE_URL}/users/delete/${userId}`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async addRoom(formData) {
        const response = await axios.post(`${this.BASE_URL}/rooms/add`, formData, {
            headers: {
                ...this.getHeader(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    static async getAllAvailableRooms() {
        const response = await axios.get(`${this.BASE_URL}/rooms/all-available-rooms`, {
            headers: this.isAuthenticated() ? this.getHeader() : {},
        });
        return response.data;
    }

    static async getAvailableRoomsByDateAndType(checkInDate, checkOutDate, roomType) {
        if (this.useMock()) {
            return mockApi.mockGetAvailableRoomsByDateAndType(
                checkInDate,
                checkOutDate,
                roomType
            );
        }

        const params = new URLSearchParams({
            checkInDate,
            checkOutDate,
            roomType,
        });

        const response = await axios.get(
            `${this.BASE_URL}/rooms/available-rooms-by-date-and-type?${params.toString()}`,
            { headers: this.isAuthenticated() ? this.getHeader() : {} }
        );
        return response.data;
    }

    static async getRoomTypes() {
        if (this.useMock()) {
            return mockApi.mockGetRoomTypes();
        }

        const response = await axios.get(`${this.BASE_URL}/rooms/types`, {
            headers: this.isAuthenticated() ? this.getHeader() : {},
        });
        return response.data;
    }

    static async getAllRooms() {
        if (this.useMock()) {
            return mockApi.mockGetAllRooms();
        }

        const response = await axios.get(`${this.BASE_URL}/rooms/all`, {
            headers: this.isAuthenticated() ? this.getHeader() : {},
        });
        return response.data;
    }

    static async getRoomById(roomId) {
        if (this.useMock()) {
            return mockApi.mockGetRoomById(roomId);
        }

        const response = await axios.get(`${this.BASE_URL}/rooms/room-by-id/${roomId}`, {
            headers: this.isAuthenticated() ? this.getHeader() : {},
        });
        return response.data;
    }

    static async deleteRoom(roomId) {
        const response = await axios.delete(`${this.BASE_URL}/rooms/delete/${roomId}`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async updateRoom(roomId, formData) {
        const response = await axios.put(`${this.BASE_URL}/rooms/update/${roomId}`, formData, {
            headers: {
                ...this.getHeader(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    static async bookRoom(roomId, userId, booking, booker) {
        if (this.useMock()) {
            return mockApi.mockBookRoom(roomId, userId, booking, booker);
        }

        const response = await axios.post(
            `${this.BASE_URL}/bookings/book-room/${roomId}/${userId}`,
            booking,
            {
                headers: this.getHeader(),
            }
        );
        return response.data;
    }

    static async getAllBookings() {
        if (this.useMock()) {
            return mockApi.mockGetAllBookings();
        }

        const response = await axios.get(`${this.BASE_URL}/bookings/all`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async getBookingByConfirmationCode(bookingCode) {
        if (this.useMock()) {
            return mockApi.mockGetBookingByConfirmationCode(bookingCode);
        }

        const response = await axios.get(
            `${this.BASE_URL}/bookings/get-by-confirmation-code/${encodeURIComponent(bookingCode)}`,
            { headers: this.getHeader() }
        );
        return response.data;
    }

    static async cancelBooking(bookingId) {
        const response = await axios.delete(`${this.BASE_URL}/bookings/cancel/${bookingId}`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }

    static isAuthenticated() {
        const token = localStorage.getItem('token');
        return !!token;
    }

    static isAdmin() {
        const role = localStorage.getItem('role');
        return role === 'ADMIN';
    }

    static isUser() {
        const role = localStorage.getItem('role');
        return role === 'USER';
    }
}