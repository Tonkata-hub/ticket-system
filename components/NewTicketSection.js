"use client"

import { useState } from "react"
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "@/lib/authContext";

export default function NewTicketSection() {
    const router = useRouter();

    const { isLoggedIn } = useAuth();
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
        <section className="w-full py-12 md:py-20 lg:py-26 flex justify-center bg-blue-50">
            <div className="container px-4 md:px-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-blue-900">Изпратете билет за поддръжка</h1>
                <p className="text-lg text-center mb-12 text-gray-600 max-w-2xl mx-auto">
                    Нуждаете се от помощ? Попълнете формуляра по-долу и нашият екип за поддръжка ще се свърже с вас възможно най-скоро.
                </p>

                {!isLoggedIn && (
                    <div className="text-center text-red-600 mb-8 font-bold">
                        Моля, влезте в профила си, за да изпратите билет!
                        <Button
                            onClick={() => router.push("/login")}
                            className="mt-4 mx-4 bg-red-500 hover:bg-red-600 text-white"
                        >
                            Вход
                        </Button>
                    </div>
                )}

                <Card className="max-w-3xl mx-auto border-blue-100 shadow-lg">
                    <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                    <CardHeader className="bg-blue-100 border-b border-blue-100">
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
                            <Select
                                disabled={!isLoggedIn}
                                onValueChange={(value) => { setIssueType(value); setErrors({ ...errors, issueType: false }) }}
                            >
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
                            <Select
                                disabled={!isLoggedIn}
                                onValueChange={(value) => { setCondition(value); setErrors({ ...errors, condition: false }) }}
                            >
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
                            <Select
                                disabled={!isLoggedIn}
                                onValueChange={(value) => { setPriority(value); setErrors({ ...errors, priority: false }) }}
                            >
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
                            <Select
                                disabled={!isLoggedIn}
                                onValueChange={(value) => { setEvent(value); setErrors({ ...errors, event: false }) }}
                            >
                                <SelectTrigger
                                    id="event"
                                    className={`w-full ${errors.event ? "border-red-500" : "border-blue-300"} bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                >
                                    <SelectValue placeholder="Опитвали ли сте някакви решения?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Да, опитах решение</SelectItem>
                                    <SelectItem value="no">Не, още не съм пробвал нищо</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button disabled={!isLoggedIn} onClick={handleSubmit} className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                            Submit Ticket
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </section>
    )
}