import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Youtube, ArrowRight, Mail } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Newsletter Section */}
                {/* <div className="py-12 border-b border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Stay in the know</h3>
                            <p className="text-gray-600 mb-0">
                                Get updates on new products, ingredient insights, and ethical beauty tips.
                            </p>
                        </div>
                        <div>
                            <form className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-grow">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="pl-10 py-6 rounded-lg border-gray-200"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg whitespace-nowrap"
                                >
                                    Subscribe <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div> */}

                {/* Main Footer Content */}
                <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <Link href="/" className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                            <span className="text-emerald-500 mr-1">Switch</span>Market
                        </Link>
                        <p className="text-gray-600 mb-6">
                            Helping you make informed choices about your beauty products for a healthier you and planet.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                                <Youtube className="h-5 w-5" />
                                <span className="sr-only">YouTube</span>
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-800 mb-4">Products</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/search" className="text-gray-600 hover:text-emerald-500 transition-colors">
                                    Search Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories" className="text-gray-600 hover:text-emerald-500 transition-colors">
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link href="/brands" className="text-gray-600 hover:text-emerald-500 transition-colors">
                                    Brands
                                </Link>
                            </li>
                            <li>
                                <Link href="/top-rated" className="text-gray-600 hover:text-emerald-500 transition-colors">
                                    Top Rated
                                </Link>
                            </li>
                            <li>
                                <Link href="/new" className="text-gray-600 hover:text-emerald-500 transition-colors">
                                    New Arrivals
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-800 mb-4">Resources</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/additives" className="text-gray-600 hover:text-emerald-500 transition-colors">
                                    Ingredients Library
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-gray-600 hover:text-emerald-500 transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/guides" className="text-gray-600 hover:text-emerald-500 transition-colors">
                                    Guides
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-gray-600 hover:text-emerald-500 transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/glossary" className="text-gray-600 hover:text-emerald-500 transition-colors">
                                    Glossary
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-800 mb-4">Company</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/about" className="text-gray-600 hover:text-emerald-500 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/mission" className="text-gray-600 hover:text-emerald-500 transition-colors">
                                    Our Mission
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-600 hover:text-emerald-500 transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="text-gray-600 hover:text-emerald-500 transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="/press" className="text-gray-600 hover:text-emerald-500 transition-colors">
                                    Press
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="py-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        © {new Date().getFullYear()} SwitchMarket. All rights reserved.
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                        <Link href="/terms" className="text-gray-500 hover:text-emerald-500 transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/privacy" className="text-gray-500 hover:text-emerald-500 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/cookies" className="text-gray-500 hover:text-emerald-500 transition-colors">
                            Cookie Policy
                        </Link>
                        <Link href="/accessibility" className="text-gray-500 hover:text-emerald-500 transition-colors">
                            Accessibility
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
