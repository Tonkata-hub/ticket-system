"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { RefreshCw } from "lucide-react";

export default function AdminAuthCheck({ children }) {
	const { role, isLoggedIn } = useAuth();
	const router = useRouter();
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		// Check if user is logged in and has admin role
		if (isLoggedIn === false) {
			router.push("/login");
		} else if (isLoggedIn === true && role !== "admin") {
			router.push("/tickets");
		} else if (isLoggedIn === true && role === "admin") {
			setIsChecking(false);
		}
	}, [isLoggedIn, role, router]);

	if (isChecking) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh]">
				<RefreshCw className="h-12 w-12 text-purple-600 animate-spin mb-4" />
				<p className="text-gray-600">Verifying admin access...</p>
			</div>
		);
	}

	return children;
}
