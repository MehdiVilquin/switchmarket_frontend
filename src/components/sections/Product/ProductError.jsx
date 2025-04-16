"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function ProductError({ message }) {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <Button onClick={() => router.back()} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    Go Back
                </Button>
            </div>
        </div>
    )
}
