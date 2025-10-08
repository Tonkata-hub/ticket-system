"use client"

import { useState } from "react"
import { LinkIcon, Trash, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChangeIndicator } from "./ChangeIndicator"

export function RelatedTicketsSection({
    editMode,
    editedTicket,
    changedFields,
    allTicketIds,
    onAddRelatedTicket,
    onRemoveRelatedTicket,
}) {
    const [newRelatedTicket, setNewRelatedTicket] = useState("")

    const handleAdd = () => {
        if (newRelatedTicket.trim()) {
            onAddRelatedTicket(newRelatedTicket.trim())
            setNewRelatedTicket("")
        }
    }

    const availableTicketIds = allTicketIds.filter((id) => id !== editedTicket.uid)

    return (
        <div className="mb-6">
            <div className="flex items-center">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Related Tickets</h3>
                {editMode && changedFields.relatedTickets && (
                    <ChangeIndicator show={changedFields.relatedTickets} editMode={editMode} />
                )}
            </div>
            {editedTicket.relatedTickets && editedTicket.relatedTickets.length > 0 ? (
                <ul className="list-disc list-inside">
                    {editedTicket.relatedTickets.map((ticketId) => (
                        <li key={ticketId} className="flex items-center py-1">
                            <LinkIcon className="inline-block mr-1 h-4 w-4 text-blue-600" />
                            <span className="text-blue-600 hover:underline">{ticketId}</span>
                            {editMode && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-2 h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => onRemoveRelatedTicket(ticketId)}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No related tickets</p>
            )}
            {editMode && (
                <div className="mt-2 flex items-center gap-2">
                    {availableTicketIds.length > 0 ? (
                        <select
                            value={newRelatedTicket}
                            onChange={(e) => setNewRelatedTicket(e.target.value)}
                            className="flex-grow h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="">Select a ticket</option>
                            {availableTicketIds.map((id) => (
                                <option key={id} value={id}>
                                    {id}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p className="text-sm text-gray-500">No other tickets available</p>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                        onClick={handleAdd}
                        disabled={!newRelatedTicket}
                    >
                        <PlusCircle className="h-4 w-4" />
                        Add
                    </Button>
                </div>
            )}
        </div>
    )
}
