import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, User } from "lucide-react"
import "react-toastify/dist/ReactToastify.css"

export default function Header() {
    return (
        <header className="px-4 lg:px-6 h-16 flex items-center justify-between w-full bg-white shadow-sm sticky top-0 z-10">
            <Link className="flex items-center justify-center" href="#">
                <MessageSquare className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-blue-600">TicketSystem</span>
            </Link>
            <nav className="flex gap-4 sm:gap-6 items-center">
                <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#">Features</Link>
                <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#">Pricing</Link>
                <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#">About</Link>
                <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                </Button>
            </nav>
        </header>
    )
}
