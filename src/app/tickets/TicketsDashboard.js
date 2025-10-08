"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Custom hooks
import { useTickets } from "./shared/hooks/useTickets"
import { useTicketFilters } from "./shared/hooks/useTicketFilters"

// Components
import DashboardHeader from "./shared/components/DashboardHeader"
import TicketFilters from "./shared/components/TicketFilters"
import TicketLoadingSkeleton from "./card-view/TicketLoadingSkeleton"
import TicketCardGrid from "./card-view/TicketCardGrid"
import TicketTableView from "./table-view/TicketTableView"
import TicketModal from "./TicketModal"

export default function TicketsDashboard() {
    const { role } = useAuth()
    const isAdmin = role === "admin"

    const { tickets, loading, refreshData, updateTicket } = useTickets()
    const {
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
    } = useTicketFilters(tickets)

    const [selectedTicket, setSelectedTicket] = useState(null)
    const [viewMode, setViewMode] = useState("card")
    const [sortConfig, setSortConfig] = useState({ key: "updatedAt", direction: "descending" })
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(50)

    // Load saved view mode from localStorage
    useEffect(() => {
        const savedViewMode = localStorage.getItem("ticketsViewMode")
        if (savedViewMode) {
            setViewMode(savedViewMode)
        }
    }, [])

    // Save view mode to localStorage
    useEffect(() => {
        localStorage.setItem("ticketsViewMode", viewMode)
    }, [viewMode])

    // Update sort config when sortBy changes
    useEffect(() => {
        setSortConfig({ key: sortBy, direction: sortBy === "selectedEvent" ? "ascending" : "descending" })
    }, [sortBy])

    const toggleViewMode = () => {
        setViewMode(viewMode === "card" ? "table" : "card")
        setCurrentPage(1)
    }

    const handleTicketUpdate = (updatedTicket) => {
        updateTicket(updatedTicket)
        setSelectedTicket(updatedTicket)
    }

    const allTicketIds = tickets.map((ticket) => ticket.uid)

    return (
        <div className="container mx-auto px-4 py-8">
            <ToastContainer position="top-center" />

            <DashboardHeader
                isAdmin={isAdmin}
                loading={loading}
                onRefresh={refreshData}
                viewMode={viewMode}
                onToggleView={toggleViewMode}
            />

            <TicketFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                sortBy={sortBy}
                onSortChange={setSortBy}
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={resetFilters}
                uniqueStatuses={uniqueStatuses}
                uniquePriorities={uniquePriorities}
                uniqueCreators={uniqueCreators}
                loading={loading}
            />

            {loading ? (
                <TicketLoadingSkeleton count={6} />
            ) : (
                <>
                    {viewMode === "card" ? (
                        <TicketCardGrid tickets={filteredTickets} onTicketClick={setSelectedTicket} />
                    ) : (
                        <TicketTableView
                            tickets={filteredTickets}
                            onTicketClick={setSelectedTicket}
                            sortConfig={sortConfig}
                            setSortConfig={setSortConfig}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                        />
                    )}
                </>
            )}

            {selectedTicket && (
                <TicketModal
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                    isOpen={!!selectedTicket}
                    isAdmin={isAdmin}
                    onUpdate={handleTicketUpdate}
                    allTicketIds={allTicketIds}
                />
            )}
        </div>
    )
}
