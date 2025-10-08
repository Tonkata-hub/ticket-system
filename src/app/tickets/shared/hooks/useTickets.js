"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"

export function useTickets() {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchTickets = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/getTickets")
            const data = await res.json()

            if (data?.tickets) {
                const parsed = data.tickets.map((t) => ({
                    ...t,
                    uid: t.uid,
                    createdAt: t.created_at,
                    createdBy: t.created_by,
                    issueType: t.issue_type,
                    currentCondition: t.current_condition,
                    priority: t.priority,
                    statusBadge: t.status_badge,
                    selectedEvent: t.selected_event,
                    clientNote: t.client_note,
                    dateOfStartingWork: t.date_of_starting_work,
                    assignee: t.assignee,
                    currentConditionByAdmin: t.current_condition_admin,
                    problemSolvedAt: t.problem_solved_at,
                    actionTaken: t.action_taken,
                    timeTakenToSolve: t.time_taken_to_solve,
                    relatedTickets: t.related_tickets ? t.related_tickets.split(",") : [],
                    attachments: t.attachments ? t.attachments.split(",") : [],
                    comments: t.comments ? JSON.parse(t.comments) : [],
                    communicationChannel: t.communication_channel,
                    updatedAt: t.updated_at,
                }))

                setTickets(parsed)
            }
        } catch (error) {
            console.error("Error fetching tickets", error)
            toast.error("Failed to load tickets")
        }
        setLoading(false)
    }

    const refreshData = async () => {
        setLoading(true)
        try {
            await fetchTickets()
        } catch (err) {
            console.error("Error refreshing tickets:", err)
            toast.error("Failed to refresh tickets")
        }
        setLoading(false)
    }

    const updateTicket = (updatedTicket) => {
        setTickets((prevTickets) =>
            prevTickets.map((ticket) => (ticket.uid === updatedTicket.uid ? updatedTicket : ticket)),
        )
    }

    useEffect(() => {
        fetchTickets()
    }, [])

    return {
        tickets,
        loading,
        refreshData,
        updateTicket,
    }
}
