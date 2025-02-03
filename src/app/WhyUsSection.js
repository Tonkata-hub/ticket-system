import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { MessageSquare, Star, CheckCircle, Shield, Clock, Headphones } from "lucide-react"

export default function WhyUsSection() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center">
            <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-blue-900">Защо да изберете нашата система за билети?</h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                </div>
            </div>
        </section>
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
