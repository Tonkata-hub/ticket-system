"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "../context/AuthContext"
import { AlertCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NewTicketSection() {
    const { isLoggedIn } = useAuth()
    const router = useRouter()

    const [formData, setFormData] = useState({
        issueType: "",
        condition: "",
        priority: "",
        event: "",
        otherIssue: "",
        otherCondition: "",
        clientNote: "",
    })
    const [formKey, setFormKey] = useState(0)
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submissionError, setSubmissionError] = useState(null)

    const issueTypes = [
        { value: "pc-components", text: "PC компютри, компоненти и мобилни у-ва" },
        { value: "servers-vms", text: "Сървъри и вирт. машини, достъп до папки" },
        { value: "printing", text: "Принтиране Копиране Сканиране" },
        { value: "networks-vpn", text: "Мрежи и Мрежово оборудване, VPN" },
        { value: "security-gdpr", text: "Сигурност и Сертифициране, GDPR" },
        { value: "windows-db", text: "Windows, OS, Users, Share, база данни" },
        { value: "accounting-software", text: "Приложения, Счетоводен софтуер" },
        { value: "office-apps", text: "Офис приложения, ms365" },
        { value: "digital-signatures", text: "Електронни подписи и сертификати" },
        { value: "hosting", text: "Хостинг, сайт, имейли, акаунти" },
        { value: "other", text: "Др." },
    ]

    const conditions = [
        { value: "not-working", text: "Не работи, спря: устройство, услуга" },
        { value: "review-hardware", text: "За преглед hardware, [или фабрични настройки]" },
        { value: "review-software", text: "За преглед software, [или преинсталация]" },
        { value: "slow-issues", text: "Работи бавно, забива, дава грешки" },
        { value: "change-device", text: "Промяна на у-во, потребител, приложение" },
        { value: "replace-supply", text: "За смяна на консуматив" },
        { value: "project-discussion", text: "Проект (изисква обсъждане)" },
        { value: "other", text: "Др." },
    ]

    const priorities = [
        { value: "urgent", text: "Спешен" },
        { value: "standard", text: "Стандартен" },
        { value: "low-priority", text: "Нисък приоритет" },
    ]

    const events = [
        { value: "it-support", text: "IT поддръжка" },
        { value: "it-archive", text: "IT архив" },
        { value: "pc-preparation", text: "PC подготовка за офис работа" },
        { value: "equipment-management", text: "Взимане/даване ИТ оборудване / ремонт / консуматив" },
        { value: "ticket-review", text: "Преглед и анализ на ticket" },
        { value: "it-consultation", text: "IT консултация" },
    ]

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
            issueType: !formData.issueType,
            condition: !formData.condition,
            priority: !formData.priority,
            event: !formData.event,
            otherIssue: formData.issueType === "other" && !formData.otherIssue,
            otherCondition: formData.condition === "other" && !formData.otherCondition,
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
            })
            setFormKey((prev) => prev + 1)

            // Redirect to tickets page after a short delay
            setTimeout(() => {
                router.push("/tickets")
            }, 2000)
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
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-blue-900">
                    Изпратете билет за поддръжка
                </h1>
                <p className="text-lg text-center mb-12 text-gray-600 max-w-2xl mx-auto">
                    Нуждаете се от помощ? Попълнете формуляра по-долу и нашият екип за поддръжка ще се свърже с вас възможно
                    най-скоро.
                </p>

                <Card className="max-w-3xl mx-auto border-blue-100 shadow-lg">
                    <ToastContainer position="top-center" autoClose={3000} />

                    <CardHeader className="bg-blue-100 border-b border-blue-100">
                        <CardTitle className="text-2xl text-center text-blue-800">Нов билет за поддръжка</CardTitle>
                        <CardDescription className="text-center text-blue-600">
                            Моля, предоставете подробности за вашия проблем
                        </CardDescription>
                    </CardHeader>

                    {isLoggedIn === false && (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-red-50 p-4 rounded-md my-3 border border-red-200">
                            <p className="text-center text-md text-red-600">Моля, влезте в системата, за да изпратите билет!</p>
                            <Button
                                variant="outline"
                                className="border-red-500 text-red-600 hover:bg-red-100 hover:text-red-700"
                                onClick={() => (window.location.href = "/login")}
                            >
                                Вход в системата
                            </Button>
                        </div>
                    )}

                    {submissionError && (
                        <div className="bg-red-50 border border-red-200 p-4 mx-6 my-3 rounded-md">
                            <div className="flex items-start">
                                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                                <p className="text-red-700">{submissionError}</p>
                            </div>
                        </div>
                    )}

                    <CardContent className="space-y-6 pt-6">
                        {[
                            { label: "Избор на запитване", options: issueTypes, field: "issueType", extraField: "otherIssue" },
                            { label: "Състояние", options: conditions, field: "condition", extraField: "otherCondition" },
                            { label: "Приоритет", options: priorities, field: "priority" },
                            { label: "Действие", options: events, field: "event" },
                        ].map(({ label, options, field, extraField }, index) => (
                            <div key={index} className="space-y-2">
                                <label className="text-md font-medium text-gray-700">
                                    {label} {errors[field] && <span className="text-red-500 text-sm font-bold ml-1">Required</span>}
                                </label>
                                <Select
                                    key={formKey + field}
                                    onValueChange={(value) => handleChange(field, value)}
                                    disabled={!isLoggedIn || isSubmitting}
                                >
                                    <SelectTrigger
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
                                {formData[field] === "other" && extraField && (
                                    <Input
                                        value={formData[extraField]}
                                        onChange={(e) => handleChange(extraField, e.target.value)}
                                        placeholder={`Моля, уточнете ${label.toLowerCase()}`}
                                        className={`mt-2 ${errors[extraField] ? "border-red-500" : "border-blue-300"} bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                        disabled={isSubmitting}
                                    />
                                )}
                            </div>
                        ))}
                    </CardContent>

                    <CardFooter>
                        <Button
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
                    </CardFooter>
                </Card>
            </div>
        </section>
    )
}

