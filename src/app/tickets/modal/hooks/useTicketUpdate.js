import { toast } from "react-toastify";

export function useTicketUpdate() {
	const updateTicket = async (editedTicket, onUpdate, setIsUpdating, resetChanges) => {
		setIsUpdating(true);

		try {
			// Prepare the data for submission
			const ticketData = {
				uid: editedTicket.uid,
				issueType: editedTicket.issueType,
				currentCondition: editedTicket.currentCondition,
				priority: editedTicket.priority,
				statusBadge: editedTicket.statusBadge,
				selectedEvent: editedTicket.selectedEvent,
				clientNote: editedTicket.clientNote,
				assignee: editedTicket.assignee,
				currentConditionByAdmin: editedTicket.currentConditionByAdmin,
				problemSolvedAt: editedTicket.problemSolvedAt,
				actionTaken: editedTicket.actionTaken,
				timeTakenToSolve: editedTicket.timeTakenToSolve,
				comments: editedTicket.comments,
				communicationChannel: editedTicket.communicationChannel,
				relatedTickets: editedTicket.relatedTickets.join(","), // Convert array to comma-separated string
			};

			// Submit the data to the API
			const response = await fetch("/api/updateTicket", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(ticketData),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to update ticket");
			}

			toast.success("Ticket updated successfully!", {
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});

			onUpdate(editedTicket);
			resetChanges();
		} catch (error) {
			console.error("Error updating ticket:", error);
			toast.error(`Error: ${error.message}`, {
				autoClose: 5000,
			});
		} finally {
			setIsUpdating(false);
		}
	};

	return { updateTicket };
}
