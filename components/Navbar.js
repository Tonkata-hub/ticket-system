"use client"

import Link from "next/link"
import { MessageSquare, User, LogOut, LogIn, Tag, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/authContext"

export default function Navbar() {
    const { logout, isLoggedIn } = useAuth();

    const handleLogOut = () => {
        logout();
    }

    const NavItems = () => (
        <>
            {isLoggedIn && (
                <Link href="/tickets">
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 w-full justify-start lg:w-auto lg:mr-4">
                        <Tag style={{ height: "1.5rem", width: "1.5rem" }} className="mr-2 h-5 w-5" />
                        <span className="text-sm md:text-lg">Моите билети</span>
                    </Button>
                </Link>
            )}
        </>
    )

    return (
        <header className="px-4 lg:px-6 h-16 flex items-center justify-between w-full bg-white shadow-sm sticky top-0 z-10">
            <Link className="flex items-center justify-center" href="/">
                <MessageSquare className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-blue-600">TicketSystem</span>
            </Link>
            <nav className="hidden lg:flex items-center">
                <NavItems />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 w-12 h-12">
                            <User style={{ height: "1.5rem", width: "1.5rem" }} />
                            <span className="sr-only">Account menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 z-[100]">
                        {isLoggedIn ? (
                            <>
                                <DropdownMenuItem className="py-3 text-base cursor-pointer">
                                    <User className="mr-3 h-5 w-5" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogOut} className="py-3 text-base text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                    <LogOut className="mr-3 h-5 w-5" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </>
                        ) : (
                            <Link href="/login">
                                <DropdownMenuItem className="py-3 text-base text-green-600 focus:text-green-600 focus:bg-green-50 cursor-pointer">
                                    <LogIn className="mr-3 h-5 w-5" />
                                    <span>Log in</span>
                                </DropdownMenuItem>
                            </Link>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <nav className="flex flex-col space-y-4 mt-4">
                        <NavItems />
                        {isLoggedIn ? (
                            <>
                                <Button variant="ghost" className="justify-start text-base">
                                    <User className="mr-3 h-5 w-5" />
                                    <span>Profile</span>
                                </Button>
                                <Button variant="ghost" onClick={handleLogOut} className="justify-start text-base text-red-600 hover:text-red-700 hover:bg-red-50">
                                    <LogOut className="mr-3 h-5 w-5" />
                                    <span>Log out</span>
                                </Button>
                            </>
                        ) : (
                            <Link href="/login">
                                <Button variant="ghost" className="justify-start text-base text-green-600 hover:text-green-700 hover:bg-green-50">
                                    <LogIn className="mr-3 h-5 w-5" />
                                    <span>Log in</span>
                                </Button>
                            </Link>
                        )}
                    </nav>
                </SheetContent>
            </Sheet>
        </header>
    )
}