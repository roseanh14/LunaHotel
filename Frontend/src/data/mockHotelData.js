/**
 * Luna Hotel seed data — rooms match /public/assets/rooms/*.png
 * Used when VITE_USE_MOCK_DATA=true (see .env.development).
 */

const desc = (text) => text.trim();

export const MOCK_ROOMS = [
    {
        id: 1,
        roomType: 'Beach Villa',
        roomPrice: 749,
        roomPhotoUrl: '/assets/rooms/BeachVilla.png',
        isBooked: false,
        bookings: [],
        roomDescription: desc(`
      Direct beach access, private sea deck, and sunset views over the lagoon.
      Includes king bed, outdoor rain shower, and daily turndown service.
    `),
        maxGuests: 4,
        roomTagline: 'Private beach, lagoon views, and open-air island living.',
        amenitiesInRoom: [
            'King bed',
            'Outdoor rain shower',
            'Private sea deck with loungers',
            'Nespresso coffee station',
            'Stocked minibar',
            'Evening turndown service',
        ],
        roomFeatureIconKeys: ['beach', 'kingBed', 'outdoorShower', 'seaDeck', 'coffee'],
    },
    {
        id: 2,
        roomType: 'Garden Twin Suite',
        roomPrice: 329,
        roomPhotoUrl: '/assets/rooms/Familyroom.png',
        isBooked: false,
        bookings: [
            {
                id: 901,
                guestName: 'Jordan Lee',
                bookingConfirmationCode: 'LH-915302',
                checkInDate: '2026-07-10',
                checkOutDate: '2026-07-17',
            },
        ],
        roomDescription: desc(`
      Two queen beds, a sofa corner, and space to unpack and unwind.
      Connecting suites available on request — perfect for two couples or friends travelling together.
    `),
        maxGuests: 4,
        roomTagline: 'Two queens, sofa corner, optional connecting door for groups.',
        amenitiesInRoom: [
            'Two queen beds',
            'Sofa seating area',
            'Connecting suite on request',
            'Rain shower & double vanity',
            'Smart TV',
            'Workspace nook',
        ],
        roomFeatureIconKeys: ['queenBed', 'sofa', 'connecting', 'shower', 'tv'],
    },
    {
        id: 3,
        roomType: 'Honeymoon Suite',
        roomPrice: 649,
        roomPhotoUrl: '/assets/rooms/HoneymoonSuite.png',
        isBooked: false,
        bookings: [
            {
                id: 302,
                guestName: 'Alex Rivera',
                bookingConfirmationCode: 'LH-284719',
                checkInDate: '2026-06-01',
                checkOutDate: '2026-06-15',
            },
        ],
        roomDescription: desc(`
      Romantic suite with plunge tub, champagne welcome, and ocean-view balcony.
      Flower petals and late checkout included on request.
    `),
        maxGuests: 2,
        roomTagline: 'Romantic suite with plunge tub and ocean-view balcony.',
        amenitiesInRoom: [
            'King bed',
            'Plunge tub',
            'Champagne welcome',
            'Ocean-view balcony',
            'Luxury bath products',
            'Late checkout on request',
        ],
        roomFeatureIconKeys: ['kingBed', 'tub', 'champagne', 'balcony', 'luxuryBath'],
    },
    {
        id: 4,
        roomType: 'Junior Suite',
        roomPrice: 399,
        roomPhotoUrl: '/assets/rooms/JuniorSuite.png',
        isBooked: false,
        bookings: [
            {
                id: 402,
                guestName: 'Test Guest 123',
                bookingConfirmationCode: 'LH-100123',
                checkInDate: '2026-05-05',
                checkOutDate: '2026-05-08',
            },
        ],
        roomDescription: desc(`
      Separate sitting area, workspace, and premium linens.
      Perfect for longer stays or light business trips.
    `),
        maxGuests: 3,
        roomTagline: 'Separate lounge, desk, and premium linens for longer stays.',
        amenitiesInRoom: [
            'King bed',
            'Sitting area with sofa',
            'Work desk & chair',
            'Premium linens',
            'Walk-in rain shower',
            'Mini fridge',
        ],
        roomFeatureIconKeys: ['kingBed', 'sofa', 'desk', 'shower', 'fridge'],
    },
    {
        id: 5,
        roomType: 'Overwater Bungalow',
        roomPrice: 999,
        roomPhotoUrl: '/assets/rooms/OverwaterBungalow.png',
        isBooked: false,
        bookings: [],
        roomDescription: desc(`
      Glass floor panels, private deck with ladder to the sea, and butler service.
      The signature Luna Hotel experience above turquoise water.
    `),
        maxGuests: 2,
        roomTagline: 'Glass floors, private sea deck, and dedicated butler service.',
        amenitiesInRoom: [
            'King bed',
            'Glass viewing panels',
            'Private deck & sea ladder',
            'Butler service',
            'Outdoor soaking tub',
            'Champagne on arrival',
        ],
        roomFeatureIconKeys: ['kingBed', 'glassFloor', 'seaDeck', 'butler', 'outdoorTub'],
    },
    {
        id: 6,
        roomType: 'Penthouse Suite',
        roomPrice: 1299,
        roomPhotoUrl: '/assets/rooms/PenthouseSuite.png',
        isBooked: false,
        bookings: [],
        roomDescription: desc(`
      Top-floor panoramic views, full kitchen, dining for up to eight guests, and media room.
      Includes airport transfer and priority restaurant reservations.
    `),
        maxGuests: 8,
        roomTagline: 'Top-floor residence with full kitchen and panoramic views.',
        amenitiesInRoom: [
            'Panoramic lounge',
            'Full kitchen & dining for eight',
            'Media room',
            'Guest powder room',
            'Airport transfer included',
            'Priority dining reservations',
        ],
        roomFeatureIconKeys: ['penthouse', 'kitchen', 'dining', 'media', 'transfer'],
    },
    {
        id: 7,
        roomType: 'Presidential Suite',
        roomPrice: 1899,
        roomPhotoUrl: '/assets/rooms/PresidentialSuite.png',
        isBooked: true,
        bookings: [],
        roomDescription: desc(`
      Two bedrooms, private gym access, and 24/7 concierge.
      The ultimate choice for VIP stays and extended visits.
    `),
        maxGuests: 6,
        roomTagline: 'Two bedrooms, private gym access, and round-the-clock concierge.',
        amenitiesInRoom: [
            'Two bedrooms with king beds',
            'Private gym access',
            'Formal dining for six',
            'Study & media lounge',
            '24/7 concierge',
            'VIP airport handling',
        ],
        roomFeatureIconKeys: ['bedrooms', 'gym', 'dining', 'study', 'concierge'],
    },
    {
        id: 8,
        roomType: 'Swim-up Room',
        roomPrice: 459,
        roomPhotoUrl: '/assets/rooms/SwimUpRoom.png',
        isBooked: false,
        bookings: [
            {
                id: 802,
                guestName: 'admin',
                bookingConfirmationCode: 'LH-880045',
                checkInDate: '2026-09-01',
                checkOutDate: '2026-09-05',
            },
        ],
        roomDescription: desc(`
      Step from your terrace straight into the lagoon-style pool.
      King bed, double vanity, and poolside cabana reserved for guests.
    `),
        maxGuests: 2,
        roomTagline: 'Terrace opens straight into the lagoon pool.',
        amenitiesInRoom: [
            'King bed',
            'Pool-terrace access',
            'Double vanity',
            'Reserved poolside cabana',
            'Outdoor seating',
            'Robes & slippers',
        ],
        roomFeatureIconKeys: ['kingBed', 'poolAccess', 'vanity', 'cabana', 'robes'],
    },
    {
        id: 9,
        roomType: 'Terrace Room',
        roomPrice: 279,
        roomPhotoUrl: '/assets/rooms/TeraseRoom.png',
        isBooked: false,
        bookings: [],
        roomDescription: desc(`
      Garden or partial sea view from a wide private terrace.
      Quiet wing, ideal for readers and slow mornings with coffee.
    `),
        maxGuests: 2,
        roomTagline: 'Wide terrace with garden or partial sea view in a quiet wing.',
        amenitiesInRoom: [
            'Queen bed',
            'Private furnished terrace',
            'Nespresso machine',
            'Bluetooth speaker',
            'Blackout curtains',
            'Reading armchair',
        ],
        roomFeatureIconKeys: ['terrace', 'coffee', 'speaker', 'curtains', 'armchair'],
    },
];

