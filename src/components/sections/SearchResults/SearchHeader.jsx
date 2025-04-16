"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, Loader2, Search } from "lucide-react"

export default function SearchHeader({ searchQuery }) {
    const [localQuery, setLocalQuery] = useState(searchQuery)
    const [isSearching, setIsSearching] = useState(false)
    const router = useRouter()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!localQuery.trim()) return

        setIsSearching(true)
        router.push(`/searchResults?q=${encodeURIComponent(localQuery)}`)
        setIsSearching(false)
    }

    return (
        <section className="bg-gradient-to-b from-emerald-50 to-white pt-8 pb-12 px-4 md:px-8 border-b border-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Badge className="mb-2 px-3 py-1 bg-emerald-100 text-emerald-800">Search Results</Badge>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Results for "{searchQuery}"</h1>
                    <p className="text-gray-600">Explore products matching your search criteria</p>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="max-w-3xl bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                >
                    <div className="flex items-center p-3">
                        <Search className="h-5 w-5 text-emerald-500 ml-2 mr-3" />
                        <Input
                            className="border-none flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
                            placeholder="Refine your search..."
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                        />
                        <Button type="submit" size="sm" disabled={isSearching} className="bg-emerald-500 text-white px-4">
                            {isSearching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Search"}
                        </Button>
                    </div>
                    <div className="border-t px-4 py-2 flex items-center text-sm text-gray-500 bg-gray-50 hover:bg-gray-100 cursor-pointer">
                        <Filter className="h-4 w-4 mr-2 text-emerald-500" />
                        <span className="font-medium">Advanced Filters</span>
                    </div>
                </form>
            </div>
        </section>
    )
}
