"use client"

import { Textarea } from "@/components/ui/textarea"
import { ChangeIndicator } from "./ChangeIndicator"
import { safeValue } from "../utils/ticketModalConstants"

export function TicketDescription({ editMode, editedTicket, isAdmin, changedFields, onInputChange }) {
    return (
        <div className="mb-6">
            {editMode ? (
                <div className="flex flex-col">
                    <Textarea
                        name="clientNote"
                        value={safeValue(editedTicket.clientNote)}
                        onChange={onInputChange}
                        className="mb-1"
                        placeholder="No description provided"
                        disabled={isAdmin}
                    />
                    <div className="flex justify-end">
                        <ChangeIndicator show={changedFields.clientNote} editMode={editMode} />
                    </div>
                </div>
            ) : (
                <p className="text-gray-600">{editedTicket.clientNote || "No description provided"}</p>
            )}
        </div>
    )
}
