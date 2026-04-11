import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import ApiService from '../../service/ApiService.js';

const navLinkClass = ({ isActive }) => (isActive ? 'active' : undefined);

function Navbar() {
    const isAuthenticated = ApiService.isAuthenticated();
    const isAdmin = ApiService.isAdmin();
    const isUser = ApiService.isUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        const isLogout = window.confirm('Are you sure you want to logout this user?');
        if (isLogout) {
            ApiService.logout();
            navigate('/home');
        }
    };

    return (
        <nav className={`navbar${menuOpen ? ' navbar--menu-open' : ''}`}>
            <div className="navbar-brand">
                <NavLink to="/home">Luna Hotel</NavLink>
            </div>
            <button
                type="button"
                className="navbar-toggle"
                aria-expanded={menuOpen}
                aria-controls="navbar-main-menu"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMenuOpen((open) => !open)}
            >
                <span className="navbar-toggle-bar" />
                <span className="navbar-toggle-bar" />
                <span className="navbar-toggle-bar" />
            </button>
            <ul id="navbar-main-menu" className="navbar-ul">
                <li><NavLink to="/home" className={navLinkClass}>Home</NavLink></li>
                <li><NavLink to="/rooms" className={navLinkClass}>Rooms</NavLink></li>
                <li><NavLink to="/find-booking" className={navLinkClass}>Find my Booking</NavLink></li>

                {isUser && <li><NavLink to="/profile" className={navLinkClass}>Profile</NavLink></li>}
                {isAdmin && <li><NavLink to="/admin" className={navLinkClass}>Admin</NavLink></li>}

                {!isAuthenticated && <li><NavLink to="/login" className={navLinkClass}>Login</NavLink></li>}
                {!isAuthenticated && <li><NavLink to="/register" className={navLinkClass}>Register</NavLink></li>}
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