"use client"

import Link from "next/link"
import { MessageSquare, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Header() {
    return (
        <header className="px-4 lg:px-6 h-16 flex items-center justify-between w-full bg-white shadow-sm sticky top-0 z-10">
            <Link className="flex items-center justify-center" href="/">
                <MessageSquare className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-blue-600">TicketSystem</span>
            </Link>
            <nav className="flex items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 w-12 h-12">
                            <User className="h-8 w-8" />
                            <span className="sr-only">Account menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 z-[100]">
                        <DropdownMenuItem className="py-3 text-base cursor-pointer">
                            <User className="mr-3 h-5 w-5" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="py-3 text-base text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                            <LogOut className="mr-3 h-5 w-5" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>
        </header>
    )
}