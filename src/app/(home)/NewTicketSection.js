"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "../../context/AuthContext"
import { AlertCircle, Info, Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"

// Animation variants
const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            when: "beforeChildren",
            staggerChildren: 0.1,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
        },
    },
}

const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
        },
    },
}

const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.3,
        },
    },
    hover: {
        scale: 1.05,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10,
        },
    },
    tap: {
        scale: 0.95,
    },
}

export default function NewTicketSection() {
    const { isLoggedIn } = useAuth()

    const shortDescriptionRef = useRef(null)
    const priorityTriggerRef = useRef(null)
    const issueTypeTriggerRef = useRef(null)
    const conditionTriggerRef = useRef(null)
    const eventTriggerRef = useRef(null)
    const submitButtonRef = useRef(null)

    const [formData, setFormData] = useState({
        issueType: "",
        condition: "",
        priority: "",
        event: "",
        otherIssue: "",
        otherCondition: "",
        clientNote: "",
        shortDescription: "",
    })
    const [formKey, setFormKey] = useState(0)
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submissionError, setSubmissionError] = useState(null)

    const [ticketOptions, setTicketOptions] = useState({
        issueType: [],
        condition: [],
        priority: [],
        event: [],
    })

    useEffect(() => {
        shortDescriptionRef.current?.focus()
    }, [])

    useEffect(() => {
        const loadOptions = async () => {
            const res = await fetch("/api/ticket-options")
            const data = await res.json()
            setTicketOptions(data)
        }
        loadOptions()
    }, [])

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))

        // Clear error for this field when user makes a change
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: false,
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {
            priority: !formData.priority,
            shortDescription: !formData.shortDescription,
        }

        setErrors(newErrors)
        return !Object.values(newErrors).some(Boolean)
    }

    const handleSubmit = async () => {
        if (!isLoggedIn) {
            toast.error("Please log in to submit a ticket")
            return
        }

        if (!validateForm()) {
            toast.error("Please complete all required fields")
            return
        }

        setIsSubmitting(true)
        setSubmissionError(null)

        try {
            // Prepare the data for submission
            const ticketData = {
                issueType: formData.issueType === "other" ? formData.otherIssue : formData.issueType,
                condition: formData.condition === "other" ? formData.otherCondition : formData.condition,
                priority: formData.priority,
                event: formData.event,
                clientNote: formData.clientNote || "",
                shortDescription: formData.shortDescription,
            }

            // Submit the data to the API
            const response = await fetch("/api/createTicket", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ticketData),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Failed to create ticket")
            }

            // Show success message
            toast.success(`Ticket ${result.ticket.uid} created successfully!`)

            // Reset the form
            setFormData({
                issueType: "",
                condition: "",
                priority: "",
                event: "",
                otherIssue: "",
                otherCondition: "",
                clientNote: "",
                shortDescription: "",
            })
            setFormKey((prev) => prev + 1)
        } catch (error) {
            console.error("Error submitting ticket:", error)
            setSubmissionError(error.message)
            toast.error(`Failed to create ticket: ${error.message}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="w-full py-12 md:py-20 lg:py-26 flex justify-center bg-blue-50">
            <div className="container px-4 md:px-6">
                <AnimatePresence>
                    {typeof isLoggedIn === "boolean" &&
                        (isLoggedIn ? (
                            <motion.h1
                                className="text-4xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-blue-900"
                                variants={titleVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                Изпратете нов билет за поддръжка
                            </motion.h1>
                        ) : (
                            <>
                                <motion.h1
                                    className="text-4xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-blue-900"
                                    variants={titleVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    Изпратете билет за поддръжка
                                </motion.h1>
                                <motion.p
                                    className="text-lg text-center mb-12 text-gray-600 max-w-2xl mx-auto"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    Нуждаете се от помощ? Попълнете формуляра по-долу и нашият екип за поддръжка ще се свърже с вас
                                    възможно най-скоро.
                                </motion.p>
                            </>
                        ))}
                </AnimatePresence>

                <motion.div variants={formVariants} initial="hidden" animate="visible">
                    <Card className="max-w-3xl mx-auto border-blue-100 shadow-lg">
                        <ToastContainer position="top-center" autoClose={3000} />

                        <CardHeader className="bg-blue-100 border-b border-blue-100">
                            <motion.div variants={itemVariants}>
                                <CardTitle className="text-2xl text-center text-blue-800">Нов билет за поддръжка</CardTitle>
                                <CardDescription className="text-center text-blue-600">
                                    Моля, предоставете подробности за вашия проблем
                                </CardDescription>
                            </motion.div>
                        </CardHeader>

                        <AnimatePresence>
                            {isLoggedIn === false && (
                                <motion.div
                                    className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-red-50 p-4 rounded-md my-3 border border-red-200"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                >
                                    <p className="text-center text-md text-red-600">Моля, влезте в системата, за да изпратите билет!</p>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="outline"
                                            className="border-red-500 text-red-600 hover:bg-red-100 hover:text-red-700"
                                            onClick={() => (window.location.href = "/login")}
                                        >
                                            Вход в системата
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {submissionError && (
                                <motion.div
                                    className="bg-red-50 border border-red-200 p-4 mx-6 my-3 rounded-md"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                >
                                    <div className="flex items-start">
                                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                                        <p className="text-red-700">{submissionError}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <TooltipProvider>
                            <CardContent className="space-y-6 pt-6">
                                {/* Кратко описание */}
                                <motion.div className="space-y-2" variants={itemVariants}>
                                    <label className="text-md font-medium text-gray-700">
                                        Кратко описание <span className="text-red-500 text-sm font-bold ml-1">*</span>
                                    </label>
                                    <Input
                                        ref={shortDescriptionRef}
                                        value={formData.shortDescription}
                                        onChange={(e) => handleChange("shortDescription", e.target.value)}
                                        placeholder="Въведете кратко описание на проблема"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                priorityTriggerRef.current?.click()
                                            }
                                        }}
                                        className={`w-full rounded-md border border-blue-300 bg-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition duration-150 ease-in-out ${errors.shortDescription ? "border-red-500" : ""}`}
                                        disabled={isSubmitting}
                                    />
                                </motion.div>

                                {/* Приоритет (moved here) */}
                                <motion.div className="space-y-2" variants={itemVariants}>
                                    <label className="text-md font-medium text-gray-700">
                                        Приоритет <span className="text-red-500 text-sm font-bold ml-1">*</span>
                                    </label>
                                    <Select
                                        key={formKey + "priority"}
                                        onValueChange={(value) => handleChange("priority", value)}
                                        disabled={!isLoggedIn || isSubmitting}
                                    >
                                        <SelectTrigger
                                            className={`w-full ${errors.priority ? "border-red-500" : "border-blue-300"} bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                            ref={priorityTriggerRef}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault()
                                                    issueTypeTriggerRef.current?.click()
                                                }
                                            }}
                                        >
                                            <SelectValue placeholder="Изберете приоритет">
                                                <span>
                                                    {formData.priority
                                                        ? ticketOptions.priority.find((p) => p.value === formData.priority)?.text
                                                        : null}
                                                </span>
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ticketOptions.priority.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{option.text}</span>
                                                        {option.description && formData.priority !== option.value && (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className="relative group flex items-center justify-center" tabIndex={-1}>
                                                                        <Info className="h-[16px] w-[16px] text-blue-400 group-hover:text-blue-600 transition-colors duration-200 ease-in-out" />
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent
                                                                    side="right"
                                                                    className="max-w-[200px] bg-white text-sm text-gray-700 border shadow-md rounded-md px-3 py-2"
                                                                >
                                                                    {option.description}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </motion.div>

                                {/* Remaining optional dropdowns */}
                                {[
                                    {
                                        label: "Избор на запитване",
                                        options: ticketOptions.issueType,
                                        field: "issueType",
                                        extraField: "otherIssue",
                                        triggerRef: issueTypeTriggerRef,
                                        nextFocus: () => conditionTriggerRef.current?.click(),
                                    },
                                    {
                                        label: "Състояние",
                                        options: ticketOptions.condition,
                                        field: "condition",
                                        extraField: "otherCondition",
                                        triggerRef: conditionTriggerRef,
                                        nextFocus: () => eventTriggerRef.current?.click(),
                                    },
                                    {
                                        label: "Действие",
                                        options: ticketOptions.event,
                                        field: "event",
                                        extraField: null,
                                        triggerRef: eventTriggerRef,
                                        nextFocus: () => submitButtonRef.current?.focus(),
                                    },
                                ].map(({ label, options, field, extraField, triggerRef, nextFocus }, index) => (
                                    <motion.div key={index} className="space-y-2" variants={itemVariants}>
                                        <label className="text-md font-medium text-gray-700">{label}</label>
                                        <Select
                                            key={formKey + field}
                                            onValueChange={(value) => handleChange(field, value)}
                                            disabled={!isLoggedIn || isSubmitting}
                                        >
                                            <SelectTrigger
                                                ref={triggerRef}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault()
                                                        nextFocus()
                                                    }
                                                }}
                                                className={`w-full ${errors[field] ? "border-red-500" : "border-blue-300"} bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                            >
                                                <SelectValue placeholder={`Изберете ${label.toLowerCase()}`} />
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
                                            {formData[field] === "other" && extraField && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                >
                                                    <Input
                                                        value={formData[extraField]}
                                                        onChange={(e) => handleChange(extraField, e.target.value)}
                                                        placeholder={`Моля, уточнете ${label.toLowerCase()}`}
                                                        className={`mt-2 ${errors[extraField] ? "border-red-500" : "border-blue-300"} bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                        disabled={isSubmitting}
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </CardContent>
                        </TooltipProvider>

                        <CardFooter>
                            <motion.div className="w-full" variants={buttonVariants} whileHover="hover" whileTap="tap">
                                <Button
                                    ref={submitButtonRef}
                                    onClick={handleSubmit}
                                    disabled={!isLoggedIn || isSubmitting}
                                    className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Ticket"
                                    )}
                                </Button>
                            </motion.div>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </section>
    )
}