/** Room detail screen expects `description` in destructuring — keep in sync */
export function toRoomApiShape(room) {
    return {
        ...room,
        description: room.roomDescription,
    };
}

export function getMockRoomTypes() {
    return [...new Set(MOCK_ROOMS.map((r) => r.roomType))].sort();
}

export function getMockRoomListResponse() {
    return { roomList: MOCK_ROOMS.map((r) => ({ ...r })) };
}

export function getMockRoomById(roomId) {
    const id = Number(roomId);
    const room = MOCK_ROOMS.find((r) => r.id === id);
    if (!room) return null;
    return { room: toRoomApiShape({ ...room }) };
}

/** YYYY-MM-DD intervals [checkIn, checkOut) — overlap if another stay blocks the requested nights */
function mockStayRangesOverlap(searchIn, searchOut, bookIn, bookOut) {
    return bookIn < searchOut && bookOut > searchIn;
}

/**
 * Rooms of this type for availability search: always returns every room of the type.
 * `isBooked` is true if the requested dates overlap a mock reservation, or the room is permanently closed (isBooked with no bookings).
 */
export function getMockAvailableByDateAndType(checkInDate, checkOutDate, roomType) {
    const list = MOCK_ROOMS.filter((r) => r.roomType === roomType).map((r) => {
        const bookings = (r.bookings || []).map((b) => ({ ...b }));
        const blockedByStay = bookings.some((b) =>
            mockStayRangesOverlap(
                checkInDate,
                checkOutDate,
                b.checkInDate,
                b.checkOutDate
            )
        );
        const permanentlyClosed = r.isBooked && (!r.bookings || r.bookings.length === 0);
        return {
            ...r,
            bookings,
            isBooked: blockedByStay || permanentlyClosed,
        };
    });
    return { statusCode: 200, roomList: list };
}

