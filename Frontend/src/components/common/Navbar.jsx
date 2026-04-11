import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService.js';

const navLinkClass = ({ isActive }) => (isActive ? 'active' : undefined);

function Navbar() {
    const isAuthenticated = ApiService.isAuthenticated();
    const isAdmin = ApiService.isAdmin();
    const isUser = ApiService.isUser();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const toggleMenu = () => {
        setMenuOpen((open) => !open);
    };

    const handleLogout = () => {
        const isLogout = window.confirm('Are you sure you want to logout this user?');
        if (isLogout) {
            closeMenu();
            ApiService.logout();
            navigate('/home');
        }
    };

    return (
        <nav className={`navbar${menuOpen ? ' navbar--menu-open' : ''}`}>
            <div className="navbar-brand">
                <NavLink to="/home" onClick={closeMenu}>
                    Luna Hotel
                </NavLink>
            </div>

            <button
                type="button"
                className="navbar-toggle"
                aria-expanded={menuOpen}
                aria-controls="navbar-main-menu"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                onClick={toggleMenu}
            >
                <span className="navbar-toggle-bar" />
                <span className="navbar-toggle-bar" />
                <span className="navbar-toggle-bar" />
            </button>

            <ul id="navbar-main-menu" className="navbar-ul">
                <li>
                    <NavLink to="/home" className={navLinkClass} onClick={closeMenu}>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/rooms" className={navLinkClass} onClick={closeMenu}>
                        Rooms
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/find-booking" className={navLinkClass} onClick={closeMenu}>
                        Find my Booking
                    </NavLink>
                </li>

                {isUser && (
                    <li>
                        <NavLink to="/profile" className={navLinkClass} onClick={closeMenu}>
                            Profile
                        </NavLink>
                    </li>
                )}

                {isAdmin && (
                    <li>
                        <NavLink to="/admin" className={navLinkClass} onClick={closeMenu}>
                            Admin
                        </NavLink>
                    </li>
                )}

                {!isAuthenticated && (
                    <li>
                        <NavLink to="/login" className={navLinkClass} onClick={closeMenu}>
                            Login
                        </NavLink>
                    </li>
                )}

                {!isAuthenticated && (
                    <li>
                        <NavLink to="/register" className={navLinkClass} onClick={closeMenu}>
                            Register
                        </NavLink>
                    </li>
                )}

                {isAuthenticated && (
                    <li>
                        <button type="button" className="navbar-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;