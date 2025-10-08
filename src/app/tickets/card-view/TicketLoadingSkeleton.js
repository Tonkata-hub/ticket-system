"use client"

import { motion } from "framer-motion"
import TicketSkeleton from "./TicketSkeleton"

export default function TicketLoadingSkeleton({ count = 6 }) {
    return (
        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {Array.from({ length: count }).map((_, index) => (
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
    )
}
