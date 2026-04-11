export const LUNA_DEFAULT_RESORT_SERVICES =
    'Complimentary Wi-Fi resort-wide, infinity pool, fitness center, lobby lounge, beach club with loungers and towels, and daily housekeeping. Concierge can book spa treatments, fine dining, and island excursions. Parking and airport transfers on request.';

export function enrichRoomForModal(room) {
    if (!room) return null;

    const amenities =
        Array.isArray(room.amenitiesInRoom) && room.amenitiesInRoom.length > 0
            ? room.amenitiesInRoom
            : ['Climate control', 'Private bathroom', 'Premium linens & towels', 'In-room safe'];

    return {
        ...room,
        maxGuests:
            typeof room.maxGuests === 'number' && room.maxGuests > 0
                ? room.maxGuests
                : 2,
        roomTagline: room.roomTagline || null,
        amenitiesInRoom: amenities,
        resortServicesIncluded:
            room.resortServicesIncluded || LUNA_DEFAULT_RESORT_SERVICES,
    };
}