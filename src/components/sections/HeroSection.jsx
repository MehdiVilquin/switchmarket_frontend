"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2, Filter } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function HeroSection() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const router = useRouter()

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!searchQuery.trim()) return
        setIsSearching(true)
        try {
            router.push(`/searchResults?q=${encodeURIComponent(searchQuery)}`)
        } catch (error) {
            console.error("Search error:", error)
        } finally {
            setIsSearching(false)
        }
    }

    return (
        <section className="relative bg-gradient-to-b from-emerald-50 to-white pt-16 pb-24 px-4 md:px-8 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] opacity-5 bg-center bg-no-repeat bg-cover"></div>
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    className="max-w-3xl mx-auto text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Badge className="mb-4 px-3 py-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
                        Ethical Beauty Choices
                    </Badge>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 tracking-tight leading-tight">
                        Beauty begins with <span className="text-emerald-500">truth</span>
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl mb-8 leading-relaxed">
                        Understand what's in your beauty products and make informed choices for your skin and the planet.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-8">
                            Get Started
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full px-8">
                            Learn More
                        </Button>
                    </div>
                </motion.div>

                <motion.form
                    onSubmit={handleSearch}
                    className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="flex items-center p-4">
                        <Search className="h-5 w-5 text-emerald-500 ml-2 mr-3" />
                        <Input
                            className="border-none flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 text-lg"
                            placeholder="Find a product and get its scoring"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button
                            type="submit"
                            size="default"
                            disabled={isSearching}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6"
                        >
                            {isSearching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Search"}
                        </Button>
                    </div>
                </motion.form>
            </div>
        </section>
    )
}
