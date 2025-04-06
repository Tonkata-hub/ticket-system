"use client"

import { useEffect, useRef, useState } from "react";
import { X, Paperclip, LinkIcon, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

export default function TicketModal({ ticket, onClose, isOpen, isAdmin, onUpdate }) {
    const [editMode, setEditMode] = useState(false);
    const [editedTicket, setEditedTicket] = useState({ ...ticket });
    const modalRef = useRef(null);
    const modalContentRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                // Check if the click is on a dropdown or its children
                const isDropdownClick = event.target.closest('[role="listbox"]') !== null;
                if (!isDropdownClick) {
                    onClose();
                }
            }
        }

        const handleInsideClick = (event) => {
            event.stopPropagation();
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
            modalContentRef.current?.addEventListener("mousedown", handleInsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            modalContentRef.current?.removeEventListener("mousedown", handleInsideClick);
        }
    }, [isOpen, onClose])

    if (!isOpen) return null;

    const statusColor = {
        Open: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        "In Progress": "bg-blue-100 text-blue-800 hover:bg-blue-200",
        Urgent: "bg-red-100 text-red-800 hover:bg-red-200",
        Closed: "bg-green-100 text-green-800 hover:bg-green-200",
    }

    const priorityColor = {
        High: "bg-red-100 text-red-800 hover:bg-red-200",
        Medium: "bg-orange-100 text-orange-800 hover:bg-orange-200",
        Low: "bg-green-100 text-green-800 hover:bg-green-200",
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedTicket((prev) => ({ ...prev, [name]: value }));
    }

    const handleSelectChange = (name, value) => {
        setEditedTicket((prev) => ({ ...prev, [name]: value }));
    }

    const handleUpdate = () => {
        onUpdate(editedTicket);
        setEditMode(false);
    }

    const handleStatusChange = (checked) => {
        const updatedTicket = { ...editedTicket, statusBadge: checked ? "Closed" : "Open" };
        setEditedTicket(updatedTicket);
        onUpdate(updatedTicket);
    }

    const handleCommentChange = (index, value) => {
        const updatedComments = [...editedTicket.comments];
        updatedComments[index] = { ...updatedComments[index], content: value };
        setEditedTicket((prev) => ({ ...prev, comments: updatedComments }));
    }

    const handleAddComment = () => {
        const newComment = {
            author: "Current User", // This should be replaced with the actual current user's name
            content: "New comment",
            timestamp: new Date().toLocaleString(),
        }
        setEditedTicket((prev) => ({
            ...prev,
            comments: [...prev.comments, newComment],
        }))
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        ref={modalRef}
                        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <div ref={modalContentRef} className="p-6">
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <h2 className="text-2xl font-bold text-blue-800">
                                    {editMode ? (
                                        <Input
                                            name="selectedEvent"
                                            value={editedTicket.selectedEvent}
                                            onChange={handleInputChange}
                                            className="font-bold text-2xl"
                                        />
                                    ) : (
                                        editedTicket.selectedEvent
                                    )}
                                </h2>
                                <motion.button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700"
                                    whileHover={{ rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X size={24} />
                                </motion.button>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold text-gray-700">{editedTicket.uid}</span>
                                <div className="flex gap-2">
                                    {editMode ? (
                                        <>
                                            <Select
                                                value={editedTicket.statusBadge}
                                                onValueChange={(value) => handleSelectChange("statusBadge", value)}
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
                                            <Select
                                                value={editedTicket.priority}
                                                onValueChange={(value) => handleSelectChange("priority", value)}
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
                            {editMode ? (
                                <Textarea
                                    name="clientNote"
                                    value={editedTicket.clientNote}
                                    onChange={handleInputChange}
                                    className="mb-6"
                                />
                            ) : (
                                <p className="text-gray-600 mb-6">{editedTicket.clientNote}</p>
                            )}
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
                                        <Input name="issueType" value={editedTicket.issueType} onChange={handleInputChange} />
                                    ) : (
                                        <p className="text-gray-700">{editedTicket.issueType}</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500">Current Condition</h3>
                                    {editMode ? (
                                        <Input name="currentCondition" value={editedTicket.currentCondition} onChange={handleInputChange} />
                                    ) : (
                                        <p className="text-gray-700">{editedTicket.currentCondition}</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500">Assignee</h3>
                                    {editMode ? (
                                        <Input name="assignee" value={editedTicket.assignee} onChange={handleInputChange} />
                                    ) : (
                                        <p className="text-gray-700">{editedTicket.assignee}</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500">Date of Starting Work</h3>
                                    {editMode ? (
                                        <Input
                                            name="dateOfStartingWork"
                                            type="datetime-local"
                                            value={editedTicket.dateOfStartingWork || ""}
                                            onChange={handleInputChange}
                                        />
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
                                        <Input
                                            name="currentConditionByAdmin"
                                            value={editedTicket.currentConditionByAdmin || ""}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p className="text-gray-700">{editedTicket.currentConditionByAdmin || "Not assessed"}</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500">Problem Solved At</h3>
                                    {editMode ? (
                                        <Select
                                            value={editedTicket.problemSolvedAt}
                                            onValueChange={(value) => handleSelectChange("problemSolvedAt", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select location" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="On-site">On-site</SelectItem>
                                                <SelectItem value="Remotely">Remotely</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <p className="text-gray-700">{editedTicket.problemSolvedAt}</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500">Action Taken</h3>
                                    {editMode ? (
                                        <Textarea name="actionTaken" value={editedTicket.actionTaken || ""} onChange={handleInputChange} />
                                    ) : (
                                        <p className="text-gray-700">{editedTicket.actionTaken || "No action taken yet"}</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500">Time Taken to Solve</h3>
                                    {editMode ? (
                                        <Input
                                            name="timeTakenToSolve"
                                            value={editedTicket.timeTakenToSolve || ""}
                                            onChange={handleInputChange}
                                            placeholder="e.g. 2 hours"
                                        />
                                    ) : (
                                        <p className="text-gray-700">{editedTicket.timeTakenToSolve || "Not solved yet"}</p>
                                    )}
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-500 mb-2">Related Tickets</h3>
                                {editedTicket.relatedTickets.length > 0 ? (
                                    <ul className="list-disc list-inside">
                                        {editedTicket.relatedTickets.map((ticketId) => (
                                            <li key={ticketId} className="text-blue-600 hover:underline">
                                                <LinkIcon className="inline-block mr-1 h-4 w-4" />
                                                {ticketId}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No related tickets</p>
                                )}
                            </div>
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-500 mb-2">Attachments</h3>
                                {editedTicket.attachments.length > 0 ? (
                                    <ul className="list-disc list-inside">
                                        {editedTicket.attachments.map((attachment) => (
                                            <li key={attachment} className="text-blue-600 hover:underline">
                                                <Paperclip className="inline-block mr-1 h-4 w-4" />
                                                {attachment}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No attachments</p>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Comments</h3>
                                    {editedTicket.comments.length > 0 ? (
                                        <motion.ul className="space-y-2">
                                            {editedTicket.comments.map((comment, index) => (
                                                <motion.li
                                                    key={index}
                                                    className="bg-gray-50 p-3 rounded"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{
                                                        duration: 0.3,
                                                        delay: index * 0.1,
                                                        type: "spring",
                                                    }}
                                                >
                                                    {editMode ? (
                                                        <Textarea
                                                            value={comment.content}
                                                            onChange={(e) => handleCommentChange(index, e.target.value)}
                                                            className="mb-2"
                                                        />
                                                    ) : (
                                                        <p className="text-sm text-gray-600">{comment.content}</p>
                                                    )}
                                                    <span className="text-xs text-gray-400">
                                                        Posted by {comment.author} on {comment.timestamp}
                                                    </span>
                                                </motion.li>
                                            ))}
                                        </motion.ul>
                                    ) : (
                                        <p className="text-gray-500">No comments yet.</p>
                                    )}
                                    {editMode && (
                                        <Button onClick={handleAddComment} variant="outline" size="sm" className="mt-2">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Comment
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6 flex justify-between items-center">
                                {isAdmin && (
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="completed"
                                            checked={editedTicket.statusBadge === "Closed"}
                                            onCheckedChange={handleStatusChange}
                                            className="data-[state=checked]:bg-green-500"
                                        />
                                        <Label
                                            htmlFor="completed"
                                            className={`text-sm font-medium ${editedTicket.statusBadge === "Closed" ? "text-green-600" : "text-gray-700"
                                                }`}
                                        >
                                            {editedTicket.statusBadge === "Closed" ? "Closed" : "Mark as closed"}
                                        </Label>
                                    </div>
                                )}
                                {isAdmin && (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            onClick={() => {
                                                if (editMode) {
                                                    handleUpdate()
                                                } else {
                                                    setEditMode(true)
                                                }
                                            }}
                                            className={`${editMode ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                                                } text-white px-4 py-2 rounded-md transition-colors`}
                                        >
                                            {editMode ? "Update Ticket" : "Edit Ticket"}
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

