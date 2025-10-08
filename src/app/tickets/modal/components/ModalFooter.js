"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ChangeIndicator } from "./ChangeIndicator"

export function ModalFooter({
    isAdmin,
    editMode,
    editedTicket,
    changedFields,
    hasUnsavedChanges,
    isUpdating,
    onStatusChange,
    onUpdate,
}) {
    return (
        <div className="mt-6 flex justify-between items-center">
            {isAdmin && (
                <div className="flex items-center space-x-2">
                    <div className="relative flex items-center">
                        <Switch
                            id="completed"
                            checked={editedTicket.statusBadge === "Closed"}
                            onCheckedChange={onStatusChange}
                            className="data-[state=checked]:bg-green-500"
                        />
                        {editMode && changedFields.statusBadge && editedTicket.statusBadge === "Closed" && (
                            <span className="absolute -top-2 -right-2 flex h-3 w-3">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                        )}
                    </div>
                    <Label
                        htmlFor="completed"
                        className={`text-sm font-medium ${editedTicket.statusBadge === "Closed" ? "text-green-600" : "text-gray-700"
                            }`}
                    >
                        {editedTicket.statusBadge === "Closed" ? "Closed" : "Mark as closed"}
                        {editMode && changedFields.statusBadge && editedTicket.statusBadge === "Closed" && (
                            <span className="ml-2 text-xs text-red-500 font-normal">
                                <ChangeIndicator show={true} editMode={editMode} />
                            </span>
                        )}
                    </Label>
                </div>
            )}
            {isAdmin && (
                <motion.div whileHover={{ scale: isUpdating ? 1 : 1.05 }} whileTap={{ scale: isUpdating ? 1 : 0.95 }}>
                    <Button
                        onClick={onUpdate}
                        disabled={isUpdating}
                        className={`${editMode ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                            } text-white px-4 py-2 rounded-md transition-colors flex items-center`}
                    >
                        {isUpdating ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Updating...
                            </>
                        ) : (
                            "Update Ticket"
                        )}
                    </Button>
                </motion.div>
            )}
        </div>
    )
}
