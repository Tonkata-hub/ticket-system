"use client"

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import TicketCard from "./TicketCard";
import TicketModal from "./TicketModal";
import TicketSkeleton from "./TicketSkeleton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import RefreshButton from "./RefreshButton";
import AdminBadge from "@/app/tickets/AdminBadge";
import { useAuth } from "../context/AuthContext";

export default function TicketsDashboard() {
    const { role } = useAuth();
    const isAdmin = role === "admin";

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        statusBadge: "all",
        priority: "all",
        createdBy: "all",
    });

    // Simulate fetching data with a delay
    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/getTickets");
                const data = await res.json();

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
                        updatedAt: t.updated_at,
                    }));

                    setTickets(parsed);
                }
            } catch (error) {
                console.error("Error fetching tickets", error);
            }
            setLoading(false)
        }

        fetchTickets()
    }, [])

    const refreshData = async () => {
        setLoading(true);

        try {
            // await new Promise((resolve) => setTimeout(resolve, 1000));

            const res = await fetch("/api/getTickets");
            const data = await res.json();

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
                    relatedTickets: t.related_tickets
                        ? t.related_tickets.split(",")
                        : [],
                    attachments: t.attachments
                        ? t.attachments.split(",")
                        : [],
                    comments: t.comments
                        ? JSON.parse(t.comments)
                        : [],
                    updatedAt: t.updated_at,
                }));

                setTickets(parsed);
            }
        } catch (err) {
            console.error("Error refreshing tickets:", err);
        }

        setLoading(false);
    };

    const filteredTickets = tickets
        .filter((ticket) => ticket && typeof ticket === "object") // Filter out undefined or non-object tickets
        .filter(
            (ticket) =>
                (ticket.selectedEvent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    ticket.uid?.toLowerCase().includes(searchTerm.toLowerCase())) &&
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

    // Get unique values for filters from the loaded tickets, not the mock data directly
    const uniqueStatuses = [...new Set(tickets.map((ticket) => ticket?.statusBadge).filter(Boolean))];
    const uniquePriorities = [...new Set(tickets.map((ticket) => ticket?.priority).filter(Boolean))];
    const uniqueCreators = [...new Set(tickets.map((ticket) => ticket?.createdBy).filter(Boolean))];

    const resetFilters = () => {
        setFilters({
            statusBadge: "all",
            priority: "all",
            createdBy: "all",
        });
        setSearchTerm("");
    }

    const handleTicketUpdate = (updatedTicket) => {
        // In a real application, you would update the ticket in your database here
        console.log("Updating ticket:", updatedTicket);
        // For now, we'll just update the selectedTicket state
        setSelectedTicket(updatedTicket);

        // Also update the ticket in our local state
        setTickets((prevTickets) =>
            prevTickets.map((ticket) => (ticket.uid === updatedTicket.uid ? updatedTicket : ticket)),
        )
    }

    // Create an array of skeleton loaders based on the number of expected tickets
    const skeletonCount = 6 // Show 6 skeleton cards while loading

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                    <motion.h1
                        className="text-3xl font-bold text-blue-800"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Tickets Dashboard
                    </motion.h1>
                    {isAdmin && <AdminBadge className="ml-3" />}
                </div>

                <RefreshButton onRefresh={refreshData} disabled={loading} />
            </div>
            <motion.div
                className="flex flex-col sm:flex-row justify-between items-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={loading}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
                <div className="grid grid-cols-2 gap-4 items-center sm:flex sm:flex-wrap w-full sm:w-auto">
                    <Select
                        value={filters.statusBadge}
                        onValueChange={(value) => setFilters({ ...filters, statusBadge: value })}
                        disabled={loading}
                    >
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

                    <Select
                        value={filters.priority}
                        onValueChange={(value) => setFilters({ ...filters, priority: value })}
                        disabled={loading}
                    >
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

                    <Select
                        value={filters.createdBy}
                        onValueChange={(value) => setFilters({ ...filters, createdBy: value })}
                        disabled={loading}
                    >
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

                    <motion.div whileHover={{ scale: loading ? 1 : 1.05 }} whileTap={{ scale: loading ? 1 : 0.95 }}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={resetFilters}
                            className="w-full sm:w-auto flex items-center bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                            disabled={loading}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Reset Filters
                        </Button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Loading state */}
            {loading ? (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {Array.from({ length: skeletonCount }).map((_, index) => (
                        <motion.div
                            key={`skeleton-${index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.2,
                                delay: index * 0.03,
                            }}
                        >
                            <TicketSkeleton />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                /* Loaded content */
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <AnimatePresence mode="sync">
                        {filteredTickets.length > 0 ? (
                            filteredTickets.map((ticket, index) => (
                                <motion.div
                                    key={ticket.uid}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
                                    transition={{
                                        duration: 0.15,
                                        delay: Math.min(index * 0.02, 0.1), // Cap the delay at 0.1s max
                                    }}
                                    layout
                                >
                                    <TicketCard ticket={ticket} onClick={() => setSelectedTicket(ticket)} />
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                className="col-span-full flex justify-center items-center py-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <p className="text-gray-500 text-lg">No tickets found matching your filters.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}

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

