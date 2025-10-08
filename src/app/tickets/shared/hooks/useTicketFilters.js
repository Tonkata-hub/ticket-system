"use client"

import { useState, useMemo } from "react"

export function useTicketFilters(tickets) {
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState("updatedAt")
    const [filters, setFilters] = useState({
        statusBadge: "all",
        priority: "all",
        createdBy: "all",
    })

    const resetFilters = () => {
        setFilters({
            statusBadge: "all",
            priority: "all",
            createdBy: "all",
        })
        setSearchTerm("")
        setSortBy("updatedAt")
    }

    const filteredTickets = useMemo(() => {
        return tickets
            .filter((ticket) => ticket && typeof ticket === "object")
            .filter(
                (ticket) =>
                    (ticket.selectedEvent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ticket.uid?.toLowerCase().includes(searchTerm.toLowerCase())) &&
                    (filters.statusBadge === "" || filters.statusBadge === "all" || ticket.statusBadge === filters.statusBadge) &&
                    (filters.priority === "" || filters.priority === "all" || ticket.priority === filters.priority) &&
                    (filters.createdBy === "" || filters.createdBy === "all" || ticket.createdBy === filters.createdBy),
            )
            .sort((a, b) => {
                // Always push Closed tickets after non-Closed
                if (a.statusBadge === "Closed" && b.statusBadge !== "Closed") return 1
                if (a.statusBadge !== "Closed" && b.statusBadge === "Closed") return -1

                // Selected sort criteria
                if (sortBy === "selectedEvent") {
                    const aName = (a.selectedEvent || "").toLowerCase()
                    const bName = (b.selectedEvent || "").toLowerCase()
                    if (aName < bName) return -1
                    if (aName > bName) return 1
                    return 0
                } else {
                    const aTime = new Date(a[sortBy]).getTime()
                    const bTime = new Date(b[sortBy]).getTime()
                    return bTime - aTime // Newest first
                }
            })
    }, [tickets, searchTerm, filters, sortBy])

    const uniqueStatuses = useMemo(
        () => [...new Set(tickets.map((ticket) => ticket?.statusBadge).filter(Boolean))],
        [tickets],
    )

    const uniquePriorities = useMemo(
        () => [...new Set(tickets.map((ticket) => ticket?.priority).filter(Boolean))],
        [tickets],
    )

    const uniqueCreators = useMemo(
        () => [...new Set(tickets.map((ticket) => ticket?.createdBy).filter(Boolean))],
        [tickets],
    )

    return {
        searchTerm,
        setSearchTerm,
        sortBy,
        setSortBy,
        filters,
        setFilters,
        resetFilters,
        filteredTickets,
        uniqueStatuses,
        uniquePriorities,
        uniqueCreators,
    }
}
