"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function NewTicketSection() {
    const isLoggedIn = true;

    const [issueType, setIssueType] = useState("");
    const [condition, setCondition] = useState("");
    const [priority, setPriority] = useState("");
    const [event, setEvent] = useState("");
    const [otherIssue, setOtherIssue] = useState("");
    const [otherCondition, setOtherCondition] = useState("");

    const [errors, setErrors] = useState({});

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
        { value: "other", text: "Др." }
    ];

    const conditions = [
        { value: "not-working", text: "Не работи, спря: устройство, услуга" },
        { value: "review-hardware", text: "За преглед hardware, [или фабрични настройки]" },
        { value: "review-software", text: "За преглед software, [или преинсталация]" },
        { value: "slow-issues", text: "Работи бавно, забива, дава грешки" },
        { value: "change-device", text: "Промяна на у-во, потребител, приложение" },
        { value: "replace-supply", text: "За смяна на консуматив" },
        { value: "project-discussion", text: "Проект (изисква обсъждане)" },
        { value: "other", text: "Др." }
    ];

    const priorities = [
        { value: "urgent", text: "Спешен" },
        { value: "standard", text: "Стандартен" },
        { value: "low-priority", text: "Нисък приоритет" }
    ];

    const events = [
        { value: "it-support", text: "IT поддръжка" },
        { value: "it-archive", text: "IT архив" },
        { value: "pc-preparation", text: "PC подготовка за офис работа" },
        { value: "equipment-management", text: "Взимане/даване ИТ оборудване / ремонт / консуматив" },
        { value: "ticket-review", text: "Преглед и анализ на ticket" },
        { value: "it-consultation", text: "IT консултация" }
    ];

    const handleSubmit = () => {
        const newErrors = {
            issueType: !issueType,
            condition: !condition,
            priority: !priority,
            event: !event,
            otherIssue: issueType === "other" && !otherIssue,
            otherCondition: condition === "other" && !otherCondition,
        };

        if (Object.values(newErrors).some(Boolean)) {
            setErrors(newErrors);
            toast.error("Please complete all required fields.");
        } else {
            setErrors({});
            toast.success("Ticket submitted successfully!");
        }
    };

    return (
        <section className="w-full py-12 md:py-20 lg:py-26 flex justify-center bg-blue-50">
            <div className="container px-4 md:px-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-blue-900">
                    Изпратете билет за поддръжка
                </h1>
                <p className="text-lg text-center mb-12 text-gray-600 max-w-2xl mx-auto">
                    Нуждаете се от помощ? Попълнете формуляра по-долу и нашият екип за поддръжка ще се свърже с вас възможно най-скоро.
                </p>

                <Card className="max-w-3xl mx-auto border-blue-100 shadow-lg">
                    <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                    <CardHeader className="bg-blue-100 border-b border-blue-100">
                        <CardTitle className="text-2xl text-center text-blue-800">Нов билет за поддръжка</CardTitle>
                        <CardDescription className="text-center text-blue-600">Моля, предоставете подробности за вашия проблем</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        {[{ label: "Избор на запитване", options: issueTypes, state: issueType, setState: setIssueType, extraInput: otherIssue, setExtraInput: setOtherIssue, error: errors.issueType, extraError: errors.otherIssue },
                        { label: "Състояние", options: conditions, state: condition, setState: setCondition, extraInput: otherCondition, setExtraInput: setOtherCondition, error: errors.condition, extraError: errors.otherCondition },
                        { label: "Приоритет", options: priorities, state: priority, setState: setPriority, error: errors.priority },
                        { label: "Действие", options: events, state: event, setState: setEvent, error: errors.event }]
                            .map(({ label, options, state, setState, extraInput, setExtraInput, error, extraError }, index) => (
                                <div key={index} className="space-y-2">
                                    <label className="text-md font-medium text-gray-700">{label} {error && <span className="text-red-500 text-sm font-bold ml-1">Required</span>}</label>
                                    <Select disabled={!isLoggedIn} onValueChange={(value) => { setState(value); setErrors({ ...errors, [label]: false }); if (value === "other") setExtraInput(""); }}>
                                        <SelectTrigger className={`w-full ${error ? "border-red-500" : "border-blue-300"} bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}>
                                            <SelectValue placeholder={`Изберете ${label.toLowerCase()}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {options.map(option => <SelectItem key={option.value} value={option.value}>{option.text}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {state === "other" && <Input value={extraInput} onChange={(e) => setExtraInput(e.target.value)} placeholder={`Моля, уточнете ${label.toLowerCase()}`} className={`mt-2 ${extraError ? "border-red-500" : "border-blue-300"} bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`} />}
                                </div>
                            ))}
                    </CardContent>
                    <CardFooter>
                        <Button disabled={!isLoggedIn} onClick={handleSubmit} className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                            Submit Ticket
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </section>
    );
}
