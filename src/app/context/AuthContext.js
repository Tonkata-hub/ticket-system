"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const AuthContext = createContext({
    isLoggedIn: false,
    setIsLoggedIn: () => { },
});

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const pathname = usePathname();

    // Fetch session on mount and whenever the route changes
    useEffect(() => {
        async function fetchSession() {
            try {
                const res = await fetch("/api/session");
                const data = await res.json();
                setIsLoggedIn(data.isLoggedIn);
            } catch (err) {
                setIsLoggedIn(false);
            }
        }
        fetchSession();
    }, [pathname]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}