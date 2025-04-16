"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProductHeader({ productName }) {
    const router = useRouter()

    return (
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <div className="text-sm text-gray-500 ml-4">
                    <span className="text-gray-400">Home</span> / <span className="text-gray-400">Products</span> / <span>{productName || "..."}</span>
                </div>
            </div>
        </div>
    )
}