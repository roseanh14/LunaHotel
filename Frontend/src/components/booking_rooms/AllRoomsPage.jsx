import React, { useState, useEffect, useMemo } from 'react';
import ApiService from '../../service/ApiService';
import Pagination from '../common/Pagination';
import RoomResult from '../common/RoomResult';
import RoomSearch from '../common/RoomSearch';

const AllRoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [afterAvailabilitySearch, setAfterAvailabilitySearch] = useState(false);

    const roomsPerPage = 5;

    const handleSearchResult = (results) => {
        const safeResults = Array.isArray(results) ? results : [];
        setRooms(safeResults);
        setCurrentPage(1);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const [roomsResponse, roomTypesResponse] = await Promise.all([
                    ApiService.getAllRooms(),
                    ApiService.getRoomTypes(),
                ]);

                const allRooms =
                    roomsResponse && Array.isArray(roomsResponse.roomList)
                        ? roomsResponse.roomList
                        : [];

                const allRoomTypes = Array.isArray(roomTypesResponse)
                    ? roomTypesResponse.filter((type) => typeof type === 'string')
                    : [];

                setRooms(allRooms);
                setRoomTypes(allRoomTypes);
            } catch (error) {
                console.error(
                    'Error fetching room data:',
                    error instanceof Error ? error.message : 'Unknown error'
                );
            }
        }

        void fetchData();
    }, []);

    const handleRoomTypeChange = (e) => {
        setSelectedRoomType(e.target.value);
        setCurrentPage(1);
    };

    const filteredRooms = useMemo(() => {
        if (!selectedRoomType) {
            return rooms;
        }

        return rooms.filter((room) => {
            return room && room.roomType === selectedRoomType;
        });
    }, [rooms, selectedRoomType]);

    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;

    const currentRooms = useMemo(() => {
        return filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
    }, [filteredRooms, indexOfFirstRoom, indexOfLastRoom]);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="all-rooms">
            <h2>All Rooms</h2>

            <div className="all-room-filter-div">
                <label>Filter by Room Type:</label>
                <select value={selectedRoomType} onChange={handleRoomTypeChange}>
                    <option value="">All</option>
                    {roomTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            <RoomSearch
                handleSearchResult={handleSearchResult}
                onSearchSuccess={() => setAfterAvailabilitySearch(true)}
            />

            <RoomResult
                roomSearchResults={currentRooms}
                afterAvailabilitySearch={afterAvailabilitySearch}
            />

            <Pagination
                roomsPerPage={roomsPerPage}
                totalRooms={filteredRooms.length}
                currentPage={currentPage}
                paginate={paginate}
            />
        </div>
    );
};

export default AllRoomsPage;