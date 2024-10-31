import Header from "@/components/Header"
import NewTicketSection from "@/components/NewTicketSection"
import WhyUsSection from "@/components/WhyUsSection"
import HowItWorksSection from "@/components/HowItWorksSection"
import Footer from "@/components/Footer"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
            <Header />

            <main className="flex-1 w-full">
                <NewTicketSection />
                <WhyUsSection />
                <HowItWorksSection />
            </main>

            <Footer />
        </div>
    )
}