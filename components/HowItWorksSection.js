import { Card, CardDescription, CardTitle } from "@/components/ui/card"

export default function HowItWorksSection() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center bg-orange-50">
            <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-blue-900">Как работи</h2>
                <div className="grid gap-8 md:grid-cols-3">
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
                </div>
            </div>
        </section>
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
