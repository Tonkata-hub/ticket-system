"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    // Check login status on component mount
    useEffect(() => {
        const savedLoginStatus = localStorage.getItem("isLoggedIn");
        if (savedLoginStatus === "true") {
            setIsLoggedIn(true);
            checkAndRefreshToken();
        }
    }, []);

    // Function to refresh the JWT token
    const refreshAuthToken = async () => {
        try {
            const response = await fetch('/api/refresh', {
                method: 'POST',
                credentials: 'include', // Important for sending cookies
            });

            if (response.ok) {
                setIsLoggedIn(true); // Ensure state is updated if token is refreshed
            } else {
                logout(); // Log out if refresh fails
            }
        } catch (error) {
            console.error('Failed to refresh token:', error);
            logout();
        }
    };

    // Function to check if token is expiring soon and refresh it
    const checkAndRefreshToken = () => {
        const interval = setInterval(async () => {
            await refreshAuthToken();
        }, 10 * 60 * 1000); // Check every 10 minutes

        return () => clearInterval(interval);
    };

    const login = () => {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        checkAndRefreshToken();
        router.push('/');
    };

    const logout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);