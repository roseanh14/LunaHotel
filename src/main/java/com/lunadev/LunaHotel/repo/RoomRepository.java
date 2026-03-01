package com.lunadev.LunaHotel.repo;

import com.lunadev.LunaHotel.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    @Query("SELECT DISTINCT r.roomType FROM Room r")
    List<String> findDistinctRoomType();

    @Query("""
        SELECT r
        FROM Room r
        WHERE r.roomType LIKE %:roomType%
          AND NOT EXISTS (
              SELECT 1
              FROM Booking bk
              WHERE bk.room = r
                AND bk.checkInDate < :checkOutDate
                AND bk.checkOutDate > :checkInDate
          )
        """)
    List<Room> findAvailableRoomsByDatesAndTypes(
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate,
            @Param("roomType") String roomType
    );

    @Query("""
        SELECT r
        FROM Room r
        WHERE NOT EXISTS (
            SELECT 1
            FROM Booking b
            WHERE b.room = r
        )
        """)
    List<Room> getAllAvailableRooms();
}