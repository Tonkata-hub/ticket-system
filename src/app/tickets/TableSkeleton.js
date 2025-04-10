"use client"

import { motion } from "framer-motion"

export default function TableSkeleton() {
    return (
        <div className="w-full overflow-hidden rounded-md border shadow-sm">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Event</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Priority</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Created By</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Created At</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Updated At</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <motion.tr
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="border-t"
                        >
                            <td className="px-4 py-3">
                                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="h-5 w-36 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="h-5 w-36 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
