"use client"

import Link from "next/link";
import { MessageSquare, User, LogOut, LogIn, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { logout } from "@/app/login/actions";

export default function Navbar() {
    const isLoggedIn = true;

    const handleLogOut = () => {
        logout();
    }

    return (
        <header className="sticky top-0 z-10 w-full bg-white shadow-sm">
            {/* Desktop Navigation */}
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link className="flex items-center justify-center" href="/">
                    <MessageSquare className="h-8 w-8 text-blue-600" />
                    <span className="ml-2 text-xl font-bold text-blue-600">TicketSystem</span>
                </Link>
                <nav className="hidden items-center lg:flex">
                    {isLoggedIn && (
                        <Link href="/tickets">
                            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 lg:mr-4">
                                <Tag style={{ height: "1.5rem", width: "1.5rem" }} className="mr-2 h-5 w-5" />
                                <span className="text-sm md:text-lg">Моите билети</span>
                            </Button>
                        </Link>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                                <User style={{ height: "1.5rem", width: "1.5rem" }} className="h-5 w-5" />
                                <span className="sr-only">Account menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {isLoggedIn ? (
                                <DropdownMenuItem
                                    onClick={handleLogOut}
                                    className="py-3 text-base text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                >
                                    <LogOut style={{ height: "1.2rem", width: "1.2rem" }} className="mr-3 h-5 w-5" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            ) : (
                                <Link href="/login">
                                    <DropdownMenuItem className="py-3 text-base text-green-600 focus:text-green-600 focus:bg-green-50 cursor-pointer">
                                        <LogIn style={{ height: "1.2rem", width: "1.2rem" }} className="mr-3 h-5 w-5" />
                                        <span>Log in</span>
                                    </DropdownMenuItem>
                                </Link>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </nav>

                {/* /* Mobile Navigation */}
            </div>
        </header>
    )
}

