const FooterComponent = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="site-footer-inner">
                <div className="site-footer-grid">
                    <div className="site-footer-col">
                        <h3 className="site-footer-brand">Luna Hotel</h3>
                        <p className="site-footer-text">
                            Lot 127, Jalan Pantai Cenang
                            <br />
                            Pantai Cenang, Langkawi
                            <br />
                            07000 Kedah, Malaysia
                        </p>
                    </div>

                    <div className="site-footer-col">
                        <h4 className="site-footer-heading">Contact</h4>
                        <p className="site-footer-text">
                            <a className="site-footer-link" href="tel:+6049550100">
                                +60 4-955 0100
                            </a>
                        </p>
                        <p className="site-footer-text">
                            <a
                                className="site-footer-link"
                                href="mailto:reservations@lunahotel.my"
                            >
                                reservations@lunahotel.my
                            </a>
                        </p>
                        <p className="site-footer-text">
                            <a className="site-footer-link" href="mailto:concierge@lunahotel.my">
                                concierge@lunahotel.my
                            </a>
                        </p>
                    </div>

                    <div className="site-footer-col">
                        <h4 className="site-footer-heading">Stay information</h4>
                        <p className="site-footer-text">
                            <strong>Check-in:</strong> from 3:00 PM
                        </p>
                        <p className="site-footer-text">
                            <strong>Check-out:</strong> by 11:00 AM
                        </p>
                        <p className="site-footer-text">
                            <strong>Quiet hours:</strong> 10:00 PM – 7:00 AM. Please keep noise low in
                            corridors, lanais, and on balconies.
                        </p>
                        <p className="site-footer-text">
                            <strong>Airport transfer:</strong> not included in the room rate. Concierge
                            can arrange a licensed taxi or private car (paid locally).
                        </p>
                        <p className="site-footer-text">
                            <strong>Reception:</strong> staffed 24 hours, 7 days a week.
                        </p>
                    </div>

                    <div className="site-footer-col">
                        <h4 className="site-footer-heading">Follow us</h4>
                        <div className="site-footer-social">
                            <a
                                className="site-footer-social-link"
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                            >
                                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                                    <path
                                        fill="currentColor"
                                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                    />
                                </svg>
                            </a>
                            <a
                                className="site-footer-social-link"
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                            >
                                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                                    <path
                                        fill="currentColor"
                                        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                                    />
                                </svg>
                            </a>
                            <a
                                className="site-footer-social-link"
                                href="https://x.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="X"
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                                    <path
                                        fill="currentColor"
                                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="site-footer-col">
                        <h4 className="site-footer-heading">Awards</h4>
                        <ul className="footer-awards-list" aria-label="Hotel awards">
                            <li className="footer-award-item">
                                <span className="footer-award-medal" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path
                                            fill="currentColor"
                                            d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z"
                                        />
                                    </svg>
                                </span>
                                <span className="footer-award-name">Travelers&apos; Choice</span>
                            </li>
                            <li className="footer-award-item">
                                <span className="footer-award-medal footer-award-medal--leaf" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path
                                            fill="currentColor"
                                            d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75L7 19c0-1 0.5-3.5 3-5 2.54-1.5 5.25-1.75 7.25-2.25S17 8 17 8z"
                                        />
                                    </svg>
                                </span>
                                <span className="footer-award-name">Green Key</span>
                            </li>
                            <li className="footer-award-item">
                                <span className="footer-award-medal footer-award-medal--crown" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path
                                            fill="currentColor"
                                            d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm2.7-2h8.6l.9-5.5-2.7 2-3.4-4-3.4 4-2.7-2L7.7 14z"
                                        />
                                    </svg>
                                </span>
                                <span className="footer-award-name">Luxury pick</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="site-footer-bottom">
                    <p>Luna Hotel · All rights reserved © {year}</p>
                </div>
            </div>
        </footer>
    );
};

export default FooterComponent;
