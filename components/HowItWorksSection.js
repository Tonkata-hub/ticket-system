import { Card, CardDescription, CardTitle } from "@/components/ui/card"

export default function HowItWorksSection() {
    return (
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