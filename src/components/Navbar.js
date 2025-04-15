"use client"

import { useState } from "react"
import Link from "next/link"
import { MessageSquare, User, LogOut, LogIn, Tag, Menu, X, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { logout } from "@/app/login/actions"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
    const { isLoggedIn, setIsLoggedIn, role } = useAuth()
    const isAdmin = role === "admin"
    const router = useRouter()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLogOut = async () => {
        const res = await logout()
        if (res.success) {
            setIsLoggedIn(false) // Update global state immediately
            router.push("/login")
            setMobileMenuOpen(false) // Close mobile menu if open
        }
    }

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen)
    }

    // Animation variants
    const menuVariants = {
        closed: {
            height: 0,
            opacity: 0,
            y: -10,
            transition: {
                duration: 0.3,
                ease: "easeInOut",
                when: "afterChildren",
            },
        },
        open: {
            height: "auto",
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut",
                when: "beforeChildren",
                staggerChildren: 0.05,
            },
        },
    }

    const itemVariants = {
        closed: { opacity: 0, x: -10 },
        open: { opacity: 1, x: 0 },
    }

    return (
        <header className="sticky top-0 z-10 w-full bg-white shadow-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link className="flex items-center justify-center" href="/">
                    <MessageSquare className="h-8 w-8 text-blue-600" />
                    <span className="ml-2 text-xl font-bold text-blue-600">TicketSystem</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center lg:flex">
                    {isLoggedIn && (
                        <>
                            <Link href="/tickets">
                                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 lg:mr-4">
                                    <Tag style={{ height: "1.5rem", width: "1.5rem" }} className="mr-2 h-5 w-5" />
                                    <span className="text-sm md:text-lg">Моите билети</span>
                                </Button>
                            </Link>

                            {/* Admin link - only visible to admins */}
                            {isAdmin && (
                                <Link href="/admin/categories">
                                    <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 lg:mr-4">
                                        <Settings style={{ height: "1.5rem", width: "1.5rem" }} className="mr-2 h-5 w-5" />
                                        <span className="text-sm md:text-lg">Управление</span>
                                    </Button>
                                </Link>
                            )}
                        </>
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

                {/* Mobile Navigation Toggle */}
                <div className="flex lg:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-600 hover:text-blue-600 active:text-blue-600 focus:text-blue-600"
                        onClick={toggleMobileMenu}
                    >
                        <motion.div initial={false} animate={{ rotate: mobileMenuOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
                            {mobileMenuOpen ? (
                                <X style={{ height: "1.2rem", width: "1.2rem" }} />
                            ) : (
                                <Menu style={{ height: "1.2rem", width: "1.2rem" }} />
                            )}
                        </motion.div>
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation Menu with Framer Motion */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="lg:hidden border-t border-gray-200 bg-white shadow-md overflow-hidden"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                    >
                        <div className="container mx-auto px-4 py-2">
                            <nav className="flex flex-col space-y-3 py-3">
                                <motion.div variants={itemVariants}>
                                    <Link
                                        href="/"
                                        className="flex items-center py-2 px-3 rounded-md hover:bg-blue-50"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <MessageSquare className="h-5 w-5 mr-3 text-blue-600" />
                                        <span className="text-base font-medium">Home</span>
                                    </Link>
                                </motion.div>

                                {isLoggedIn && (
                                    <>
                                        <motion.div variants={itemVariants}>
                                            <Link
                                                href="/tickets"
                                                className="flex items-center py-2 px-3 rounded-md hover:bg-blue-50"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <Tag className="h-5 w-5 mr-3 text-blue-600" />
                                                <span className="text-base font-medium">Моите билети</span>
                                            </Link>
                                        </motion.div>

                                        {/* Admin link in mobile menu - only visible to admins */}
                                        {isAdmin && (
                                            <motion.div variants={itemVariants}>
                                                <Link
                                                    href="/admin/categories"
                                                    className="flex items-center py-2 px-3 rounded-md hover:bg-purple-50"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    <Settings className="h-5 w-5 mr-3 text-purple-600" />
                                                    <span className="text-base font-medium">Управление</span>
                                                </Link>
                                            </motion.div>
                                        )}
                                    </>
                                )}

                                <motion.div variants={itemVariants} className="border-t my-2"></motion.div>

                                {isLoggedIn ? (
                                    <motion.div variants={itemVariants}>
                                        <button
                                            onClick={handleLogOut}
                                            className="flex items-center py-2 px-3 rounded-md text-red-600 hover:bg-red-50 w-full text-left"
                                        >
                                            <LogOut className="h-5 w-5 mr-3" />
                                            <span className="text-base font-medium">Log out</span>
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div variants={itemVariants}>
                                        <Link
                                            href="/login"
                                            className="flex items-center py-2 px-3 rounded-md text-green-600 hover:bg-green-50"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <LogIn className="h-5 w-5 mr-3" />
                                            <span className="text-base font-medium">Log in</span>
                                        </Link>
                                    </motion.div>
                                )}
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
