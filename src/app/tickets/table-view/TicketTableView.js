"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useTableSort, useSortHandler } from "./hooks/useTableSort"
import { useTablePagination, usePaginationHandlers } from "./hooks/useTablePagination"
import TableHeader from "./TableHeader"
import TicketTableRow from "./TicketTableRow"
import PaginationControls from "./PaginationControls"

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
    const sortedTickets = useTableSort(tickets, sortConfig)
    const requestSort = useSortHandler(sortConfig, setSortConfig)

    const { paginatedItems, totalPages } = useTablePagination(sortedTickets, currentPage, itemsPerPage)
    const { handlePageChange, handleItemsPerPageChange } = usePaginationHandlers(
        setCurrentPage,
        setItemsPerPage,
        totalPages,
    )

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
                            <TableHeader sortConfig={sortConfig} onSort={requestSort} />
                            <tbody>
                                <AnimatePresence mode="wait">
                                    {paginatedItems.map((ticket) => (
                                        <TicketTableRow key={ticket.uid} ticket={ticket} onClick={onTicketClick} />
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
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
