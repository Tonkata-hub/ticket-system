import HowItWorksSection from "./HowItWorksSection";
import NewTicketSection from "./NewTicketSection";
import WhyUsSection from "./WhyUsSection";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
            <main className="flex-1 w-full">
                <NewTicketSection />
                <WhyUsSection />
                <HowItWorksSection />
            </main>
        </div>
    );
}
