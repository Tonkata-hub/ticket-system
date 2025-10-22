"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChangeIndicator } from "./ChangeIndicator";
import { statusColor, priorityColor } from "../utils/ticketModalConstants";

export function TicketStatusBadges({ editMode, editedTicket, isAdmin, changedFields, onSelectChange }) {
	return (
		<div className="flex justify-between items-center mb-4">
			<span className="text-lg font-semibold text-gray-700">{editedTicket.uid}</span>
			<div className="flex gap-2">
				{editMode ? (
					<>
						<div className="flex items-center">
							<Select
								value={editedTicket.statusBadge}
								onValueChange={(value) => onSelectChange("statusBadge", value)}
							>
								<SelectTrigger className="w-[140px]">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									{Object.keys(statusColor).map((status) => (
										<SelectItem key={status} value={status}>
											{status}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<ChangeIndicator show={changedFields.statusBadge} editMode={editMode} />
						</div>
						<div className="flex items-center">
							<Select
								value={editedTicket.priority}
								onValueChange={(value) => onSelectChange("priority", value)}
								disabled={isAdmin}
							>
								<SelectTrigger className="w-[140px]">
									<SelectValue placeholder="Priority" />
								</SelectTrigger>
								<SelectContent>
									{Object.keys(priorityColor).map((priority) => (
										<SelectItem key={priority} value={priority}>
											{priority}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<ChangeIndicator show={changedFields.priority} editMode={editMode} />
						</div>
					</>
				) : (
					<>
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Badge className={`${statusColor[editedTicket.statusBadge]} capitalize`}>
								{editedTicket.statusBadge}
							</Badge>
						</motion.div>
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Badge className={`${priorityColor[editedTicket.priority]} capitalize`}>
								{editedTicket.priority}
							</Badge>
						</motion.div>
					</>
				)}
			</div>
		</div>
	);
}
