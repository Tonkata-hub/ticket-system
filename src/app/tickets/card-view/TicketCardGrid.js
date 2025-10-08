"use client"

import { motion, AnimatePresence } from "framer-motion"
import TicketCard from "./TicketCard"

export default function TicketCardGrid({ tickets, onTicketClick }) {
    return (
        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
        >
            <AnimatePresence mode="sync">
                {tickets.length > 0 ? (
                    tickets.map((ticket, index) => (
                        <motion.div
                            key={ticket.uid}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
                            transition={{
                                duration: 0.15,
                                delay: Math.min(index * 0.02, 0.1),
                            }}
                            layout
                        >
                            <TicketCard ticket={ticket} onClick={() => onTicketClick(ticket)} />
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
    )
}
