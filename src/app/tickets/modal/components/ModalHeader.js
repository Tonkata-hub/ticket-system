"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ChangeIndicator } from "./ChangeIndicator";
import { safeValue } from "../utils/ticketModalConstants";

export function ModalHeader({ editMode, editedTicket, isAdmin, changedFields, onClose, onInputChange }) {
	return (
		<>
			{editMode && (
				<div className="bg-blue-50 border-b border-blue-200 -mt-6 -mx-6 mb-6 px-6 py-2 rounded-t-lg">
					<p className="text-blue-700 font-medium flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 mr-2"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
							/>
						</svg>
						Edit Mode - Make changes and click "Update Ticket" when done
					</p>
				</div>
			)}

			<div className="flex justify-between items-center mb-6 border-b pb-4">
				<div className="flex items-center">
					<h2 className="text-2xl font-bold text-blue-800">
						{editMode ? (
							<Input
								name="selectedEvent"
								value={safeValue(editedTicket.selectedEvent)}
								onChange={onInputChange}
								className="font-bold text-2xl"
								disabled={isAdmin}
							/>
						) : (
							editedTicket.selectedEvent || "No Event Specified"
						)}
					</h2>
					<ChangeIndicator show={changedFields.selectedEvent} editMode={editMode} />
				</div>
				<motion.button
					onClick={onClose}
					className="text-gray-500 hover:text-gray-700"
					whileHover={{ rotate: 90 }}
					transition={{ duration: 0.2 }}
				>
					<X size={24} />
				</motion.button>
			</div>
		</>
	);
}
