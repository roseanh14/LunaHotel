import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import Pagination from '../common/Pagination';

const ManageBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const bookingsPerPage = 6;

    useEffect(() => {
        async function fetchBookings() {
            try {
                const response = await ApiService.getAllBookings();
                const allBookings =
                    response && Array.isArray(response.bookingList)
                        ? response.bookingList
                        : [];

                setBookings(allBookings);
            } catch (error) {
                console.error(
                    'Error fetching bookings:',
                    error instanceof Error ? error.message : 'Unknown error'
                );
            }
        }

        void fetchBookings();
    }, []);

    const filteredBookings = useMemo(() => {
        if (!searchTerm) {
            return bookings;
        }

        return bookings.filter((booking) => {
            return (
                booking &&
                typeof booking.bookingConfirmationCode === 'string' &&
                booking.bookingConfirmationCode.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    }, [bookings, searchTerm]);

    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;

    const currentBookings = useMemo(() => {
        return filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
    }, [filteredBookings, indexOfFirstBooking, indexOfLastBooking]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="bookings-container">
            <h2>All Bookings</h2>

            <div className="search-div">
                <label>Filter by Booking Number:</label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Enter booking number"
                />
            </div>

            <div className="booking-results">
                {currentBookings.map((booking) => (
                    <div key={booking.id} className="booking-result-item">
                        <p>
                            <strong>Booking Code:</strong> {booking.bookingConfirmationCode}
                        </p>
                        <p>
                            <strong>Check In Date:</strong> {booking.checkInDate}
                        </p>
                        <p>
                            <strong>Check Out Date:</strong> {booking.checkOutDate}
                        </p>
                        <p>
                            <strong>Guests:</strong> {booking.totalNumOfGuest}
                        </p>
                        <button
                            className="edit-room-button"
                            onClick={() =>
                                navigate(`/admin/edit-booking/${booking.bookingConfirmationCode}`)
                            }
                        >
                            Manage Booking
                        </button>
                    </div>
                ))}
            </div>

            <Pagination
                roomsPerPage={bookingsPerPage}
                totalRooms={filteredBookings.length}
                currentPage={currentPage}
                paginate={paginate}
            />
        </div>
    );
};

export default ManageBookingsPage;