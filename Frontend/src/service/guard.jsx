import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import ApiService from './ApiService.js';

export const ProtectedRoute = ({ children }) => {
    const location = useLocation();

    if (!ApiService.isAuthenticated()) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
};

export const AdminRoute = ({ children }) => {
    const location = useLocation();

    if (!ApiService.isAdmin()) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
};