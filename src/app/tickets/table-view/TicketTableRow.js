"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { statusColor, priorityColor, formatDate, formatOptionalDate, truncateText } from "./utils/ticketTableConstants";

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
				<span className={closedStyles} title={ticket.uid}>
					{truncateText(ticket.uid)}
				</span>
			</td>
			<td className="px-4 py-3">
				<div className={`${closedStyles}`} title={ticket.selectedEvent}>
					{truncateText(ticket.selectedEvent)}
				</div>
			</td>
			<td className="px-4 py-3">
				<Badge className={`${statusColor[ticket.statusBadge]} capitalize ${isClosed ? "opacity-60" : ""}`}>
					{truncateText(ticket.statusBadge)}
				</Badge>
			</td>
			<td className="px-4 py-3">
				<Badge className={`${priorityColor[ticket.priority]} capitalize ${isClosed ? "opacity-60" : ""}`}>
					{truncateText(ticket.priority)}
				</Badge>
			</td>
			<td className="px-4 py-3">
				<span className={isClosed ? "text-gray-500" : ""} title={ticket.createdBy}>
					{truncateText(ticket.createdBy)}
				</span>
			</td>
			<td className="px-4 py-3 whitespace-nowrap">
				<span className={isClosed ? "text-gray-500" : ""} title={formatDate(ticket.createdAt)}>
					{truncateText(formatDate(ticket.createdAt))}
				</span>
			</td>
			<td className="px-4 py-3 whitespace-nowrap">
				<span className={isClosed ? "text-gray-500" : ""} title={formatDate(ticket.updatedAt)}>
					{truncateText(formatDate(ticket.updatedAt))}
				</span>
			</td>
			<td className="px-4 py-3">
				<div title={ticket.clientNote}>{truncateText(ticket.clientNote || "")}</div>
			</td>
			<td className="px-4 py-3">
				<span title={ticket.issueType}>{truncateText(ticket.issueType || "")}</span>
			</td>
			<td className="px-4 py-3">
				<div title={ticket.currentCondition}>{truncateText(ticket.currentCondition || "")}</div>
			</td>
			<td className="px-4 py-3">
				<span title={ticket.assignee}>{truncateText(ticket.assignee || "")}</span>
			</td>
			<td className="px-4 py-3">
				<span title={ticket.communicationChannel}>{truncateText(ticket.communicationChannel || "")}</span>
			</td>
			<td className="px-4 py-3 whitespace-nowrap">
				<span title={formatOptionalDate(ticket.dateOfStartingWork)}>
					{truncateText(formatOptionalDate(ticket.dateOfStartingWork))}
				</span>
			</td>
			<td className="px-4 py-3">
				<div title={ticket.currentConditionByAdmin}>{truncateText(ticket.currentConditionByAdmin || "")}</div>
			</td>
			<td className="px-4 py-3">
				<span title={ticket.problemSolvedAt}>{truncateText(ticket.problemSolvedAt || "")}</span>
			</td>
			<td className="px-4 py-3">
				<div title={ticket.actionTaken}>{truncateText(ticket.actionTaken || "")}</div>
			</td>
			<td className="px-4 py-3">
				<span title={ticket.timeTakenToSolve}>{truncateText(ticket.timeTakenToSolve || "")}</span>
			</td>
		</motion.tr>
	);
}
