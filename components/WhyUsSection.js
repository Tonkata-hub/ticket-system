import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { MessageSquare, Star, CheckCircle, Shield, Clock, Headphones } from "lucide-react"

export default function WhyUsSection() {
    return (
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