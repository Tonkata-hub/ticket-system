"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChangeIndicator } from "./ChangeIndicator"
import { safeValue } from "../utils/ticketModalConstants"

export function TicketDetailsGrid({ editMode, editedTicket, isAdmin, changedFields, onInputChange, onSelectChange }) {
    return (
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
                <h3 className="text-sm font-semibold text-gray-500">Created By</h3>
                <p className="text-gray-700">{editedTicket.createdBy}</p>
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-500">Created At</h3>
                <p className="text-gray-700">{new Date(editedTicket.createdAt).toLocaleString()}</p>
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-500">Issue Type</h3>
                {editMode ? (
                    <div className="flex flex-col">
                        <Input
                            name="issueType"
                            value={safeValue(editedTicket.issueType)}
                            onChange={onInputChange}
                            disabled={isAdmin}
                        />
                        <div className="flex justify-end mt-1">
                            <ChangeIndicator show={changedFields.issueType} editMode={editMode} />
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-700">{editedTicket.issueType || "Not specified"}</p>
                )}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-500">Current Condition</h3>
                {editMode ? (
                    <div className="flex flex-col">
                        <Input
                            name="currentCondition"
                            value={safeValue(editedTicket.currentCondition)}
                            onChange={onInputChange}
                            disabled={isAdmin}
                        />
                        <div className="flex justify-end mt-1">
                            <ChangeIndicator show={changedFields.currentCondition} editMode={editMode} />
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-700">{editedTicket.currentCondition || "Not specified"}</p>
                )}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-500">Assignee</h3>
                {editMode ? (
                    <div className="flex flex-col">
                        <Input name="assignee" value={safeValue(editedTicket.assignee)} onChange={onInputChange} />
                        <div className="flex justify-end mt-1">
                            <ChangeIndicator show={changedFields.assignee} editMode={editMode} />
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-700">{editedTicket.assignee || "Not assigned"}</p>
                )}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-500">Communication Channel</h3>
                {editMode ? (
                    <div className="flex flex-col">
                        <Input
                            name="communicationChannel"
                            value={safeValue(editedTicket.communicationChannel)}
                            onChange={onInputChange}
                            placeholder="e.g. Yankov phone"
                        />
                        <div className="flex justify-end mt-1">
                            <ChangeIndicator show={changedFields.communicationChannel} editMode={editMode} />
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-700">{editedTicket.communicationChannel || "Not specified"}</p>
                )}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-500">Date of Starting Work</h3>
                {editMode ? (
                    <div className="flex flex-col">
                        <Input
                            name="dateOfStartingWork"
                            type="datetime-local"
                            value={safeValue(editedTicket.dateOfStartingWork)}
                            onChange={onInputChange}
                        />
                        <div className="flex justify-end mt-1">
                            <ChangeIndicator show={changedFields.dateOfStartingWork} editMode={editMode} />
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-700">
                        {editedTicket.dateOfStartingWork
                            ? new Date(editedTicket.dateOfStartingWork).toLocaleString()
                            : "Not started"}
                    </p>
                )}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-500">Current Condition by Admin</h3>
                {editMode ? (
                    <div className="flex flex-col">
                        <Input
                            name="currentConditionByAdmin"
                            value={safeValue(editedTicket.currentConditionByAdmin)}
                            onChange={onInputChange}
                        />
                        <div className="flex justify-end mt-1">
                            <ChangeIndicator show={changedFields.currentConditionByAdmin} editMode={editMode} />
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-700">{editedTicket.currentConditionByAdmin || "Not assessed"}</p>
                )}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-500">Problem Solved At</h3>
                {editMode ? (
                    <div className="flex flex-col">
                        <Select
                            value={editedTicket.problemSolvedAt || ""}
                            onValueChange={(value) => onSelectChange("problemSolvedAt", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="On-site">On-site</SelectItem>
                                <SelectItem value="Remotely">Remotely</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex justify-end mt-1">
                            <ChangeIndicator show={changedFields.problemSolvedAt} editMode={editMode} />
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-700">{editedTicket.problemSolvedAt || "Not solved yet"}</p>
                )}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-500">Action Taken</h3>
                {editMode ? (
                    <div className="flex flex-col">
                        <Textarea name="actionTaken" value={safeValue(editedTicket.actionTaken)} onChange={onInputChange} />
                        <div className="flex justify-end mt-1">
                            <ChangeIndicator show={changedFields.actionTaken} editMode={editMode} />
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-700">{editedTicket.actionTaken || "No action taken yet"}</p>
                )}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-500">Time Taken to Solve</h3>
                {editMode ? (
                    <div className="flex flex-col">
                        <Input
                            name="timeTakenToSolve"
                            value={safeValue(editedTicket.timeTakenToSolve)}
                            onChange={onInputChange}
                            placeholder="e.g. 2 hours"
                        />
                        <div className="flex justify-end mt-1">
                            <ChangeIndicator show={changedFields.timeTakenToSolve} editMode={editMode} />
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-700">{editedTicket.timeTakenToSolve || "Not solved yet"}</p>
                )}
            </div>
        </div>
    )
}
