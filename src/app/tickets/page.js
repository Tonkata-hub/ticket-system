"use client"
import TicketsDashboard from "./TicketsDashboard"
import { motion } from "framer-motion"

const TicketsPage = () => {
    return (
        <motion.div
            className="min-h-[calc(100vh-64px-69px)] bg-gray-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <TicketsDashboard />
        </motion.div>
    )
}

export default TicketsPage

