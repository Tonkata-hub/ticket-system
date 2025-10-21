"use client";

import { useState, useEffect } from "react";

export function useTicketModal(ticket, isOpen, isAdmin) {
	const [editMode, setEditMode] = useState(false);
	const [editedTicket, setEditedTicket] = useState({ ...ticket });
	const [originalTicket, setOriginalTicket] = useState({ ...ticket });
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [changedFields, setChangedFields] = useState({});
	const [isUpdating, setIsUpdating] = useState(false);

	// Reset editedTicket when the ticket prop changes
	useEffect(() => {
		setEditedTicket({ ...ticket });
		setOriginalTicket({ ...ticket });
		setHasUnsavedChanges(false);
		setChangedFields({});
	}, [ticket]);

	// Auto-enable edit mode when an admin opens a ticket
	useEffect(() => {
		if (isOpen && isAdmin) {
			setEditMode(true);
		}
	}, [isOpen, isAdmin]);

	useEffect(() => {
		if (isAdmin) {
			setEditMode(true);
		}
	}, [ticket?.uid, isAdmin]);

	// Check for changes between original and edited ticket
	const checkForChanges = (updatedTicket) => {
		const newChangedFields = {};
		let hasChanges = false;

		Object.keys(updatedTicket).forEach((key) => {
			// Special handling for arrays (relatedTickets, comments)
			if (Array.isArray(updatedTicket[key])) {
				if (JSON.stringify(updatedTicket[key]) !== JSON.stringify(originalTicket[key])) {
					newChangedFields[key] = true;
					hasChanges = true;
				}
			}
			// Regular field comparison
			else if (updatedTicket[key] !== originalTicket[key]) {
				newChangedFields[key] = true;
				hasChanges = true;
			}
		});

		setChangedFields(newChangedFields);
		setHasUnsavedChanges(hasChanges);
	};

	const updateTicketField = (field, value) => {
		const updatedTicket = { ...editedTicket, [field]: value };
		setEditedTicket(updatedTicket);
		checkForChanges(updatedTicket);
	};

	const resetChanges = () => {
		setHasUnsavedChanges(false);
		setChangedFields({});
		setOriginalTicket({ ...editedTicket });
	};

	return {
		editMode,
		setEditMode,
		editedTicket,
		setEditedTicket,
		originalTicket,
		hasUnsavedChanges,
		changedFields,
		isUpdating,
		setIsUpdating,
		checkForChanges,
		updateTicketField,
		resetChanges,
	};
}
