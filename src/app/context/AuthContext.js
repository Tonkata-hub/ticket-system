"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const AuthContext = createContext({
    isLoggedIn: null,
    setIsLoggedIn: () => { },
    role: null,
    setRole: () => { },
});

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [role, setRole] = useState(null);
    const pathname = usePathname();

    useEffect(() => {
        async function fetchSession() {
            try {
                const res = await fetch("/api/session");
                const data = await res.json();
                setIsLoggedIn(data.isLoggedIn);
                setRole(data.role);
            } catch (err) {
                setIsLoggedIn(false);
                setRole(null);
            }
        }
        fetchSession();
    }, [pathname]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, role, setRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}