"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getTickets } from "@/lib/actions/ticketActions";

export function useTickets() {
	const [tickets, setTickets] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchTickets = async () => {
		setLoading(true);
		try {
			const result = await getTickets();

			if (result.success && result.tickets) {
				setTickets(result.tickets);
			} else {
				throw new Error(result.error || "Failed to fetch tickets");
			}
		} catch (error) {
			console.error("Error fetching tickets", error);
			toast.error("Failed to load tickets");
		}
		setLoading(false);
	};

	const refreshData = async () => {
		setLoading(true);
		try {
			await fetchTickets();
		} catch (err) {
			console.error("Error refreshing tickets:", err);
			toast.error("Failed to refresh tickets");
		}
		setLoading(false);
	};

	const updateTicket = (updatedTicket) => {
		setTickets((prevTickets) =>
			prevTickets.map((ticket) => (ticket.uid === updatedTicket.uid ? updatedTicket : ticket))
		);
	};

	useEffect(() => {
		fetchTickets();
	}, []);

	return {
		tickets,
		loading,
		refreshData,
		updateTicket,
	};
}
