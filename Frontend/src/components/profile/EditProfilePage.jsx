import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const EditProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const response = await ApiService.getUserProfile();
                setUser(response && response.user ? response.user : null);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to load profile.');
            }
        }

        void fetchUserProfile();
    }, []);

    const handleDeleteProfile = async () => {
        if (!window.confirm('Are you sure you want to delete your account?')) {
            return;
        }

        try {
            if (!user || !user.id) {
                setError('User profile is unavailable.');
                return;
            }

            await ApiService.deleteUser(user.id);
            navigate('/signup');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to delete profile.');
        }
    };

    return (
        <div className="edit-profile-page">
            <h2>Edit Profile</h2>

            {error && <p className="error-message">{error}</p>}

            {user && (
                <div className="profile-details">
                    <p>
                        <strong>Name:</strong> {user.name}
                    </p>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                        <strong>Phone Number:</strong> {user.phoneNumber}
                    </p>
                    <button className="delete-profile-button" onClick={handleDeleteProfile}>
                        Delete Profile
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditProfilePage;