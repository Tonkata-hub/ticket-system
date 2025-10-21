"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { statusColor, priorityColor, formatDate } from "./utils/ticketTableConstants";

export default function TicketTableRow({ ticket, onClick }) {
	const isClosed = ticket.statusBadge === "Closed";
	const closedStyles = isClosed ? "line-through text-gray-500" : "";
	const rowBgClass = isClosed ? "bg-gray-50" : "";

	return (
		<motion.tr
			key={ticket.uid}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.2 }}
			className={`border-t hover:bg-muted/50 cursor-pointer ${rowBgClass}`}
			onClick={() => onClick(ticket)}
		>
			<td className="px-4 py-3 font-medium">
				<span className={closedStyles}>{ticket.uid}</span>
			</td>
			<td className="px-4 py-3 max-w-[200px]">
				<div className={`truncate ${closedStyles}`}>{ticket.selectedEvent}</div>
			</td>
			<td className="px-4 py-3">
				<Badge className={`${statusColor[ticket.statusBadge]} capitalize ${isClosed ? "opacity-60" : ""}`}>
					{ticket.statusBadge}
				</Badge>
			</td>
			<td className="px-4 py-3">
				<Badge className={`${priorityColor[ticket.priority]} capitalize ${isClosed ? "opacity-60" : ""}`}>
					{ticket.priority}
				</Badge>
			</td>
			<td className="px-4 py-3">
				<span className={isClosed ? "text-gray-500" : ""}>{ticket.createdBy}</span>
			</td>
			<td className="px-4 py-3 whitespace-nowrap">
				<span className={isClosed ? "text-gray-500" : ""}>{formatDate(ticket.createdAt)}</span>
			</td>
			<td className="px-4 py-3 whitespace-nowrap">
				<span className={isClosed ? "text-gray-500" : ""}>{formatDate(ticket.updatedAt)}</span>
			</td>
		</motion.tr>
	);
}