export const MOCK_SERVICES = [
    {
        key: 'pool',
        title: 'Infinity pool',
        image: '/assets/services/Pool.png',
        description:
            'Heated infinity pool with cabanas, poolside bar service, and quiet lounger zones.',
        detail:
            'Our signature infinity edge faces the ocean, with temperature-controlled water year-round. Complimentary towels, sun cream stations, and shallow areas for families. Pool attendants are on duty from mid-morning until sunset.',
    },
    {
        key: 'spa',
        title: 'Spa & wellness',
        image: '/assets/services/Spa.png',
        description:
            'Massages, facials, and hydrotherapy. Book couples rituals or quick express treatments.',
        detail:
            'Treatment suites overlook the gardens. We use botanical oils and offer steam, sauna, and a relaxation lounge with herbal tea. Reserve at least 24 hours ahead for weekend slots.',
    },
    {
        key: 'breakfast',
        title: 'Breakfast buffet',
        image: '/assets/services/Breakfast.png',
        description:
            'Fresh tropical fruit, pastries, eggs to order, and barista coffee every morning.',
        detail:
            'Served in the main dining room and on the terrace when weather allows. Gluten-free and plant-based options are labeled; tell your server about any allergies. Typical hours: 6:30–10:30.',
    },
    {
        key: 'dining',
        title: 'Fine dining',
        image: '/assets/services/FineDining.png',
        description:
            'Chef’s tasting menus and wine pairings with sunset seating on the terrace.',
        detail:
            'Seasonal menus highlight local seafood and produce. Dress code is smart casual; jackets not required. We recommend booking dinner on arrival—window tables for sunset are limited.',
    },
    {
        key: 'fitness',
        title: 'Fitness center',
        image: '/assets/services/FitnessCenter.png',
        description:
            'Cardio, free weights, yoga mats, and chilled towels. Open from dawn to late evening.',
        detail:
            'Air-conditioned gym with treadmills, bikes, and a small functional-training zone. Complimentary water and headphones. Personal training can be arranged through the front desk.',
    },
    {
        key: 'beach-club',
        title: 'Beach club',
        image: '/assets/services/BeachClub.png',
        description:
            'Loungers, umbrellas, and water sports desk for kayaks, snorkels, and paddleboards.',
        detail:
            'Beach staff set up loungers and umbrellas daily. Non-motorized equipment is included for guests; lessons and guided snorkels are available for a fee. Showers and changing rooms are steps from the sand.',
    },
    {
        key: 'lounge',
        title: 'Lobby lounge',
        image: '/assets/services/Lounge.png',
        description:
            'Afternoon tea, cocktails, and live acoustic sets in a relaxed island setting.',
        detail:
            'Open all day for coffee and pastries, switching to cocktails and small plates in the evening. Live music is scheduled several nights a week—check the daily program at reception.',
    },
    {
        key: 'lobby',
        title: 'Arrival experience',
        image: '/assets/services/HotelLobby.png',
        description:
            'Open-air lobby with welcome drink, concierge, and express check-in kiosks.',
        detail:
            'You’ll be greeted with a cool towel and a signature welcome drink. Concierge can arrange transfers, excursions, and restaurant bookings. Luggage assistance is available from the porte-cochère.',
    },
    {
        key: 'pathway',
        title: 'Garden pathways',
        image: '/assets/services/Pathway.png',
        description:
            'Lit walking paths through palms—ideal for morning jogs or evening strolls.',
        detail:
            'Well-maintained paths connect the rooms, pool, and beach without crossing service roads. Low landscape lighting keeps evening walks safe and preserves the night sky for stargazing.',
    },
    {
        key: 'wifi',
        title: 'Guest Wi‑Fi',
        image: '/assets/images/wifi.jpg',
        description:
            'Complimentary high-speed wireless internet in every room, suite, and main public areas.',
        detail:
            'Connect on arrival with the password in your welcome folder. Bandwidth supports video calls and streaming; if you need a dedicated line for work, ask the front desk for a premium upgrade subject to availability.',
    },
    {
        key: 'parking',
        title: 'Parking',
        image: '/assets/images/parking.jpg',
        description:
            'On-site spaces for cars and scooters—self-park or valet through reception.',
        detail:
            'Covered and open-air bays are close to the lobby. Electric-vehicle chargers are available on a first-come basis; reserve valet the evening before if you prefer hand-over keys on arrival. Street overflow is not required for most stays.',
    },
    {
        key: 'nightscape',
        title: 'Evening ambiance',
        image: '/assets/services/ResortNightscape.png',
        description:
            'Subtle lighting across pools and gardens for a calm, resort-night atmosphere.',
        detail:
            'We use warm, downward-facing fixtures to avoid glare and protect wildlife. Pool and garden areas stay gently illuminated until late night so you can enjoy the grounds safely after dinner.',
    },
];

