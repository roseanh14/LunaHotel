import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const EditProfilePage = () => {
    const [user, setUser] = useState(null);
    const [formValues, setFormValues] = useState({ email: '', name: '', phoneNumber: '' });
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const response = await ApiService.getUserProfile();
                const safeUser = response && response.user ? response.user : null;
                setUser(safeUser);
                setFormValues({
                    email: safeUser && typeof safeUser.email === 'string' ? safeUser.email : '',
                    name: safeUser && typeof safeUser.name === 'string' ? safeUser.name : '',
                    phoneNumber:
                        safeUser && typeof safeUser.phoneNumber === 'string' ? safeUser.phoneNumber : '',
                });
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
            setError('');
            await ApiService.deleteMyAccount();
            ApiService.logout();
            navigate('/register');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to delete profile.');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');

        const email = typeof formValues.email === 'string' ? formValues.email.trim() : '';
        const name = typeof formValues.name === 'string' ? formValues.name.trim() : '';
        const phoneNumber =
            typeof formValues.phoneNumber === 'string' ? formValues.phoneNumber.trim() : '';

        if (!email || !name || !phoneNumber) {
            setError('Please fill in email, name, and phone number.');
            return;
        }

        try {
            setIsSaving(true);
            const response = await ApiService.updateMyProfile({ email, name, phoneNumber });
            const updatedUser = response && response.user ? response.user : user;
            setUser(updatedUser || null);

            const originalEmail = user && typeof user.email === 'string' ? user.email : '';
            const updatedEmail =
                updatedUser && typeof updatedUser.email === 'string' ? updatedUser.email : '';

            if (originalEmail && updatedEmail && originalEmail !== updatedEmail) {
                ApiService.logout();
                navigate('/login');
            } else {
                navigate('/profile');
            }
        } catch (errorValue) {
            const message =
                errorValue &&
                errorValue.response &&
                errorValue.response.data &&
                typeof errorValue.response.data.message === 'string'
                    ? errorValue.response.data.message
                    : errorValue instanceof Error
                        ? errorValue.message
                        : 'Failed to save profile.';
            setError(message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="edit-profile-page">
            <h2>Edit Profile</h2>

            {error && <p className="error-message">{error}</p>}

            {user ? (
                <form className="profile-details" onSubmit={handleSave}>
                    <label className="profile-edit-field">
                        <span className="profile-edit-label">Email</span>
                        <input
                            value={formValues.email}
                            onChange={(e) =>
                                setFormValues((prev) => ({ ...prev, email: e.target.value }))
                            }
                            type="email"
                            autoComplete="email"
                        />
                    </label>

                    <label className="profile-edit-field">
                        <span className="profile-edit-label">Name</span>
                        <input
                            value={formValues.name}
                            onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
                            type="text"
                            autoComplete="name"
                        />
                    </label>

                    <label className="profile-edit-field">
                        <span className="profile-edit-label">Phone number</span>
                        <input
                            value={formValues.phoneNumber}
                            onChange={(e) =>
                                setFormValues((prev) => ({ ...prev, phoneNumber: e.target.value }))
                            }
                            type="tel"
                            autoComplete="tel"
                        />
                    </label>

                    <div className="profile-actions">
                        <button className="book-now-button" type="submit" disabled={isSaving}>
                            {isSaving ? 'Saving…' : 'Save changes'}
                        </button>

                        <button className="go-back-button" type="button" onClick={() => navigate('/profile')}>
                            Cancel
                        </button>

                        <button
                            className="delete-profile-button"
                            type="button"
                            onClick={handleDeleteProfile}
                        >
                            Delete account
                        </button>
                    </div>
                </form>
            ) : null}
        </div>
    );
};

export default EditProfilePage;