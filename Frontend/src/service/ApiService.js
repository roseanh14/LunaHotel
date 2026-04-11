import axios from "axios"
import {
    isMockApiEnabled,
    mockGetAllRooms,
    mockGetRoomTypes,
    mockGetRoomById,
    mockGetAvailableRoomsByDateAndType,
    mockGetUserProfile,
    mockBookRoom,
    mockGetAllBookings,
    mockGetBookingByConfirmationCode,
} from "./mockApi.js"

export default class ApiService {

    static BASE_URL = "http://localhost:4040"

    static useMock() {
        return isMockApiEnabled()
    }

    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    static async registerUser(registration) {
        const response = await axios.post(`${this.BASE_URL}/auth/register`, registration)
        return response.data
    }

    static async loginUser(loginDetails) {
        const response = await axios.post(`${this.BASE_URL}/auth/login`, loginDetails)
        return response.data
    }

    static async getAllUsers() {
        const response = await axios.get(`${this.BASE_URL}/users/all`, {
            headers: this.getHeader()
        })
        return response.data
    }

    static async getUserProfile() {
        if (this.useMock()) {
            return mockGetUserProfile()
        }
        const response = await axios.get(`${this.BASE_URL}/users/get-logged-in-profile-info`, {
            headers: this.getHeader()
        })
        return response.data
    }


    static async getUser(userId) {
        const response = await axios.get(`${this.BASE_URL}/users/get-by-id/${userId}`, {
            headers: this.getHeader()
        })
        return response.data
    }

    static async getUserBookings(userId) {
        const response = await axios.get(`${this.BASE_URL}/users/get-user-bookings/${userId}`, {
            headers: this.getHeader()
        })
        return response.data
    }

    static async deleteUser(userId) {
        const response = await axios.delete(`${this.BASE_URL}/users/delete/${userId}`, {
            headers: this.getHeader()
        })
        return response.data
    }

    static async addRoom(formData) {
        const result = await axios.post(`${this.BASE_URL}/rooms/add`, formData, {
            headers: {
                ...this.getHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return result.data;
    }

    static async getAllAvailableRooms() {
        const result = await axios.get(`${this.BASE_URL}/rooms/all-available-rooms`)
        return result.data
    }

    static async getAvailableRoomsByDateAndType(checkInDate, checkOutDate, roomType) {
        if (this.useMock()) {
            return mockGetAvailableRoomsByDateAndType(checkInDate, checkOutDate, roomType)
        }
        const params = new URLSearchParams({
            checkInDate,
            checkOutDate,
            roomType,
        })
        const result = await axios.get(
            `${this.BASE_URL}/rooms/available-rooms-by-date-and-type?${params.toString()}`
        )
        return result.data
    }

    static async getRoomTypes() {
        if (this.useMock()) {
            return mockGetRoomTypes()
        }
        const response = await axios.get(`${this.BASE_URL}/rooms/types`)
        return response.data
    }

    static async getAllRooms() {
        if (this.useMock()) {
            return mockGetAllRooms()
        }
        const result = await axios.get(`${this.BASE_URL}/rooms/all`)
        return result.data
    }

    static async getRoomById(roomId) {
        if (this.useMock()) {
            return mockGetRoomById(roomId)
        }
        const result = await axios.get(`${this.BASE_URL}/rooms/room-by-id/${roomId}`)
        return result.data
    }

    static async deleteRoom(roomId) {
        const result = await axios.delete(`${this.BASE_URL}/rooms/delete/${roomId}`, {
            headers: this.getHeader()
        })
        return result.data
    }

    static async updateRoom(roomId, formData) {
        const result = await axios.put(`${this.BASE_URL}/rooms/update/${roomId}`, formData, {
            headers: {
                ...this.getHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return result.data;
    }

    static async bookRoom(roomId, userId, booking) {

        console.log("USER ID IS: " + userId)

        if (this.useMock()) {
            return mockBookRoom(roomId, userId, booking)
        }
        const response = await axios.post(`${this.BASE_URL}/bookings/book-room/${roomId}/${userId}`, booking, {
            headers: this.getHeader()
        })
        return response.data
    }

    static async getAllBookings() {
        if (this.useMock()) {
            return mockGetAllBookings()
        }
        const result = await axios.get(`${this.BASE_URL}/bookings/all`, {
            headers: this.getHeader()
        })
        return result.data
    }

    static async getBookingByConfirmationCode(bookingCode) {
        if (this.useMock()) {
            return mockGetBookingByConfirmationCode(bookingCode)
        }
        const result = await axios.get(`${this.BASE_URL}/bookings/get-by-confirmation-code/${bookingCode}`)
        return result.data
    }

    static async cancelBooking(bookingId) {
        const result = await axios.delete(`${this.BASE_URL}/bookings/cancel/${bookingId}`, {
            headers: this.getHeader()
        })
        return result.data
    }

    static logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }

    static isAuthenticated() {
        const token = localStorage.getItem('token')
        return !!token
    }

    static isAdmin() {
        const role = localStorage.getItem('role')
        return role === 'ADMIN'
    }

    static isUser() {
        const role = localStorage.getItem('role')
        return role === 'USER'
    }
}
