"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToastContainer, toast } from "react-toastify"
import { MessageSquare, User, Star, CheckCircle, Shield, Clock, Headphones, ChevronRight } from "lucide-react"
import "react-toastify/dist/ReactToastify.css"

export default function HomePage() {
    const [issueType, setIssueType] = useState("")
    const [condition, setCondition] = useState("")
    const [priority, setPriority] = useState("")
    const [event, setEvent] = useState("")
    const [otherIssue, setOtherIssue] = useState("")
    const [otherCondition, setOtherCondition] = useState("")

    const [errors, setErrors] = useState({})

    const handleSubmit = () => {
        const newErrors = {
            issueType: !issueType,
            condition: !condition,
            priority: !priority,
            event: !event,
            otherIssue: issueType === "other" && !otherIssue,
            otherCondition: condition === "other" && !otherCondition,
        }

        if (Object.values(newErrors).some(Boolean)) {
            setErrors(newErrors)
            toast.error("Please complete all required fields.")
        } else {
            setErrors({})
            toast.success("Ticket submitted successfully!")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
            <header className="px-4 lg:px-6 h-16 flex items-center justify-between w-full bg-white shadow-sm sticky top-0 z-10">
                <Link className="flex items-center justify-center" href="#">
                    <MessageSquare className="h-8 w-8 text-blue-600" />
                    <span className="ml-2 text-xl font-bold text-blue-600">TicketSystem</span>
                </Link>
                <nav className="flex gap-4 sm:gap-6 items-center">
                    <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#">Features</Link>
                    <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#">Pricing</Link>
                    <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#">About</Link>
                    <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <User className="h-5 w-5" />
                        <span className="sr-only">Account</span>
                    </Button>
                </nav>
            </header>
            <main className="flex-1 w-full">
                <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center bg-blue-50">
                    <div className="container px-4 md:px-6">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-blue-900">Изпратете билет за поддръжка</h1>
                        <p className="text-lg text-center mb-12 text-gray-600 max-w-2xl mx-auto">
                            Нуждаете се от помощ? Попълнете формуляра по-долу и нашият екип за поддръжка ще се свърже с вас възможно най-скоро.
                        </p>
                        <Card className="max-w-3xl mx-auto border-blue-100 shadow-lg">
                            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                            <CardHeader className="bg-blue-50 border-b border-blue-100">
                                <CardTitle className="text-2xl text-center text-blue-800">Нов билет за поддръжка</CardTitle>
                                <CardDescription className="text-center text-blue-600">
                                    Моля, предоставете подробности за вашия проблем
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="space-y-2">
                                    <label htmlFor="issue-type" className="text-md font-medium text-gray-700">
                                        Избор на запитване {errors.issueType && <span className="text-red-500 text-sm font-bold ml-1">Required</span>}
                                    </label>
                                    <Select onValueChange={(value) => { setIssueType(value); setErrors({ ...errors, issueType: false }) }}>
                                        <SelectTrigger
                                            id="issue-type"
                                            className={`w-full ${errors.issueType ? "border-red-500" : "border-blue-300"} bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                        >
                                            <SelectValue placeholder="Избери запитване" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pc">PC, компоненти и мобилни у-ва</SelectItem>
                                            <SelectItem value="win-os">Win, OS, Users</SelectItem>
                                            <SelectItem value="share">Share</SelectItem>
                                            <SelectItem value="db">ДБ Принтер Копир Сканер</SelectItem>
                                            <SelectItem value="apps">Приложения</SelectItem>
                                            <SelectItem value="accounting-software">Счетоводен софтуер</SelectItem>
                                            <SelectItem value="digital-signatures">Електронни подписи и сертификати</SelectItem>
                                            <SelectItem value="office-apps">Офис приложения, ms365</SelectItem>
                                            <SelectItem value="other">Други</SelectItem>
                                            <SelectItem value="servers">Сървъри и вирт. машини, достъп</SelectItem>
                                            <SelectItem value="networks">Мрежи, оборудване, VPN</SelectItem>
                                            <SelectItem value="security-gdpr">Сигурност и Сертификати, GDPR</SelectItem>
                                            <SelectItem value="hosting">Хостинг, сайт, имейли, акаунти</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {issueType === "other" && (
                                        <Input
                                            id="other-issue"
                                            placeholder="Please specify your issue"
                                            value={otherIssue}
                                            onChange={(e) => { setOtherIssue(e.target.value); setErrors({ ...errors, otherIssue: false }) }}
                                            className={`mt-2 ${errors.otherIssue ? "border-red-500" : "border-blue-300"} bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                        />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="condition" className="text-md font-medium text-gray-700">
                                        Състояние {errors.condition && <span className="text-red-500 text-sm font-bold ml-1">Required</span>}
                                    </label>
                                    <Select onValueChange={(value) => { setCondition(value); setErrors({ ...errors, condition: false }) }}>
                                        <SelectTrigger
                                            id="condition"
                                            className={`w-full ${errors.condition ? "border-red-500" : "border-blue-300"} bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                        >
                                            <SelectValue placeholder="Опишете текущото състояние" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="not-working">Не работи, спря: у-во, услуга</SelectItem>
                                            <SelectItem value="review-hardware">За преглед hardware</SelectItem>
                                            <SelectItem value="review-software">За преглед software</SelectItem>
                                            <SelectItem value="slow-issues">Работи бавно, забива, дава грешки</SelectItem>
                                            <SelectItem value="change-device">Промяна на pc, user, у-во, app</SelectItem>
                                            <SelectItem value="replace-supply">За смяна на консуматив</SelectItem>
                                            <SelectItem value="project-discussion">Проект (изисква обсъждане)</SelectItem>
                                            <SelectItem value="other">Други</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {condition === "other" && (
                                        <Input
                                            id="other-condition"
                                            placeholder="Please describe the condition"
                                            value={otherCondition}
                                            onChange={(e) => { setOtherCondition(e.target.value); setErrors({ ...errors, otherCondition: false }) }}
                                            className={`mt-2 ${errors.otherCondition ? "border-red-500" : "border-blue-300"} bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                        />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="priority" className="text-md font-medium text-gray-700">
                                        Приоритет {errors.priority && <span className="text-red-500 text-sm font-bold ml-1">Required</span>}
                                    </label>
                                    <Select onValueChange={(value) => { setPriority(value); setErrors({ ...errors, priority: false }) }}>
                                        <SelectTrigger
                                            id="priority"
                                            className={`w-full ${errors.priority ? "border-red-500" : "border-blue-300"} bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                        >
                                            <SelectValue placeholder="Изберете приоритет" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="urgent">Спешен</SelectItem>
                                            <SelectItem value="priority">Приоритетен</SelectItem>
                                            <SelectItem value="standard">Стандартен</SelectItem>
                                            <SelectItem value="low-priority">Нисък приоритет</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="event" className="text-md font-medium text-gray-700">
                                        Събитие {errors.event && <span className="text-red-500 text-sm font-bold ml-1">Required</span>}
                                    </label>
                                    <Select onValueChange={(value) => { setEvent(value); setErrors({ ...errors, event: false }) }}>
                                        <SelectTrigger
                                            id="event"
                                            className={`w-full ${errors.event ? "border-red-500" : "border-blue-300"} bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                        >
                                            <SelectValue placeholder="Have you tried any solutions?" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="yes">Yes, I've attempted a solution</SelectItem>
                                            <SelectItem value="no">No, I haven't tried anything yet</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSubmit} className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                                    Submit Ticket
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </section>

                <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-blue-900">Why Choose Our Ticket System?</h2>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <FeatureCard
                                icon={MessageSquare}
                                title="Easy Ticket Submission"
                                description="Create and submit support tickets quickly and easily with our user-friendly interface."
                            />
                            <FeatureCard
                                icon={Clock}
                                title="Fast Response Times"
                                description="Our dedicated support team ensures quick response times to all submitted tickets."
                            />
                            <FeatureCard
                                icon={Shield}
                                title="Secure & Confidential"
                                description="Your data is protected with state-of-the-art security measures and encryption."
                            />
                            <FeatureCard
                                icon={Star}
                                title="Priority Handling"
                                description="Tickets are handled based on priority levels, ensuring critical issues are addressed first."
                            />
                            <FeatureCard
                                icon={Headphones}
                                title="24/7 Support"
                                description="Our support team is available round the clock to assist you with any issues."
                            />
                            <FeatureCard
                                icon={CheckCircle}
                                title="Issue Tracking"
                                description="Track the status of your tickets in real-time with our comprehensive tracking system."
                            />
                        </div>
                    </div>
                </section>

                <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center bg-orange-50">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-blue-900">How It Works</h2>
                        <div className="grid gap-8 md:grid-cols-3">
                            <StepCard
                                number="1"
                                title="Submit a Ticket"
                                description="Fill out the ticket form with details about your issue or request."
                            />
                            <StepCard
                                number="2"
                                title="Receive Confirmation"
                                description="Get an immediate confirmation with your ticket number for reference."
                            />
                            <StepCard
                                number="3"
                                title="Get Support"
                                description="Our team reviews your ticket and provides timely assistance to resolve your issue."
                            />
                        </div>
                    </div>
                </section>
            </main>
            <footer className="py-6 w-full bg-white border-t border-gray-200">
                <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between  items-center">
                    <p className="text-sm text-gray-600">© 2024 TicketSystem. All rights reserved.</p>
                    <nav className="flex gap-4 sm:gap-6 mt-4 md:mt-0">
                        <Link className="text-sm hover:underline underline-offset-4 text-gray-600 hover:text-blue-600" href="#">Terms of Service</Link>
                        <Link className="text-sm hover:underline underline-offset-4 text-gray-600 hover:text-blue-600" href="#">Privacy Policy</Link>
                        <Link className="text-sm hover:underline underline-offset-4 text-gray-600 hover:text-blue-600" href="#">FAQ</Link>
                    </nav>
                </div>
            </footer>
        </div>
    )
}

function FeatureCard({ icon: Icon, title, description }) {
    return (
        <Card className="flex flex-col items-center text-center p-6 bg-white border-blue-100 shadow-md hover:shadow-lg transition-shadow">
            <Icon className="h-12 w-12 text-orange-500 mb-4" />
            <CardTitle className="text-xl font-semibold text-blue-900 mb-2">{title}</CardTitle>
            <CardDescription className="text-gray-600">{description}</CardDescription>
        </Card>
    )
}

function StepCard({ number, title, description }) {
    return (
        <Card className="flex flex-col items-center text-center p-6 bg-white border-orange-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-orange-600">{number}</span>
            </div>
            <CardTitle className="text-xl font-semibold text-blue-900 mb-2">{title}</CardTitle>
            <CardDescription className="text-gray-600">{description}</CardDescription>
        </Card>
    )
}