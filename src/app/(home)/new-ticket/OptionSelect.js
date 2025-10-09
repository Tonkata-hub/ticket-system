"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnimatePresence, motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { useI18n } from "@/context/I18nContext"

export default function OptionSelect({
    label,
    options,
    value,
    onChange,
    error,
    extraFieldValue,
    onExtraChange,
    triggerRef,
    onEnter,
    showExtra,
    disabled = false,
    extraFieldError,
}) {
    const { t } = useI18n()
    return (
        <div className="space-y-2">
            <label className="text-md font-medium text-gray-700">{label}</label>
            <Select onValueChange={onChange} disabled={disabled}>
                <SelectTrigger
                    ref={triggerRef}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            onEnter?.()
                        }
                    }}
                    className={`w-full ${error ? "border-red-500" : "border-blue-300"} bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                >
                    <SelectValue placeholder={t("home.select", { label: label.toLowerCase() })} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.text}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <AnimatePresence>
                {showExtra && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <Input
                            value={extraFieldValue}
                            onChange={(e) => onExtraChange(e.target.value)}
                            placeholder={t("home.pleaseSpecify", { label: label.toLowerCase() })}
                            className={`mt-2 ${extraFieldError ? "border-red-500" : "border-blue-300"} bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            disabled={disabled}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}



