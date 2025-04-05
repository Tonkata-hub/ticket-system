"use client"

import { motion } from "framer-motion"

export default function TicketSkeleton() {
    return (
        <motion.div
            className="bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="h-6 w-3/5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-1/4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-12 w-full bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="flex justify-between items-center mb-4">
                <div className="h-6 w-1/4 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-6 w-1/4 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between">
                <div className="h-5 w-2/5 bg-gray-200 rounded animate-pulse"></div>
            </div>
        </motion.div>
    )
}

