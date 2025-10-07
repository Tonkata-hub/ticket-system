"use client"

import { useEffect, useRef, useState } from "react"
import { X, Paperclip, LinkIcon, Plus, Trash, PlusCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function TicketModal({ ticket, onClose, isOpen, isAdmin, onUpdate, allTicketIds = [] }) {
    const [editMode, setEditMode] = useState(false)
    const [editedTicket, setEditedTicket] = useState({ ...ticket })
    const [originalTicket, setOriginalTicket] = useState({ ...ticket })
    const modalRef = useRef(null)
    const modalContentRef = useRef(null)
    const [newRelatedTicket, setNewRelatedTicket] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [changedFields, setChangedFields] = useState({})

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                // Check if the click is on a dropdown or its children
                const isDropdownClick = event.target.closest('[role="listbox"]') !== null
                if (!isDropdownClick) {
                    onClose()
                }
            }
        }

        const handleInsideClick = (event) => {
            event.stopPropagation()
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick)
            modalContentRef.current?.addEventListener("mousedown", handleInsideClick)
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick)
            modalContentRef.current?.removeEventListener("mousedown", handleInsideClick)
        }
    }, [isOpen, onClose])

    // Add this useEffect to handle the case where a non-admin tries to edit
    useEffect(() => {
        if (editMode && !isAdmin) {
            setEditMode(false)
            toast.error("Only administrators can edit tickets")
        }
    }, [editMode, isAdmin])

    // Reset editedTicket when the ticket prop changes
    useEffect(() => {
        setEditedTicket({ ...ticket })
        setOriginalTicket({ ...ticket })
        setHasUnsavedChanges(false)
        setChangedFields({})
    }, [ticket])

    // Auto-enable edit mode when an admin opens a ticket or switches tickets
    useEffect(() => {
        if (isOpen && isAdmin) {
            setEditMode(true)
        }
    }, [isOpen, isAdmin])

    useEffect(() => {
        if (isAdmin) {
            setEditMode(true)
        }
    }, [ticket?.uid, isAdmin])

    // Check for changes between original and edited ticket
    const checkForChanges = (updatedTicket) => {
        const newChangedFields = {}
        let hasChanges = false

        // Compare each field
        Object.keys(updatedTicket).forEach((key) => {
            // Special handling for arrays (relatedTickets, comments)
            if (Array.isArray(updatedTicket[key])) {
                if (JSON.stringify(updatedTicket[key]) !== JSON.stringify(originalTicket[key])) {
                    newChangedFields[key] = true
                    hasChanges = true
                }
            }
            // Regular field comparison
            else if (updatedTicket[key] !== originalTicket[key]) {
                newChangedFields[key] = true
                hasChanges = true
            }
        })

        setChangedFields(newChangedFields)
        setHasUnsavedChanges(hasChanges)
    }

    if (!isOpen) return null

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
        const { name, value } = e.target
        const updatedTicket = { ...editedTicket, [name]: value }
        setEditedTicket(updatedTicket)
        checkForChanges(updatedTicket)
    }

    const handleSelectChange = (name, value) => {
        const updatedTicket = { ...editedTicket, [name]: value }
        setEditedTicket(updatedTicket)
        checkForChanges(updatedTicket)
    }

    // Handle adding a related ticket
    const handleAddRelatedTicket = () => {
        if (!newRelatedTicket.trim()) {
            return
        }

        // Check if the ticket ID already exists
        if (editedTicket.relatedTickets.includes(newRelatedTicket.trim())) {
            return
        }

        const updatedTicket = {
            ...editedTicket,
            relatedTickets: [...editedTicket.relatedTickets, newRelatedTicket.trim()],
        }
        setEditedTicket(updatedTicket)
        setNewRelatedTicket("")
        checkForChanges(updatedTicket)
    }

    // Handle removing a related ticket
    const handleRemoveRelatedTicket = (ticketId) => {
        const updatedTicket = {
            ...editedTicket,
            relatedTickets: editedTicket.relatedTickets.filter((id) => id !== ticketId),
        }
        setEditedTicket(updatedTicket)
        checkForChanges(updatedTicket)
    }

    // Handle removing a comment
    const handleRemoveComment = (index) => {
        const updatedComments = [...editedTicket.comments]
        updatedComments.splice(index, 1)
        const updatedTicket = {
            ...editedTicket,
            comments: updatedComments,
        }
        setEditedTicket(updatedTicket)
        checkForChanges(updatedTicket)
    }

    // Update the handleUpdate function to show toasts for success/failure
    const handleUpdate = async () => {
        setIsUpdating(true)

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
            }

            // Submit the data to the API
            const response = await fetch("/api/updateTicket", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ticketData),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Failed to update ticket")
            }

            toast.success("Ticket updated successfully!", {
                autoClose: 2000, // Close after 2 seconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })

            onUpdate(editedTicket)
            setEditMode(false)
            setHasUnsavedChanges(false)
            setChangedFields({})
            setOriginalTicket({ ...editedTicket })
        } catch (error) {
            console.error("Error updating ticket:", error)
            toast.error(`Error: ${error.message}`, {
                autoClose: 5000, // Close after 5 seconds
            })
        } finally {
            setIsUpdating(false)
        }
    }

    const handleStatusChange = (checked) => {
        const updatedTicket = { ...editedTicket, statusBadge: checked ? "Closed" : "Open" }
        setEditedTicket(updatedTicket)
        checkForChanges(updatedTicket)
    }

    const handleCommentChange = (index, value) => {
        const updatedComments = [...editedTicket.comments]
        updatedComments[index] = { ...updatedComments[index], content: value }
        const updatedTicket = { ...editedTicket, comments: updatedComments }
        setEditedTicket(updatedTicket)
        checkForChanges(updatedTicket)
    }

    const handleAddComment = () => {
        const newComment = {
            author: "Current User", // This should be replaced with the actual current user's name
            content: "New comment",
            timestamp: new Date().toLocaleString(),
        }
        const updatedTicket = {
            ...editedTicket,
            comments: [...editedTicket.comments, newComment],
        }
        setEditedTicket(updatedTicket)
        checkForChanges(updatedTicket)
    }

    // Filter out the current ticket ID from the dropdown options
    const availableTicketIds = allTicketIds.filter((id) => id !== editedTicket.uid)

    // Ensure values are never null for input fields
    const safeValue = (value) => (value === null || value === undefined ? "" : value)

    // Change indicator component with Framer Motion animations
    const ChangeIndicator = ({ show }) => {
        if (!show || !editMode) return null

        return (
            <motion.div
                className="inline-flex items-center ml-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200"
                initial={{ opacity: 0, scale: 0.8, y: -5 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {
                        type: "spring",
                        stiffness: 500,
                        damping: 20,
                    },
                }}
                // Add a subtle pulsing animation to draw attention
                whileInView={{
                    boxShadow: [
                        "0 0 0 0 rgba(251, 191, 36, 0)",
                        "0 0 0 4px rgba(251, 191, 36, 0.3)",
                        "0 0 0 0 rgba(251, 191, 36, 0)",
                    ],
                    transition: {
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        duration: 2,
                        ease: "easeInOut",
                    },
                }}
            >
                <motion.div
                    initial={{ rotate: -15 }}
                    animate={{ rotate: 15 }}
                    transition={{
                        repeat: 2,
                        duration: 0.3,
                        repeatType: "reverse",
                        ease: "easeInOut",
                    }}
                >
                    <AlertCircle className="h-3 w-3 mr-1" />
                </motion.div>
                <span>Unsaved</span>
            </motion.div>
        )
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
                                                onChange={handleInputChange}
                                                className="font-bold text-2xl"
                                                disabled={isAdmin}
                                            />
                                        ) : (
                                            editedTicket.selectedEvent || "No Event Specified"
                                        )}
                                    </h2>
                                    <ChangeIndicator show={changedFields.selectedEvent} />
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
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold text-gray-700">{editedTicket.uid}</span>
                                <div className="flex gap-2">
                                    {editMode ? (
                                        <>
                                            <div className="flex items-center">
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
                                                <ChangeIndicator show={changedFields.statusBadge} />
                                            </div>
                                            <div className="flex items-center">
                                                <Select
                                                    value={editedTicket.priority}
                                                    onValueChange={(value) => handleSelectChange("priority", value)}
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
                                                <ChangeIndicator show={changedFields.priority} />
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
                            <div className="mb-6">
                                {editMode ? (
                                    <div className="flex flex-col">
                                        <Textarea
                                            name="clientNote"
                                            value={safeValue(editedTicket.clientNote)}
                                            onChange={handleInputChange}
                                            className="mb-1"
                                            placeholder="No description provided"
                                            disabled={isAdmin}
                                        />
                                        <div className="flex justify-end">
                                            <ChangeIndicator show={changedFields.clientNote} />
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-600">{editedTicket.clientNote || "No description provided"}</p>
                                )}
                            </div>
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
                                            <Input name="issueType" value={safeValue(editedTicket.issueType)} onChange={handleInputChange} disabled={isAdmin} />
                                            <div className="flex justify-end mt-1">
                                                <ChangeIndicator show={changedFields.issueType} />
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
                                                onChange={handleInputChange}
                                                disabled={isAdmin}
                                            />
                                            <div className="flex justify-end mt-1">
                                                <ChangeIndicator show={changedFields.currentCondition} />
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
                                            <Input name="assignee" value={safeValue(editedTicket.assignee)} onChange={handleInputChange} />
                                            <div className="flex justify-end mt-1">
                                                <ChangeIndicator show={changedFields.assignee} />
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-700">{editedTicket.assignee || "Not assigned"}</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500">Communication Channel</h3>
                                    {editMode ? (
                                        <Input
                                            name="communicationChannel"
                                            value={safeValue(editedTicket.communicationChannel)}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Yankov phone"
                                        />
                                    ) : (
                                        <p className="text-gray-700">
                                            {editedTicket.communicationChannel || "Not specified"}
                                        </p>
                                    )}
                                    {editMode && changedFields.communicationChannel && (
                                        <ChangeIndicator show={true} />
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
                                                onChange={handleInputChange}
                                            />
                                            <div className="flex justify-end mt-1">
                                                <ChangeIndicator show={changedFields.dateOfStartingWork} />
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
                                                onChange={handleInputChange}
                                            />
                                            <div className="flex justify-end mt-1">
                                                <ChangeIndicator show={changedFields.currentConditionByAdmin} />
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
                                                onValueChange={(value) => handleSelectChange("problemSolvedAt", value)}
                                                disabled={false}
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
                                                <ChangeIndicator show={changedFields.problemSolvedAt} />
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
                                            <Textarea
                                                name="actionTaken"
                                                value={safeValue(editedTicket.actionTaken)}
                                                onChange={handleInputChange}
                                            />
                                            <div className="flex justify-end mt-1">
                                                <ChangeIndicator show={changedFields.actionTaken} />
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
                                                onChange={handleInputChange}
                                                placeholder="e.g. 2 hours"
                                            />
                                            <div className="flex justify-end mt-1">
                                                <ChangeIndicator show={changedFields.timeTakenToSolve} />
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-700">{editedTicket.timeTakenToSolve || "Not solved yet"}</p>
                                    )}
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="flex items-center">
                                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Related Tickets</h3>
                                    {editMode && changedFields.relatedTickets && <ChangeIndicator show={changedFields.relatedTickets} />}
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
                                                        onClick={() => handleRemoveRelatedTicket(ticketId)}
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
                                            className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                                            onClick={handleAddRelatedTicket}
                                            disabled={!newRelatedTicket}
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                            Add
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-500 mb-2">Attachments</h3>
                                {editedTicket.attachments && editedTicket.attachments.length > 0 ? (
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
                                    <div className="flex items-center mb-2">
                                        <h3 className="text-lg font-semibold text-blue-800">Comments</h3>
                                        {editMode && changedFields.comments && <ChangeIndicator show={changedFields.comments} />}
                                    </div>
                                    {editedTicket.comments && editedTicket.comments.length > 0 ? (
                                        <motion.ul className="space-y-2">
                                            {editedTicket.comments.map((comment, index) => (
                                                <motion.li
                                                    key={index}
                                                    className="bg-gray-50 p-3 rounded relative"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{
                                                        duration: 0.3,
                                                        delay: index * 0.1,
                                                        type: "spring",
                                                    }}
                                                >
                                                    {editMode && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="absolute top-2 right-2 h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleRemoveComment(index)}
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {editMode ? (
                                                        <Textarea
                                                            value={safeValue(comment.content)}
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
                                        <div className="relative flex items-center">
                                            <Switch
                                                id="completed"
                                                checked={editedTicket.statusBadge === "Closed"}
                                                onCheckedChange={handleStatusChange}
                                                className="data-[state=checked]:bg-green-500"
                                            />
                                            {editMode && changedFields.statusBadge && editedTicket.statusBadge === "Closed" && (
                                                <span className="absolute -top-2 -right-2 flex h-3 w-3">
                                                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                </span>
                                            )}
                                        </div>
                                        <Label
                                            htmlFor="completed"
                                            className={`text-sm font-medium ${editedTicket.statusBadge === "Closed" ? "text-green-600" : "text-gray-700"
                                                }`}
                                        >
                                            {editedTicket.statusBadge === "Closed" ? "Closed" : "Mark as closed"}
                                            {editMode && changedFields.statusBadge && editedTicket.statusBadge === "Closed" && (
                                                <span className="ml-2 text-xs text-red-500 font-normal">
                                                    <ChangeIndicator show={true} />
                                                </span>
                                            )}
                                        </Label>
                                    </div>
                                )}
                                {isAdmin && (
                                    <motion.div whileHover={{ scale: isUpdating ? 1 : 1.05 }} whileTap={{ scale: isUpdating ? 1 : 0.95 }}>
                                        <Button
                                            onClick={() => {
                                                if (editMode) {
                                                    handleUpdate()
                                                } else {
                                                    setEditMode(true)
                                                }
                                            }}
                                            disabled={isUpdating}
                                            className={`${editMode ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                                                } text-white px-4 py-2 rounded-md transition-colors flex items-center`}
                                        >
                                            {isUpdating ? (
                                                <>
                                                    <svg
                                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    Updating...
                                                </>
                                            ) : editMode ? (
                                                hasUnsavedChanges ? (
                                                    "Update Ticket"
                                                ) : (
                                                    "Update Ticket"
                                                )
                                            ) : (
                                                "Edit Ticket"
                                            )}
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
