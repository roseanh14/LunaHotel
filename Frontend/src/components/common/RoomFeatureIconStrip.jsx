import React from 'react';

const svgProps = {
    viewBox: '0 0 24 24',
    width: 26,
    height: 26,
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true,
};

function Svg({ children, className }) {
    return (
        <svg
            {...svgProps}
            className={className}
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {children}
        </svg>
    );
}

/** Reusable strokes — teal via CSS currentColor */
const Icons = {
    /** Side-view bed: headboard + mattress + pillow (wider = king). */
    bedKing: (
        <Svg>
            <path d="M3.5 7v10.5M3.5 17.5h16M3.5 12.5h16v5H3.5v-5z" />
            <path d="M5.5 10h9v2.5h-9z" />
        </Svg>
    ),
    bedQueen: (
        <Svg>
            <path d="M3.5 7v10.5M3.5 17.5h14M3.5 12.5h14v5H3.5v-5z" />
            <path d="M5.5 10h7.5v2.5h-7.5z" />
        </Svg>
    ),
    /** Pipe, round shower head, streams + drops (rain shower). */
    shower: (
        <Svg>
            <path d="M12 2.5v3.75" />
            <circle cx="12" cy="9" r="2.85" fill="none" />
            <path d="M7.25 12.75v3.25M9.25 11.75v4.25M12 11.25v5M14.75 11.75v4.25M16.75 12.75v3.25" />
            <path d="M8.5 17l-.55 2.35M12 17.5v2.35M15.5 17l.55 2.35" />
        </Svg>
    ),
    tub: (
        <Svg>
            <path d="M4 12h16v4a3 3 0 01-3 3H7a3 3 0 01-3-3v-4zM6 12V9a3 3 0 013-3h1M10 6V5M14 6V5" />
        </Svg>
    ),
    /** Balcony / furnished terrace (no water line). */
    terrace: (
        <Svg>
            <path d="M2.5 18.5h19" />
            <path d="M4.5 18.5v-5.5l7.5-4 7.5 4v5.5" />
            <path d="M4.5 14.5h15" />
            <path d="M6.5 18.5v-2.5M12 18.5v-2.5M17.5 18.5v-2.5" />
        </Svg>
    ),
    beach: (
        <Svg>
            <path d="M2 20c4-4 8-4 12 0M6 16c2-2 6-2 10 0M3 12h18M12 3v2M10 5l2 2 2-2" />
        </Svg>
    ),
    pool: (
        <Svg>
            <path d="M2 12c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2M2 18c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />
        </Svg>
    ),
    coffee: (
        <Svg>
            <path d="M6 8h10v5a3 3 0 01-3 3H9a3 3 0 01-3-3V8zM16 10h2a2 2 0 010 4h-2M6 18h8" />
        </Svg>
    ),
    speaker: (
        <Svg>
            <path d="M5 9v6h4l5 3V6L9 9H5zM16 9a3 3 0 010 6M17 7a6 6 0 010 10" />
        </Svg>
    ),
    curtains: (
        <Svg>
            <path d="M4 4h16M6 4v16M12 4v16M18 4v16M4 20h16" />
        </Svg>
    ),
    armchair: (
        <Svg>
            <path d="M6 11h12v5a2 2 0 01-2 2h-1v2H9v-2H8a2 2 0 01-2-2v-5zM8 11V9a4 4 0 018 0v2" />
        </Svg>
    ),
    sofa: (
        <Svg>
            <path d="M5 11V9a2 2 0 012-2h10a2 2 0 012 2v2M3 14h18v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3zM5 14V12a2 2 0 012-2M19 14V12a2 2 0 00-2-2" />
        </Svg>
    ),
    door: (
        <Svg>
            <path d="M13 3h6v18H5V3h6M13 3v18M11 12h.01" />
        </Svg>
    ),
    tv: (
        <Svg>
            <path d="M4 7h16v10H4zM8 21h8M12 17v4" />
        </Svg>
    ),
    desk: (
        <Svg>
            <path d="M4 19h16M6 19V9h12v10M9 9V7h6v2" />
        </Svg>
    ),
    fridge: (
        <Svg>
            <path d="M6 3h12v18H6zM6 9h12M10 14h.01" />
        </Svg>
    ),
    wine: (
        <Svg>
            <path d="M8 22h8M12 11v11M9 2h6l1 5a4 4 0 01-8 0l1-5z" />
        </Svg>
    ),
    balcony: (
        <Svg>
            <path d="M3 21h18M4 21V12l8-4 8 4v9M8 21v-3h8v3" />
        </Svg>
    ),
    sparkles: (
        <Svg>
            <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1M12 8l1.5 3.5L17 13l-3.5 1.5L12 18l-1.5-3.5L7 13l3.5-1.5L12 8z" />
        </Svg>
    ),
    glass: (
        <Svg>
            <path d="M4 4h16v16H4zM4 12h16M12 4v16M8 8h.01M16 16h.01" />
        </Svg>
    ),
    /** Plank deck, railing, sea waves. */
    deck: (
        <Svg>
            <path d="M1.5 19.5c2.2-1.2 4.6-1.2 6.8 0s4.6-1.2 6.8 0 4.6-1.2 6.8 0 4.6-1.2 6.8 0" />
            <path d="M3 16.5h18" />
            <path d="M4 10.5h16M4 10.5v5.5M8.5 10.5v4.5M12 10.5v5M15.5 10.5v4.5M20 10.5v5.5" />
            <path d="M6 16.5v2M12 16.5v2M18 16.5v2" />
        </Svg>
    ),
    butler: (
        <Svg>
            <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0M9 3h6" />
        </Svg>
    ),
    kitchen: (
        <Svg>
            <path d="M4 10h4v10H4zM10 6h10v14H10zM14 6V4M18 6V4M14 10h4M14 14h4" />
        </Svg>
    ),
    dining: (
        <Svg>
            <path d="M4 11h16M4 15h16M8 11V7M12 11V6M16 11V7M6 21v-4M12 21v-4M18 21v-4" />
        </Svg>
    ),
    media: (
        <Svg>
            <path d="M4 8h16v8H4zM8 21h8M15 3l3 3M9 3L6 6" />
        </Svg>
    ),
    plane: (
        <Svg>
            <path d="M10 18h4M2 12h4l3 8 2-16 2 16 3-8h4" />
        </Svg>
    ),
    building: (
        <Svg>
            <path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18M6 12h12M10 8h.01M14 8h.01M10 16h.01M14 16h.01" />
        </Svg>
    ),
    gym: (
        <Svg>
            <path d="M6 5l-3 3v8l3 3M18 5l3 3v8l-3 3M14 12h-4M8 9l-2 2M16 9l2 2M8 15l-2-2M16 15l2-2" />
        </Svg>
    ),
    concierge: (
        <Svg>
            <path d="M6 8h12v4a4 4 0 01-4 4h-1v2H11v-2h-1a4 4 0 01-4-4V8zM10 4h4l1 2H9l1-2zM9 18h6" />
        </Svg>
    ),
    cabana: (
        <Svg>
            <path d="M12 3v18M4 10l8-5 8 5M6 22h12" />
        </Svg>
    ),
    robes: (
        <Svg>
            <path d="M8 3h8l2 4v14H6V7l2-4zM9 7h6M10 11h4" />
        </Svg>
    ),
    vanity: (
        <Svg>
            <path d="M4 10h16M6 10v8M18 10v8M8 18h8M12 6V4M9 4h6" />
        </Svg>
    ),
    minibar: (
        <Svg>
            <path d="M8 3h8v18H8zM8 10h8M10 6h.01M14 6h.01" />
        </Svg>
    ),
};

