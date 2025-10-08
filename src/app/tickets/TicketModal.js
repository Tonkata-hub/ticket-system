"use client"

import { useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "react-toastify/dist/ReactToastify.css"

import { useTicketModal } from "./modal/hooks/useTicketModal"
import { useModalClickHandlers } from "./modal/hooks/useModalClickHandlers"
import { useTicketUpdate } from "./modal/hooks/useTicketUpdate"
import { ModalHeader } from "./modal/components/ModalHeader"
import { TicketStatusBadges } from "./modal/components/TicketStatusBadges"
import { TicketDescription } from "./modal/components/TicketDescription"
import { TicketDetailsGrid } from "./modal/components/TicketDetailsGrid"
import { RelatedTicketsSection } from "./modal/components/RelatedTicketsSection"
import { AttachmentsSection } from "./modal/components/AttachmentsSection"
import { CommentsSection } from "./modal/components/CommentsSection"
import { ModalFooter } from "./modal/components/ModalFooter"

export default function TicketModal({ ticket, onClose, isOpen, isAdmin, onUpdate, allTicketIds = [] }) {
    const modalRef = useRef(null)
    const modalContentRef = useRef(null)

    const {
        editMode,
        editedTicket,
        setEditedTicket,
        hasUnsavedChanges,
        changedFields,
        isUpdating,
        setIsUpdating,
        checkForChanges,
        resetChanges,
    } = useTicketModal(ticket, isOpen, isAdmin)

    useModalClickHandlers(isOpen, onClose, modalRef, modalContentRef)
    const { updateTicket } = useTicketUpdate()

    if (!isOpen) return null

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

    const handleAddRelatedTicket = (ticketId) => {
        if (editedTicket.relatedTickets.includes(ticketId)) {
            return
        }
        const updatedTicket = {
            ...editedTicket,
            relatedTickets: [...editedTicket.relatedTickets, ticketId],
        }
        setEditedTicket(updatedTicket)
        checkForChanges(updatedTicket)
    }

    const handleRemoveRelatedTicket = (ticketId) => {
        const updatedTicket = {
            ...editedTicket,
            relatedTickets: editedTicket.relatedTickets.filter((id) => id !== ticketId),
        }
        setEditedTicket(updatedTicket)
        checkForChanges(updatedTicket)
    }

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

    const handleUpdate = async () => {
        await updateTicket(editedTicket, onUpdate, setIsUpdating, resetChanges)
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
            author: "Current User",
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
                            <ModalHeader
                                editMode={editMode}
                                editedTicket={editedTicket}
                                isAdmin={isAdmin}
                                changedFields={changedFields}
                                onClose={onClose}
                                onInputChange={handleInputChange}
                            />

                            <TicketStatusBadges
                                editMode={editMode}
                                editedTicket={editedTicket}
                                isAdmin={isAdmin}
                                changedFields={changedFields}
                                onSelectChange={handleSelectChange}
                            />

                            <TicketDescription
                                editMode={editMode}
                                editedTicket={editedTicket}
                                isAdmin={isAdmin}
                                changedFields={changedFields}
                                onInputChange={handleInputChange}
                            />

                            <TicketDetailsGrid
                                editMode={editMode}
                                editedTicket={editedTicket}
                                isAdmin={isAdmin}
                                changedFields={changedFields}
                                onInputChange={handleInputChange}
                                onSelectChange={handleSelectChange}
                            />

                            <RelatedTicketsSection
                                editMode={editMode}
                                editedTicket={editedTicket}
                                changedFields={changedFields}
                                allTicketIds={allTicketIds}
                                onAddRelatedTicket={handleAddRelatedTicket}
                                onRemoveRelatedTicket={handleRemoveRelatedTicket}
                            />

                            <AttachmentsSection attachments={editedTicket.attachments} />

                            <CommentsSection
                                editMode={editMode}
                                comments={editedTicket.comments}
                                changedFields={changedFields}
                                onCommentChange={handleCommentChange}
                                onAddComment={handleAddComment}
                                onRemoveComment={handleRemoveComment}
                            />

                            <ModalFooter
                                isAdmin={isAdmin}
                                editMode={editMode}
                                editedTicket={editedTicket}
                                changedFields={changedFields}
                                hasUnsavedChanges={hasUnsavedChanges}
                                isUpdating={isUpdating}
                                onStatusChange={handleStatusChange}
                                onUpdate={handleUpdate}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
