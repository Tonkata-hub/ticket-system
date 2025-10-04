"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const AuthContext = createContext({
    isLoggedIn: null,
    setIsLoggedIn: () => { },
    role: null,
    setRole: () => { },
    userEmail: null,
    setUserEmail: () => { },
})

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(null)
    const [role, setRole] = useState(null)
    const [userEmail, setUserEmail] = useState(null)
    const pathname = usePathname()

    useEffect(() => {
        async function fetchSession() {
            try {
                const res = await fetch("/api/session")
                const data = await res.json()
                setIsLoggedIn(data.isLoggedIn)
                setRole(data.role)

                // If logged in, fetch user details
                if (data.isLoggedIn) {
                    const userRes = await fetch("/api/user")
                    if (userRes.ok) {
                        const userData = await userRes.json()
                        setUserEmail(userData.email)
                    }
                } else {
                    setUserEmail(null)
                }
            } catch (err) {
                setIsLoggedIn(false)
                setRole(null)
                setUserEmail(null)
            }
        }
        fetchSession()
    }, [pathname])

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, role, setRole, userEmail, setUserEmail }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
