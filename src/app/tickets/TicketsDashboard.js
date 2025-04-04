"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import TicketCard from "./TicketCard"
import TicketModal from "./TicketModal"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import mockTickets from "./mock-tickets"

// Temporary admin variable
const isAdmin = true;

export default function TicketsDashboard() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [filters, setFilters] = useState({
        statusBadge: "all",
        priority: "all",
        createdBy: "all",
    })

    const filteredTickets = mockTickets
        .filter(
            (ticket) =>
                (ticket.selectedEvent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    ticket.uid.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (filters.statusBadge === "" || filters.statusBadge === "all" || ticket.statusBadge === filters.statusBadge) &&
                (filters.priority === "" || filters.priority === "all" || ticket.priority === filters.priority) &&
                (filters.createdBy === "" || filters.createdBy === "all" || ticket.createdBy === filters.createdBy),
        )
        .sort((a, b) => {
            if (a.statusBadge === "Closed" && b.statusBadge !== "Closed") {
                return 1
            }
            if (a.statusBadge !== "Closed" && b.statusBadge === "Closed") {
                return -1
            }
            return 0
        })

    const uniqueStatuses = [...new Set(mockTickets.map((ticket) => ticket.statusBadge))]
    const uniquePriorities = [...new Set(mockTickets.map((ticket) => ticket.priority))]
    const uniqueCreators = [...new Set(mockTickets.map((ticket) => ticket.createdBy))]

    const resetFilters = () => {
        setFilters({
            statusBadge: "all",
            priority: "all",
            createdBy: "all",
        })
        setSearchTerm("")
    }

    const handleTicketUpdate = (updatedTicket) => {
        // In a real application, you would update the ticket in your database here
        console.log("Updating ticket:", updatedTicket)
        // For now, we'll just update the selectedTicket state
        setSelectedTicket(updatedTicket)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-8">Tickets Dashboard</h1>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
                <div className="grid grid-cols-2 gap-4 items-center sm:flex sm:flex-wrap w-full sm:w-auto">
                    <Select value={filters.statusBadge} onValueChange={(value) => setFilters({ ...filters, statusBadge: value })}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {uniqueStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="All Priorities" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priorities</SelectItem>
                            {uniquePriorities.map((priority) => (
                                <SelectItem key={priority} value={priority}>
                                    {priority}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filters.createdBy} onValueChange={(value) => setFilters({ ...filters, createdBy: value })}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="All Creators" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Creators</SelectItem>
                            {uniqueCreators.map((creator) => (
                                <SelectItem key={creator} value={creator}>
                                    {creator}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                        className="w-full sm:w-auto flex items-center bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Reset Filters
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTickets.map((ticket) => (
                    <TicketCard key={ticket.uid} ticket={ticket} onClick={() => setSelectedTicket(ticket)} />
                ))}
            </div>
            {selectedTicket && (
                <TicketModal
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                    isOpen={!!selectedTicket}
                    isAdmin={isAdmin}
                    onUpdate={handleTicketUpdate}
                />
            )}
        </div>
    )
}

