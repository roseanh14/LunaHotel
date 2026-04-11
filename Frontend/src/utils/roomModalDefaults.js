/** Default copy when API room objects omit extended fields (modal + detail). */
export const LUNA_DEFAULT_RESORT_SERVICES =
    'Complimentary Wi‑Fi resort-wide, infinity pool, fitness center, lobby lounge, beach club with loungers and towels, and daily housekeeping. Concierge can book spa treatments, fine dining, and island excursions. Parking and airport transfers on request.';

/**
 * @param {Record<string, unknown> | null | undefined} room
 * @returns {Record<string, unknown> | null}
 */
export function enrichRoomForModal(room) {
    if (!room) return null;
    const r = room;
    const amenities =
        Array.isArray(r.amenitiesInRoom) && r.amenitiesInRoom.length > 0
            ? r.amenitiesInRoom
            : [
                  'Climate control',
                  'Private bathroom',
                  'Premium linens & towels',
                  'In-room safe',
              ];

    return {
        ...r,
        maxGuests: typeof r.maxGuests === 'number' && r.maxGuests > 0 ? r.maxGuests : 2,
        roomTagline: r.roomTagline || null,
        amenitiesInRoom: amenities,
        resortServicesIncluded: r.resortServicesIncluded || LUNA_DEFAULT_RESORT_SERVICES,
    };
}
