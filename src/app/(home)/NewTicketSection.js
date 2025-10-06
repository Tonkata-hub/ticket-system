"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "../../context/AuthContext"
import { AlertCircle, Loader2 } from "lucide-react"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { formVariants, itemVariants, titleVariants, buttonVariants } from "./new-ticket/variants"
import { useNewTicketForm } from "./new-ticket/useNewTicketForm"
import PrioritySelect from "./new-ticket/PrioritySelect"
import OptionSelect from "./new-ticket/OptionSelect"

// Animation variants moved to ./new-ticket/variants

export default function NewTicketSection() {
    const { isLoggedIn } = useAuth()

    const shortDescriptionRef = useRef(null)
    const priorityTriggerRef = useRef(null)
    const issueTypeTriggerRef = useRef(null)
    const conditionTriggerRef = useRef(null)
    const eventTriggerRef = useRef(null)
    const submitButtonRef = useRef(null)

    const {
        formKey,
        formData,
        errors,
        isSubmitting,
        submissionError,
        ticketOptions,
        handleChange,
        handleSubmit,
    } = useNewTicketForm({ isLoggedIn })

    useEffect(() => {
        shortDescriptionRef.current?.focus()
    }, [])

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
                                    <PrioritySelect
                                        key={formKey + "priority"}
                                        value={formData.priority}
                                        options={ticketOptions.priority}
                                        error={!!errors.priority}
                                        onChange={(value) => handleChange("priority", value)}
                                        triggerRef={priorityTriggerRef}
                                        onEnter={() => issueTypeTriggerRef.current?.click()}
                                        disabled={!isLoggedIn || isSubmitting}
                                    />
                                </motion.div>

                                {/* Remaining optional dropdowns */}
                                <motion.div className="space-y-2" variants={itemVariants}>
                                    <OptionSelect
                                        key={formKey + "issueType"}
                                        label="Избор на запитване"
                                        options={ticketOptions.issueType}
                                        value={formData.issueType}
                                        onChange={(value) => handleChange("issueType", value)}
                                        error={!!errors.issueType}
                                        extraFieldValue={formData.otherIssue}
                                        onExtraChange={(value) => handleChange("otherIssue", value)}
                                        triggerRef={issueTypeTriggerRef}
                                        onEnter={() => conditionTriggerRef.current?.click()}
                                        showExtra={formData.issueType === "other"}
                                        disabled={!isLoggedIn || isSubmitting}
                                        extraFieldError={!!errors.otherIssue}
                                    />
                                </motion.div>
                                <motion.div className="space-y-2" variants={itemVariants}>
                                    <OptionSelect
                                        key={formKey + "condition"}
                                        label="Състояние"
                                        options={ticketOptions.condition}
                                        value={formData.condition}
                                        onChange={(value) => handleChange("condition", value)}
                                        error={!!errors.condition}
                                        extraFieldValue={formData.otherCondition}
                                        onExtraChange={(value) => handleChange("otherCondition", value)}
                                        triggerRef={conditionTriggerRef}
                                        onEnter={() => eventTriggerRef.current?.click()}
                                        showExtra={formData.condition === "other"}
                                        disabled={!isLoggedIn || isSubmitting}
                                        extraFieldError={!!errors.otherCondition}
                                    />
                                </motion.div>
                                <motion.div className="space-y-2" variants={itemVariants}>
                                    <OptionSelect
                                        key={formKey + "event"}
                                        label="Действие"
                                        options={ticketOptions.event}
                                        value={formData.event}
                                        onChange={(value) => handleChange("event", value)}
                                        error={!!errors.event}
                                        triggerRef={eventTriggerRef}
                                        onEnter={() => submitButtonRef.current?.focus()}
                                        showExtra={false}
                                        disabled={!isLoggedIn || isSubmitting}
                                    />
                                </motion.div>
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
