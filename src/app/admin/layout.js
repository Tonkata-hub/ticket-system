import { Suspense } from "react";
import AdminAuthCheck from "./AdminAuthCheck";

export const metadata = {
	title: "Admin Dashboard - TicketSystem",
	description: "Administrative dashboard for TicketSystem",
};

export default function AdminLayout({ children }) {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<AdminAuthCheck>{children}</AdminAuthCheck>
		</Suspense>
	);
}