export const MOCK_BOOKINGS_ADMIN = [
    {
        id: 1,
        bookingConfirmationCode: 'LH-284719',
        checkInDate: '2026-06-01',
        checkOutDate: '2026-06-07',
        totalNumOfGuest: 2,
    },
    {
        id: 2,
        bookingConfirmationCode: 'LH-915302',
        checkInDate: '2026-08-12',
        checkOutDate: '2026-08-19',
        totalNumOfGuest: 2,
    },
    {
        id: 3,
        bookingConfirmationCode: 'LH-440821',
        checkInDate: '2026-05-03',
        checkOutDate: '2026-05-06',
        totalNumOfGuest: 4,
    },
];

export function getMockBookingByCode(code) {
    const normalized = String(code || '').trim().toUpperCase().replace(/\s/g, '');
    if (normalized !== 'LH-284719' && normalized !== 'LH-915302') {
        return null;
    }
    if (normalized === 'LH-284719') {
        const room =
            MOCK_ROOMS.find((r) => r.roomType === 'Honeymoon Suite') || MOCK_ROOMS[2];
        return {
            booking: {
                bookingConfirmationCode: normalized,
                checkInDate: '2026-06-01',
                checkOutDate: '2026-06-07',
                numOfAdults: 2,
                user: {
                    name: 'Alex Rivera',
                    email: 'alex.rivera@example.com',
                    phoneNumber: '+1 (555) 014-2201',
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
    const room2 =
        MOCK_ROOMS.find((r) => r.roomType === 'Overwater Bungalow') || MOCK_ROOMS[4];
    return {
        booking: {
            bookingConfirmationCode: normalized,
            checkInDate: '2026-08-12',
            checkOutDate: '2026-08-19',
            numOfAdults: 2,
            user: {
                name: 'Jordan Lee',
                email: 'jordan.lee@example.com',
                phoneNumber: '+1 (555) 018-9034',
            },
            room: {
                roomType: room2.roomType,
                roomPhotoUrl: room2.roomPhotoUrl,
                roomPrice: room2.roomPrice,
                roomDescription: room2.roomDescription,
            },
        },
    };
}