const ROOM_FEATURE_ICON_MAP = {
    beach: { icon: Icons.beach, label: 'Beach access' },
    kingBed: { icon: Icons.bedKing, label: 'King bed' },
    queenBed: { icon: Icons.bedQueen, label: 'Queen bed' },
    outdoorShower: { icon: Icons.shower, label: 'Rain shower' },
    terrace: { icon: Icons.terrace, label: 'Private terrace' },
    coffee: { icon: Icons.coffee, label: 'Nespresso / coffee' },
    minibar: { icon: Icons.minibar, label: 'Minibar' },
    sofa: { icon: Icons.sofa, label: 'Sofa area' },
    connecting: { icon: Icons.door, label: 'Connecting suite' },
    shower: { icon: Icons.shower, label: 'Rain shower' },
    tv: { icon: Icons.tv, label: 'Smart TV' },
    tub: { icon: Icons.tub, label: 'Plunge / soaking tub' },
    champagne: { icon: Icons.wine, label: 'Champagne welcome' },
    balcony: { icon: Icons.balcony, label: 'Ocean-view balcony' },
    luxuryBath: { icon: Icons.sparkles, label: 'Luxury bath amenities' },
    desk: { icon: Icons.desk, label: 'Work desk' },
    fridge: { icon: Icons.fridge, label: 'Mini fridge' },
    glassFloor: { icon: Icons.glass, label: 'Glass floor panels' },
    seaDeck: { icon: Icons.deck, label: 'Private sea deck' },
    butler: { icon: Icons.butler, label: 'Butler service' },
    outdoorTub: { icon: Icons.tub, label: 'Outdoor tub' },
    penthouse: { icon: Icons.building, label: 'Top-floor residence' },
    kitchen: { icon: Icons.kitchen, label: 'Full kitchen' },
    dining: { icon: Icons.dining, label: 'Dining space' },
    media: { icon: Icons.media, label: 'Media room' },
    transfer: { icon: Icons.plane, label: 'Airport transfer' },
    bedrooms: { icon: Icons.bedKing, label: 'Two bedrooms' },
    gym: { icon: Icons.gym, label: 'Private gym access' },
    study: { icon: Icons.desk, label: 'Study & lounge' },
    concierge: { icon: Icons.concierge, label: '24/7 concierge' },
    poolAccess: { icon: Icons.pool, label: 'Pool-terrace access' },
    cabana: { icon: Icons.cabana, label: 'Poolside cabana' },
    robes: { icon: Icons.robes, label: 'Robes & slippers' },
    vanity: { icon: Icons.vanity, label: 'Double vanity' },
    speaker: { icon: Icons.speaker, label: 'Bluetooth speaker' },
    curtains: { icon: Icons.curtains, label: 'Blackout curtains' },
    armchair: { icon: Icons.armchair, label: 'Reading armchair' },
};

const DEFAULT_KEYS = ['kingBed', 'outdoorShower', 'seaDeck', 'coffee', 'tv'];

/**
 * @param {{ iconKeys?: string[] }} props
 */
export default function RoomFeatureIconStrip({ iconKeys }) {
    const keys =
        Array.isArray(iconKeys) && iconKeys.length > 0 ? iconKeys.slice(0, 5) : DEFAULT_KEYS;

    return (
        <div className="room-feature-icons" aria-label="Room highlights">
            {keys.map((key) => {
                const def = ROOM_FEATURE_ICON_MAP[key];
                if (!def) return null;
                return (
                    <div key={`${key}-${def.label}`} className="room-feature-icons-item">
                        <span className="room-feature-icons-glyph">{def.icon}</span>
                        <span className="room-feature-icons-label">{def.label}</span>
                    </div>
                );
            })}
        </div>
    );
}
