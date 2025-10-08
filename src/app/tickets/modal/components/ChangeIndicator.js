"use client"

import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"

export function ChangeIndicator({ show, editMode }) {
    if (!show || !editMode) return null

    return (
        <motion.div
            className="inline-flex items-center ml-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200"
            initial={{ opacity: 0, scale: 0.8, y: -5 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 20,
                },
            }}
            whileInView={{
                boxShadow: [
                    "0 0 0 0 rgba(251, 191, 36, 0)",
                    "0 0 0 4px rgba(251, 191, 36, 0.3)",
                    "0 0 0 0 rgba(251, 191, 36, 0)",
                ],
                transition: {
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    duration: 2,
                    ease: "easeInOut",
                },
            }}
        >
            <motion.div
                initial={{ rotate: -15 }}
                animate={{ rotate: 15 }}
                transition={{
                    repeat: 2,
                    duration: 0.3,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
            >
                <AlertCircle className="h-3 w-3 mr-1" />
            </motion.div>
            <span>Unsaved</span>
        </motion.div>
    )
}
