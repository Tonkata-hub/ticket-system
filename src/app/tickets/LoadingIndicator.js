"use client"

import { motion } from "framer-motion"

export default function LoadingIndicator() {
    return (
        <div className="flex justify-center items-center py-4">
            <motion.div
                className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
        </div>
    )
}

