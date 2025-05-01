"use client"

import { motion } from "framer-motion"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
}

const cardVariants = {
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
    hover: {
        y: -10,
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

export default function HowItWorksSection() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center bg-orange-50">
            <div className="container px-4 md:px-6">
                <motion.h2
                    className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-blue-900"
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    Как работи
                </motion.h2>
                <motion.div
                    className="grid gap-8 md:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <StepCard
                        number="1"
                        title="Подайте билет"
                        description="Попълнете формуляра за билет с подробности за вашия проблем или запитване."
                    />
                    <StepCard
                        number="2"
                        title="Получете потвърждение"
                        description="Получете незабавно потвърждение с номера на вашия билет за справка."
                    />
                    <StepCard
                        number="3"
                        title="Очаквайте съдействие"
                        description="Нашият екип преглежда вашия билет и осигурява навременна помощ за разрешаване на проблема."
                    />
                </motion.div>
            </div>
        </section>
    )
}

function StepCard({ number, title, description }) {
    return (
        <motion.div variants={cardVariants} whileHover="hover">
            <Card className="flex flex-col items-center text-center p-6 bg-white border-orange-200 shadow-md transition-shadow">
                <motion.div
                    className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <span className="text-2xl font-bold text-orange-600">{number}</span>
                </motion.div>
                <CardTitle className="text-xl font-semibold text-blue-900 mb-2">{title}</CardTitle>
                <CardDescription className="text-gray-600">{description}</CardDescription>
            </Card>
        </motion.div>
    )
}
