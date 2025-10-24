"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getUser, getSession } from "@/lib/actions/userActions";

const AuthContext = createContext({
	isLoggedIn: null,
	setIsLoggedIn: () => {},
	role: null,
	setRole: () => {},
	userEmail: null,
	setUserEmail: () => {},
});

export function AuthProvider({ children }) {
	const [isLoggedIn, setIsLoggedIn] = useState(null);
	const [role, setRole] = useState(null);
	const [userEmail, setUserEmail] = useState(null);
	const pathname = usePathname();

	useEffect(() => {
		async function fetchSession() {
			try {
				const sessionResult = await getSession();

				if (sessionResult.success) {
					setIsLoggedIn(sessionResult.session.isLoggedIn);
					setRole(sessionResult.session.role);

					// If logged in, fetch user details
					if (sessionResult.session.isLoggedIn) {
						const userResult = await getUser();
						if (userResult.success) {
							setUserEmail(userResult.user.email);
						}
					} else {
						setUserEmail(null);
					}
				} else {
					setIsLoggedIn(false);
					setRole(null);
					setUserEmail(null);
				}
			} catch (err) {
				setIsLoggedIn(false);
				setRole(null);
				setUserEmail(null);
			}
		}
		fetchSession();
	}, [pathname]);

	return (
		<AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, role, setRole, userEmail, setUserEmail }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
