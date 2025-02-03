"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Link from "next/link"

export default function NewTicketSection() {
    const isLoggedIn = true;

    const [issueType, setIssueType] = useState("");
    const [condition, setCondition] = useState("");
    const [priority, setPriority] = useState("");
    const [event, setEvent] = useState("");
    const [otherIssue, setOtherIssue] = useState("");
    const [otherCondition, setOtherCondition] = useState("");

    const [errors, setErrors] = useState({});

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
            setErrors(newErrors);
            toast.error("Please complete all required fields.");
        } else {
            setErrors({})
            toast.success("Ticket submitted successfully!");
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
                    <div className="text-center mb-8">
                        <p className="text-xl font-bold text-red-600 mb-4">
                            Моля, влезте в профила си или се регистрирайте, за да изпратите билет!
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/login">
                                <Button className="bg-blue-500 hover:bg-blue-600 text-white text-lg py-2 px-6">
                                    Вход
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button className="bg-green-500 hover:bg-green-600 text-white text-lg py-2 px-6">
                                    Регистрация
                                </Button>
                            </Link>
                        </div>
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
                                    <SelectValue placeholder="Изберете запитване" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pc-components">PC компютри, компоненти и мобилни у-ва</SelectItem>
                                    <SelectItem value="servers-vms">Сървъри и вирт. машини, достъп до папки</SelectItem>
                                    <SelectItem value="printing">Принтиране Копиране Сканиране</SelectItem>
                                    <SelectItem value="networks-vpn">Мрежи и Мрежово оборудване, VPN</SelectItem>
                                    <SelectItem value="security-gdpr">Сигурност и Сертифициране, GDPR</SelectItem>
                                    <SelectItem value="windows-db">Windows, OS, Users, Share, база данни</SelectItem>
                                    <SelectItem value="accounting-software">Приложения, Счетоводен софтуер</SelectItem>
                                    <SelectItem value="office-apps">Офис приложения, ms365</SelectItem>
                                    <SelectItem value="digital-signatures">Електронни подписи и сертификати</SelectItem>
                                    <SelectItem value="hosting">Хостинг, сайт, имейли, акаунти</SelectItem>
                                    <SelectItem value="other">Др.</SelectItem>
                                </SelectContent>
                            </Select>
                            {issueType === "other" && (
                                <Input
                                    id="other-issue"
                                    placeholder="Please specify your issue"
                                    value={otherIssue}
                                    onChange={(e) => { setOtherIssue(e.target.value); setErrors({ ...errors, otherIssue: false }) }}
                                    disabled={!isLoggedIn}
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
                                    <SelectItem value="not-working">Не работи, спря: устройство, услуга</SelectItem>
                                    <SelectItem value="review-hardware">За преглед hardware, [или фабрични настройки]</SelectItem>
                                    <SelectItem value="review-software">За преглед software, [или преинсталация]</SelectItem>
                                    <SelectItem value="slow-issues">Работи бавно, забива, дава грешки</SelectItem>
                                    <SelectItem value="change-device">Промяна на у-во, потребител, приложение</SelectItem>
                                    <SelectItem value="replace-supply">За смяна на консуматив</SelectItem>
                                    <SelectItem value="project-discussion">Проект (изисква обсъждане)</SelectItem>
                                    <SelectItem value="other">Др.</SelectItem>
                                </SelectContent>
                            </Select>
                            {condition === "other" && (
                                <Input
                                    id="other-condition"
                                    placeholder="Please describe the condition"
                                    value={otherCondition}
                                    onChange={(e) => { setOtherCondition(e.target.value); setErrors({ ...errors, otherCondition: false }) }}
                                    disabled={!isLoggedIn}
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
                                    <SelectItem
                                        value="urgent"
                                        className="text-red-600 hover:bg-red-100 focus:bg-red-100"
                                    >
                                        Спешен
                                    </SelectItem>
                                    <SelectItem
                                        value="standard"
                                        className="text-yellow-600 hover:bg-yellow-100 focus:bg-yellow-100"
                                    >
                                        Стандартен
                                    </SelectItem>
                                    <SelectItem
                                        value="low-priority"
                                        className="text-green-600 hover:bg-green-100 focus:bg-green-100"
                                    >
                                        Нисък приоритет
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="event" className="text-md font-medium text-gray-700">
                                Действие {errors.event && <span className="text-red-500 text-sm font-bold ml-1">Required</span>}
                            </label>
                            <Select
                                disabled={!isLoggedIn}
                                onValueChange={(value) => { setEvent(value); setErrors({ ...errors, event: false }) }}
                            >
                                <SelectTrigger
                                    id="event"
                                    className={`w-full ${errors.event ? "border-red-500" : "border-blue-300"} bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                >
                                    <SelectValue placeholder="Изберете действие" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="it-support">IT поддръжка</SelectItem>
                                    <SelectItem value="it-archive">IT архив</SelectItem>
                                    <SelectItem value="pc-preparation">PC подготовка за офис работа</SelectItem>
                                    <SelectItem value="equipment-management">Взимане/даване ИТ оборудване / ремонт / консуматив</SelectItem>
                                    <SelectItem value="ticket-review">Преглед и анализ на ticket</SelectItem>
                                    <SelectItem value="it-consultation">IT консултация</SelectItem>
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