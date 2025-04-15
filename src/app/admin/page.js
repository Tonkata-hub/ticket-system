"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
    const router = useRouter()

    useEffect(() => {
        // Redirect to categories management page
        router.push("/admin/categories")
    }, [router])

    return (
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
            <p>Redirecting to admin dashboard...</p>
        </div>
    )
}
