import { toast } from "react-toastify";
import { updateTicket } from "@/lib/actions/ticketActions";

export function useTicketUpdate() {
	const updateTicketAction = async (editedTicket, onUpdate, setIsUpdating, resetChanges) => {
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

			// Submit the data using server action
			const result = await updateTicket(ticketData);

			if (!result.success) {
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

	return { updateTicket: updateTicketAction };
}
