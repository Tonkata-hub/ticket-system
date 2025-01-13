"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "@/lib/AuthContext";

// const issueTypes = [
//     { value: "pc-components", label: "PC компютри, компоненти и мобилни у-ва" },
//     { value: "servers-vms", label: "Сървъри и вирт. машини, достъп до папки" },
//     { value: "printing", label: "Принтиране Копиране Сканиране" },
//     { value: "networks-vpn", label: "Мрежи и Мрежово оборудване, VPN" },
//     { value: "security-gdpr", label: "Сигурност и Сертифициране, GDPR" },
//     { value: "windows-db", label: "Windows, OS, Users, Share, база данни" },
//     { value: "accounting-software", label: "Приложения, Счетоводен софтуер" },
//     { value: "office-apps", label: "Офис приложения, ms365" },
//     { value: "digital-signatures", label: "Електронни подписи и сертификати" },
//     { value: "hosting", label: "Хостинг, сайт, имейли, акаунти" },
//     { value: "other", label: "Др." },
// ];

// const conditions = [
//     { value: "not-working", label: "Не работи, спря: устройство, услуга" },
//     { value: "review-hardware", label: "За преглед hardware, [или фабрични настройки]" },
//     { value: "review-software", label: "За преглед software, [или преинсталация]" },
//     { value: "slow-issues", label: "Работи бавно, забива, дава грешки" },
//     { value: "change-device", label: "Промяна на у-во, потребител, приложение" },
//     { value: "replace-supply", label: "За смяна на консуматив" },
//     { value: "project-discussion", label: "Проект (изисква обсъждане)" },
//     { value: "other", label: "Др." },
// ];

// const priorities = [
//     { value: "urgent", label: "Спешен" },
//     { value: "standard", label: "Стандартен" },
//     { value: "low-priority", label: "Нисък приоритет" },
// ];

// const events = [
//     { value: "it-support", label: "IT поддръжка" },
//     { value: "it-archive", label: "IT архив" },
//     { value: "pc-preparation", label: "PC подготовка за офис работа" },
//     { value: "equipment-management", label: "Взимане/даване ИТ оборудване / ремонт / консуматив" },
//     { value: "ticket-review", label: "Преглед и анализ на ticket" },
//     { value: "it-consultation", label: "IT консултация" },
// ];

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

    const [userData, setUserData] = useState(null);

    const [adminData, setAdminData] = useState({
        issueTypes: [],
        conditions: [],
        priorities: [],
        events: []
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/admin-data"); // Use the GET API to fetch data
                if (!res.ok) {
                    throw new Error("Failed to load data");
                }
                const jsonData = await res.json();
                setAdminData(jsonData);
            } catch (error) {
                toast.error("Failed to load data");
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, []);

    const { issueTypes, conditions, priorities, events } = adminData;

    useEffect(() => {
        const fetchUserData = async () => {
            if (isLoggedIn) {
                try {
                    const response = await fetch('/api/getUser');
                    if (response.ok) {
                        const data = await response.json();
                        setUserData(data);
                    } else {
                        console.error('Failed to fetch user data');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, [isLoggedIn]);

    const handleSubmit = async () => {
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
            return;
        }

        setErrors({});
        const toastId = toast.loading("Submitting your ticket...");

        try {
            const issueLabel =
                issueType === "other"
                    ? otherIssue
                    : issueTypes.find((type) => type.value === issueType)?.label || issueType;

            const conditionLabel =
                condition === "other"
                    ? otherCondition
                    : conditions.find((cond) => cond.value === condition)?.label || condition;

            const priorityLabel =
                priorities.find((prio) => prio.value === priority)?.label || priority;

            const eventLabel =
                events.find((ev) => ev.value === event)?.label || event;

            const requestData = {
                issueType: issueLabel,
                condition: conditionLabel,
                priority: priorityLabel,
                event: eventLabel,
                author: userData?.email || "Anonymous",
                authorId: userData?.id || 0,
            };

            const response = await fetch("/api/addTicket", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const data = await response.json();
                toast.update(toastId, {
                    render: "Ticket submitted successfully!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });
                console.log("New ticket added:", data);

                // Clear the form
                setIssueType("");
                setCondition("");
                setPriority("");
                setEvent("");
                setOtherIssue("");
                setOtherCondition("");
            } else {
                const error = await response.json();
                toast.update(toastId, {
                    render: error.error || "Failed to submit ticket.",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error("Error submitting ticket:", error);
            toast.update(toastId, {
                render: "An error occurred. Please try again.",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

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
                            <Button
                                onClick={() => router.push("/login")}
                                className="bg-blue-500 hover:bg-blue-600 text-white text-lg py-2 px-6"
                            >
                                Вход
                            </Button>
                            <Button
                                onClick={() => router.push("/signup")}
                                className="bg-green-500 hover:bg-green-600 text-white text-lg py-2 px-6"
                            >
                                Регистрация
                            </Button>
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
                                value={issueType}
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
                                    {issueTypes.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                    ))}
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
                                value={condition}
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
                                    {conditions.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                    ))}
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
                                value={priority}
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
                                    {priorities.map((item) => (
                                        <SelectItem
                                            key={item.value}
                                            value={item.value}
                                            className={`
                                                ${item.value === "urgent" ? "text-red-600 hover:bg-red-100 focus:bg-red-100" : ""}
                                                ${item.value === "standard" ? "text-yellow-600 hover:bg-yellow-100 focus:bg-yellow-100" : ""}
                                                ${item.value === "low-priority" ? "text-green-600 hover:bg-green-100 focus:bg-green-100" : ""}
                                            `}
                                        >
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="event" className="text-md font-medium text-gray-700">
                                Действие {errors.event && <span className="text-red-500 text-sm font-bold ml-1">Required</span>}
                            </label>
                            <Select
                                value={event}
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
                                    {events.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                    ))}
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
