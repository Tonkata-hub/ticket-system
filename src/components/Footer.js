"use client"

import Link from "next/link"

export default function Footer() {
    return (
        <footer className="py-6 w-full bg-white border-t border-gray-200">
            <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-gray-600">© 2025 TicketSystem. All rights reserved.</p>
                <nav className="flex gap-4 sm:gap-6 mt-4 md:mt-0">
                    <Link className="text-sm hover:underline underline-offset-4 text-gray-600 hover:text-blue-600" href="#">Terms of Service</Link>
                    <Link className="text-sm hover:underline underline-offset-4 text-gray-600 hover:text-blue-600" href="#">Privacy Policy</Link>
                    <Link className="text-sm hover:underline underline-offset-4 text-gray-600 hover:text-blue-600" href="#">FAQ</Link>
                </nav>
            </div>
        </footer>
    )
}