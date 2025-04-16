"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header
            className={`sticky top-0 w-full p-4 flex justify-between items-center z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-sm" : "bg-[#e6f4f1]"
                }`}
        >
            <Link href="/" className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="text-emerald-500 mr-1">Switch</span>Market
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
                <Link href="/search" className="text-gray-600 hover:text-emerald-600 transition-colors">
                    Search
                </Link>
                <Link href="/discover" className="text-gray-600 hover:text-emerald-600 transition-colors">
                    Discover
                </Link>
                <Link href="/shop" className="text-gray-600 hover:text-emerald-600 transition-colors">
                    Shop
                </Link>
                <Link href="/spotted" className="text-gray-600 hover:text-emerald-600 transition-colors">
                    Spotted
                </Link>
            </nav>

            <div className="flex items-center gap-2">
                <Button variant="ghost" asChild className="text-gray-600 hover:text-emerald-600 hidden md:flex">
                    <Link href="/login">Sign in</Link>
                </Button>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white hidden md:flex" asChild>
                    <Link href="/register">Login</Link>
                </Button>

                {/* Mobile menu button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 top-[60px] bg-white z-40 p-6 md:hidden"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <nav className="flex flex-col space-y-6">
                            <Link
                                href="/search"
                                className="text-gray-800 hover:text-emerald-600 text-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Search
                            </Link>
                            <Link
                                href="/discover"
                                className="text-gray-800 hover:text-emerald-600 text-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Discover
                            </Link>
                            <Link
                                href="/shop"
                                className="text-gray-800 hover:text-emerald-600 text-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Shop
                            </Link>
                            <Link
                                href="/spotted"
                                className="text-gray-800 hover:text-emerald-600 text-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Spotted
                            </Link>

                            <div className="pt-6 border-t border-gray-100 flex flex-col space-y-4">
                                <Button variant="outline" asChild className="w-full">
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
                                </Button>
                                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white w-full" asChild>
                                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                                </Button>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
