import NewTicketSection from "@/components/NewTicketSection"
import WhyUsSection from "@/components/WhyUsSection"
import HowItWorksSection from "@/components/HowItWorksSection"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
            <main className="flex-1 w-full">
                <NewTicketSection />
                <WhyUsSection />
                <HowItWorksSection />
            </main>
        </div>
    )
}