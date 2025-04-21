"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { Trash, Shield, ShieldOff, RefreshCw, Search } from "lucide-react"

export default function AdminUsersPage() {
    const { user, isAuthenticated, loading, isAdmin } = useAuth()
    const router = useRouter()
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Redirect if not authenticated
    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                toast.error("You must be logged in to access this page")
                router.push("/login")
                return
            }

            // Check if user is admin
            if (!isAdmin()) {
                toast.error("You don't have admin privileges")
                router.push("/")
                return
            }

            fetchUsers()
        }
    }, [isAuthenticated, loading, router, isAdmin])

    // Fetch all users
    const fetchUsers = async () => {
        try {
            setIsRefreshing(true)
            const token = localStorage.getItem("token")
            const response = await fetch("http://localhost:3000/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setUsers(data.users)
            } else {
                toast.error("Error fetching users")
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Server connection error")
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }

    // Promote user to admin
    const promoteToAdmin = async (userId) => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:3000/users/promote/${userId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await response.json()

            if (response.ok) {
                toast.success("User promoted to admin successfully")
                fetchUsers()
            } else {
                toast.error(data.message || "Error promoting user")
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Server connection error")
        }
    }

    // Demote admin to user
    const demoteToUser = async (userId) => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:3000/users/demote/${userId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await response.json()

            if (response.ok) {
                toast.success("Admin demoted to user successfully")
                fetchUsers()
            } else {
                toast.error(data.message || "Error demoting admin")
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Server connection error")
        }
    }

    // Delete user
    const deleteUser = async (userId) => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:3000/users/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await response.json()

            if (response.ok) {
                toast.success("User deleted successfully")
                setConfirmDelete(null)
                fetchUsers()
            } else {
                toast.error(data.message || "Error deleting user")
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Server connection error")
        }
    }

    // Filter users based on search term
    const filteredUsers = users.filter(
        (user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (loading || isLoading) {
        return (
            <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                        <p className="text-gray-600">Manage user accounts and permissions</p>
                    </div>
                    <button
                        onClick={fetchUsers}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                        <span>Refresh</span>
                    </button>
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 p-2.5"
                        placeholder="Search by username or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {users.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No users found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-emerald-50 text-emerald-700 uppercase text-xs leading-normal">
                                    <th className="py-3 px-6 text-left">Username</th>
                                    <th className="py-3 px-6 text-left">Email</th>
                                    <th className="py-3 px-6 text-left">Name</th>
                                    <th className="py-3 px-6 text-center">Role</th>
                                    <th className="py-3 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm">
                                {filteredUsers.map((userData) => (
                                    <tr key={userData._id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-6 text-left">{userData.username}</td>
                                        <td className="py-3 px-6 text-left">{userData.email}</td>
                                        <td className="py-3 px-6 text-left">
                                            {userData.firstname} {userData.lastname}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${userData.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                                                    }`}
                                            >
                                                {userData.role === "admin" ? "Admin" : "User"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                {/* Don't allow actions on current user */}
                                                {userData._id !== user.id ? (
                                                    <>
                                                        {userData.role === "admin" ? (
                                                            <button
                                                                onClick={() => demoteToUser(userData._id)}
                                                                className="text-purple-600 hover:text-purple-900 p-1"
                                                                title="Demote to User"
                                                            >
                                                                <ShieldOff className="h-5 w-5" />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => promoteToAdmin(userData._id)}
                                                                className="text-blue-600 hover:text-blue-900 p-1"
                                                                title="Promote to Admin"
                                                            >
                                                                <Shield className="h-5 w-5" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => setConfirmDelete(userData._id)}
                                                            className="text-red-600 hover:text-red-900 p-1"
                                                            title="Delete User"
                                                        >
                                                            <Trash className="h-5 w-5" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-gray-500 italic">Current user</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Deletion</h2>
                        <p className="mb-6 text-gray-600">
                            Are you sure you want to delete this user? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteUser(confirmDelete)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
