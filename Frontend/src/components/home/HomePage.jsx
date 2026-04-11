import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";
import { MOCK_SERVICES } from "../../data/mockHotelData";
import ApiService from "../../service/ApiService";

const HomePage = () => {
    const [roomSearchResults, setRoomSearchResults] = useState([]);
    const [roomsLoading, setRoomsLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);
    const [afterAvailabilitySearch, setAfterAvailabilitySearch] = useState(false);

    const handleSearchResult = (results) => {
        setRoomSearchResults(results);
    };

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const response = await ApiService.getAllRooms();
                if (!cancelled && response?.roomList) {
                    setRoomSearchResults(response.roomList);
                }
            } catch (e) {
                console.error("Failed to load rooms on home:", e);
            } finally {
                if (!cancelled) setRoomsLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!selectedService) return undefined;
        const onKey = (e) => {
            if (e.key === "Escape") setSelectedService(null);
        };
        document.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [selectedService]);

    return (
        <div className="home">
            <section>
                <header className="header-banner">
                    <img
                        src="/assets/images/hotel.jpg"
                        alt="Luna Hotel"
                        className="header-image"
                    />

                    <div className="animated-texts overlay-content">
                        <h1>
                            Welcome to <span className="luna-color">Luna Hotel</span>
                        </h1>
                        <h3 className="home-hero-tagline">
                            Step into a haven of comfort and care
                        </h3>
                    </div>
                </header>
            </section>

            <RoomSearch
                handleSearchResult={handleSearchResult}
                onSearchSuccess={() => setAfterAvailabilitySearch(true)}
            />
            {roomsLoading ? (
                <p className="home-rooms-loading">Loading rooms…</p>
            ) : (
                <RoomResult
                    roomSearchResults={roomSearchResults}
                    afterAvailabilitySearch={afterAvailabilitySearch}
                />
            )}

            <div className="home-all-rooms-cta">
                <Link className="home-all-rooms-button" to="/rooms">
                    All Rooms
                </Link>
            </div>

            <div className="home-services-wrap">
                <h2 className="home-services">
                    Services at <span className="luna-color">Luna Hotel</span>
                </h2>

                <section className="service-section">
                    {MOCK_SERVICES.map((svc) => (
                        <div
                            className="service-card service-card--interactive"
                            key={svc.key}
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelectedService(svc)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setSelectedService(svc);
                                }
                            }}
                        >
                            <img src={svc.image} alt="" />
                            <div className="service-details">
                                <h3 className="service-title">{svc.title}</h3>
                                <p className="service-description">{svc.description}</p>
                            </div>
                        </div>
                    ))}
                </section>
            </div>

            {selectedService ? (
                <div
                    className="service-modal-backdrop"
                    role="presentation"
                    onClick={() => setSelectedService(null)}
                >
                    <div
                        className="service-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="service-modal-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="service-modal-close"
                            onClick={() => setSelectedService(null)}
                            aria-label="Close"
                        >
                            ×
                        </button>
                        <div className="service-modal-image-wrap">
                            <img
                                src={selectedService.image}
                                alt=""
                                className="service-modal-image"
                            />
                        </div>
                        <div className="service-modal-body">
                            <h3 id="service-modal-title" className="service-modal-title">
                                {selectedService.title}
                            </h3>
                            <p className="service-modal-lead">
                                {selectedService.description}
                            </p>
                            <p className="service-modal-detail">
                                {selectedService.detail}
                            </p>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default HomePage;