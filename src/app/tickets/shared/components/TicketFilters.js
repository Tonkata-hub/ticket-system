"use client"

import { motion } from "framer-motion"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MultiSelectFilter from "./MultiSelectFilter"

export default function TicketFilters({
    searchTerm,
    onSearchChange,
    sortBy,
    onSortChange,
    filters,
    onFilterChange,
    onResetFilters,
    uniqueStatuses,
    uniquePriorities,
    uniqueCreators,
    loading,
}) {
    return (
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
                    onChange={(e) => onSearchChange(e.target.value)}
                    disabled={loading}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <div className="grid grid-cols-2 gap-4 items-center sm:flex sm:flex-wrap w-full sm:w-auto">
                <Select value={sortBy} onValueChange={onSortChange} disabled={loading}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="updatedAt">Last updated</SelectItem>
                        <SelectItem value="createdAt">Date created</SelectItem>
                        <SelectItem value="selectedEvent">Event name</SelectItem>
                    </SelectContent>
                </Select>

                <MultiSelectFilter
                    label="Statuses"
                    options={uniqueStatuses}
                    selected={filters.statusBadge}
                    onChange={(value) => onFilterChange({ ...filters, statusBadge: value })}
                    disabled={loading}
                />

                <MultiSelectFilter
                    label="Priorities"
                    options={uniquePriorities}
                    selected={filters.priority}
                    onChange={(value) => onFilterChange({ ...filters, priority: value })}
                    disabled={loading}
                />

                <MultiSelectFilter
                    label="Creators"
                    options={uniqueCreators}
                    selected={filters.createdBy}
                    onChange={(value) => onFilterChange({ ...filters, createdBy: value })}
                    disabled={loading}
                />

                <motion.div whileHover={{ scale: loading ? 1 : 1.05 }} whileTap={{ scale: loading ? 1 : 0.95 }}>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onResetFilters}
                        className="w-full sm:w-auto flex items-center bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                        disabled={loading}
                    >
                        <X className="mr-2 h-4 w-4" />
                        Reset Filters
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    )
}
