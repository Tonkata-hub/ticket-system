import NewTicketSection from "./NewTicketSection";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
            <main className="flex-1 w-full">
                <NewTicketSection />
            </main>
        </div>
    );
}
