"use client"

import { useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TicketTableView({
    tickets,
    onTicketClick,
    sortConfig,
    setSortConfig,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
}) {
    // Status and priority color mappings
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

    // Sorting logic
    const requestSort = (key) => {
        let direction = "ascending"
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending"
        }
        setSortConfig({ key, direction })
    }

    // Apply sorting to tickets
    const sortedTickets = useMemo(() => {
        const sortableTickets = [...tickets]
        if (sortConfig.key) {
            sortableTickets.sort((a, b) => {
                // Handle different data types
                let aValue = a[sortConfig.key]
                let bValue = b[sortConfig.key]

                // Handle dates
                if (sortConfig.key === "createdAt" || sortConfig.key === "updatedAt") {
                    aValue = new Date(aValue).getTime()
                    bValue = new Date(bValue).getTime()
                }

                // Handle strings
                if (typeof aValue === "string" && typeof bValue === "string") {
                    aValue = aValue.toLowerCase()
                    bValue = bValue.toLowerCase()
                }

                if (aValue < bValue) {
                    return sortConfig.direction === "ascending" ? -1 : 1
                }
                if (aValue > bValue) {
                    return sortConfig.direction === "ascending" ? 1 : -1
                }
                return 0
            })
        }
        return sortableTickets
    }, [tickets, sortConfig])

    // Pagination logic
    const totalPages = Math.ceil(sortedTickets.length / itemsPerPage)
    const paginatedTickets = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return sortedTickets.slice(startIndex, startIndex + itemsPerPage)
    }, [sortedTickets, currentPage, itemsPerPage])

    // Format date helper
    function formatDate(isoDate) {
        const date = new Date(isoDate)
        return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    // Get sort direction icon
    const getSortDirectionIcon = (key) => {
        if (sortConfig.key !== key) return null
        return sortConfig.direction === "ascending" ? (
            <ChevronUp className="h-4 w-4" />
        ) : (
            <ChevronDown className="h-4 w-4" />
        )
    }

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage)
        }
    }

    // Handle items per page change
    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(Number(value))
        setCurrentPage(1) // Reset to first page when changing items per page
    }

    return (
        <motion.div
            className="w-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {tickets.length > 0 ? (
                <>
                    <div className="rounded-md border shadow-sm overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-muted/50">
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        <button
                                            className="flex items-center gap-1 hover:text-foreground"
                                            onClick={() => requestSort("uid")}
                                        >
                                            ID {getSortDirectionIcon("uid")}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        <button
                                            className="flex items-center gap-1 hover:text-foreground"
                                            onClick={() => requestSort("selectedEvent")}
                                        >
                                            Event {getSortDirectionIcon("selectedEvent")}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        <button
                                            className="flex items-center gap-1 hover:text-foreground"
                                            onClick={() => requestSort("statusBadge")}
                                        >
                                            Status {getSortDirectionIcon("statusBadge")}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        <button
                                            className="flex items-center gap-1 hover:text-foreground"
                                            onClick={() => requestSort("priority")}
                                        >
                                            Priority {getSortDirectionIcon("priority")}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        <button
                                            className="flex items-center gap-1 hover:text-foreground"
                                            onClick={() => requestSort("createdBy")}
                                        >
                                            Created By {getSortDirectionIcon("createdBy")}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        <button
                                            className="flex items-center gap-1 hover:text-foreground"
                                            onClick={() => requestSort("createdAt")}
                                        >
                                            Created At {getSortDirectionIcon("createdAt")}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        <button
                                            className="flex items-center gap-1 hover:text-foreground"
                                            onClick={() => requestSort("updatedAt")}
                                        >
                                            Updated At {getSortDirectionIcon("updatedAt")}
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="wait">
                                    {paginatedTickets.map((ticket) => (
                                        <motion.tr
                                            key={ticket.uid}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className={`border-t hover:bg-muted/50 cursor-pointer ${ticket.statusBadge === "Closed" ? "bg-gray-50" : ""
                                                }`}
                                            onClick={() => onTicketClick(ticket)}
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                <span className={ticket.statusBadge === "Closed" ? "line-through text-gray-500" : ""}>
                                                    {ticket.uid}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 max-w-[200px]">
                                                <div
                                                    className={`truncate ${ticket.statusBadge === "Closed" ? "line-through text-gray-500" : ""}`}
                                                >
                                                    {ticket.selectedEvent}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    className={`${statusColor[ticket.statusBadge]} capitalize ${ticket.statusBadge === "Closed" ? "opacity-60" : ""}`}
                                                >
                                                    {ticket.statusBadge}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    className={`${priorityColor[ticket.priority]} capitalize ${ticket.statusBadge === "Closed" ? "opacity-60" : ""}`}
                                                >
                                                    {ticket.priority}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={ticket.statusBadge === "Closed" ? "text-gray-500" : ""}>
                                                    {ticket.createdBy}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={ticket.statusBadge === "Closed" ? "text-gray-500" : ""}>
                                                    {formatDate(ticket.createdAt)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={ticket.statusBadge === "Closed" ? "text-gray-500" : ""}>
                                                    {formatDate(ticket.updatedAt)}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination controls */}
                    <div className="flex items-center justify-between my-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Rows per page:</span>
                            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                                <SelectTrigger className="w-[80px] h-8">
                                    <SelectValue placeholder="50" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-1">
                            <span className="text-sm text-muted-foreground mr-2">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <ChevronLeft className="h-4 w-4 -ml-2" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                                <ChevronRight className="h-4 w-4 -ml-2" />
                            </Button>
                        </div>
                    </div>
                </>
            ) : (
                <motion.div
                    className="flex justify-center items-center py-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <p className="text-gray-500 text-lg">No tickets found matching your filters.</p>
                </motion.div>
            )}
        </motion.div>
    )
}
