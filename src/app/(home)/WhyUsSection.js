"use client"

import { motion } from "framer-motion"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { MessageSquare, Star, CheckCircle, Shield, Clock, Headphones } from "lucide-react"

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
}

const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
        },
    },
    hover: {
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10,
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
            delay: 0.1,
        },
    },
}

const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
        scale: 1,
        rotate: 0,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20,
        },
    },
    hover: {
        rotate: 15,
        scale: 1.1,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10,
        },
    },
}

export default function WhyUsSection() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center">
            <div className="container px-4 md:px-6">
                <motion.h2
                    className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-blue-900"
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    Защо да изберете нашата система за билети?
                </motion.h2>
                <motion.div
                    className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    <FeatureCard
                        icon={MessageSquare}
                        title="Лесно подаване на билети"
                        description="Създавайте и подавайте билети за поддръжка бързо и лесно с нашия потребителски интерфейс."
                    />
                    <FeatureCard
                        icon={Clock}
                        title="Бързо време за отговор"
                        description="Нашият екип за поддръжка осигурява бързи отговори на всички подадени билети."
                    />
                    <FeatureCard
                        icon={Shield}
                        title="Сигурност и конфиденциалност"
                        description="Вашите данни са защитени с най-модерни мерки за сигурност и криптиране."
                    />
                    <FeatureCard
                        icon={Star}
                        title="Приоритетна обработка"
                        description="Билетите се обработват по приоритетни нива, осигурявайки бързо решение на критични проблеми."
                    />
                    <FeatureCard
                        icon={Headphones}
                        title="Персонализирани решения"
                        description="Индивидуален подход към всеки клиент, за да гарантираме оптимални резултати и удовлетворение."
                    />
                    <FeatureCard
                        icon={CheckCircle}
                        title="Проследяване на проблемите"
                        description="Проследявайте статуса на вашите билети в реално време с нашата система за проследяване."
                    />
                </motion.div>
            </div>
        </section>
    )
}

function FeatureCard({ icon: Icon, title, description }) {
    return (
        <motion.div variants={cardVariants} whileHover="hover">
            <Card className="flex flex-col items-center text-center p-6 bg-white border-blue-100 shadow-md transition-shadow">
                <motion.div variants={iconVariants} whileHover="hover">
                    <Icon className="h-12 w-12 text-orange-500 mb-4" />
                </motion.div>
                <CardTitle className="text-xl font-semibold text-blue-900 mb-2">{title}</CardTitle>
                <CardDescription className="text-gray-600">{description}</CardDescription>
            </Card>
        </motion.div>
    )
}
