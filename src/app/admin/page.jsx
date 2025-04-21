"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { LayoutDashboard, FileText, Users, ShoppingBag, Settings, BarChart3, Shield, LogOut } from "lucide-react"

export default function AdminDashboard() {
    const { user, isAuthenticated, loading, isAdmin } = useAuth()
    const router = useRouter()
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
        // {
        //     title: "Dashboard",
        //     href: "/admin",
        //     icon: <LayoutDashboard className="h-5 w-5" />,
        //     description: "Overview and key metrics",
        //     color: "bg-emerald-100 text-emerald-700",
        // },
        {
            title: "Contributions",
            href: "/admin/contributions",
            icon: <FileText className="h-5 w-5" />,
            description: "Review and manage user contributions",
            color: "bg-blue-100 text-blue-700",
        },
        {
            title: "Users",
            href: "/admin/users",
            icon: <Users className="h-5 w-5" />,
            description: "Manage user accounts and permissions",
            color: "bg-purple-100 text-purple-700",
        },
        // {
        //     title: "Products",
        //     href: "/admin/products",
        //     icon: <ShoppingBag className="h-5 w-5" />,
        //     description: "Manage product catalog and information",
        //     color: "bg-amber-100 text-amber-700",
        // },
        {
            title: "Analytics",
            href: "/admin/analytics",
            icon: <BarChart3 className="h-5 w-5" />,
            description: "View platform statistics and reports",
            color: "bg-indigo-100 text-indigo-700",
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

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                        <p className="text-gray-600">Manage and monitor your platform</p>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full">
                        <Shield className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-700">Admin Access</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {adminLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:translate-y-[-2px] group"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${link.color} group-hover:scale-110 transition-transform`}>
                                {link.icon}
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors">
                                    {link.title}
                                </h2>
                                <p className="text-gray-500 text-sm">{link.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-8 bg-white shadow-sm rounded-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                            {user?.username?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">{user?.username || "Admin User"}</p>
                            <p className="text-sm text-gray-500">{user?.email || "admin@example.com"}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem("token")
                            router.push("/login")
                            toast.success("Logged out successfully")
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
