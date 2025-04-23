"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { FileText, Users, ShoppingBag, ChevronRight } from "lucide-react"

export default function AdminLayout({ children }) {
    const { isAuthenticated, loading, isAdmin } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [isAdminVerified, setIsAdminVerified] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Redirect if not authenticated
    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                toast.error("You must be logged in to access this page")
                router.push("/login")
                return
            }

            // Check if user is admin
            if (isAdmin()) {
                setIsAdminVerified(true)
            } else {
                toast.error("You don't have admin privileges")
                router.push("/")
            }

            setIsLoading(false)
        }
    }, [isAuthenticated, loading, router, isAdmin])

    // Admin navigation links
    const adminLinks = [
        {
            title: "Contributions",
            href: "/admin/contributions",
            icon: <FileText className="h-5 w-5" />,
        },
        {
            title: "Users",
            href: "/admin/users",
            icon: <Users className="h-5 w-5" />,
        },
        {
            title: "Products",
            href: "/admin/products",
            icon: <ShoppingBag className="h-5 w-5" />,
        },
    ]

    if (loading || isLoading) {
        return (
            <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        )
    }

    if (!isAdminVerified) {
        return null // This will prevent flash of content before redirect
    }

    // Get current page title
    const currentPage = adminLinks.find((link) => pathname === link.href)?.title || "Admin"

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-3 flex items-center text-sm">
                    <Link href="/" className="text-gray-500 hover:text-gray-700">
                        Home
                    </Link>
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                    <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                        Admin
                    </Link>
                    {pathname !== "/admin" && (
                        <>
                            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                            <span className="text-gray-900 font-medium">{currentPage}</span>
                        </>
                    )}
                </div>
            </div>

            <div className="container mx-auto p-4">{children}</div>
        </div>
    )
}
