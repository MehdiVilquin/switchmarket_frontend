"use client"

import { motion } from "framer-motion"
import { CircleCheck, Share2, CheckCircle2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContributePage() {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    }

    const stepVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 },
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Redesigned with split layout */}
            <section className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50 clip-path-hero z-0"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 py-20 lg:py-32 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            className="relative z-10"
                        >
                            <Badge className="bg-emerald-100 text-emerald-700 border-0 mb-6 px-4 py-1.5 text-sm rounded-full">
                                Community Contributions
                            </Badge>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                Contribute to <span className="text-emerald-600">SwitchMarket</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                                Help us build the most comprehensive ethical shopping platform by sharing your knowledge and experiences
                            </p>
                            <Button
                                asChild
                                size="lg"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-emerald-200/50 hover:translate-y-[-2px] transition-all"
                            >
                                <a href="/contributions">Start Contributing</a>
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="relative z-10"
                        >
                            {/* Suggest an Ethical Brand - Moved to hero section */}
                            <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white rounded-2xl transform hover:translate-y-[-5px]">
                                <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                                <CardHeader className="pb-2 pt-6">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="p-3 bg-emerald-100 rounded-full">
                                            <CircleCheck className="h-7 w-7 text-emerald-600" />
                                        </div>
                                        <CardTitle className="text-2xl font-bold">Suggest an Ethical Brand</CardTitle>
                                    </div>
                                    <CardDescription className="text-base text-gray-600">
                                        Know an ethical brand that should be on our platform? Help us grow our database.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <ul className="space-y-4">
                                        {[
                                            "Share brands with sustainable practices",
                                            "Highlight companies with ethical labor policies",
                                            "Introduce local businesses with positive impact",
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="bg-emerald-50 p-1.5 rounded-full mt-0.5">
                                                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                                                </div>
                                                <span className="text-gray-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Verification Process - Redesigned as timeline */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">How We Verify Contributions</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            We take accuracy seriously. Here's our rigorous process to ensure all information on our platform is
                            reliable.
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-emerald-200 z-0 rounded-full"></div>

                        <motion.div
                            variants={stepVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="relative z-10 flex justify-center mb-16"
                        >
                            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 max-w-lg relative">
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white">
                                        <Upload className="h-7 w-7 text-white" />
                                    </div>
                                </div>
                                <div className="pt-8 text-center">
                                    <h3 className="text-2xl font-bold mb-3 text-gray-800">Initial Review</h3>
                                    <p className="text-gray-600 text-lg">
                                        Our team reviews all submissions for completeness and relevance before adding them to our
                                        verification queue.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* More Ways to Contribute - Redesigned with larger card */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-16 text-center"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">More Ways to Contribute</h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-teal-50 to-white rounded-2xl">
                            <div className="grid md:grid-cols-5 gap-6">
                                <div className="md:col-span-2 flex items-center justify-center p-8">
                                    <div className="p-6 bg-white rounded-full shadow-inner">
                                        <Share2 className="h-16 w-16 text-teal-600" />
                                    </div>
                                </div>
                                <div className="md:col-span-3 p-8 flex flex-col justify-center">
                                    <CardTitle className="text-3xl font-bold mb-4 text-gray-900">Spread the Word</CardTitle>
                                    <CardDescription className="text-lg text-gray-600 mb-8">
                                        Share SwitchMarket with friends and family to grow our ethical community. The more people know about
                                        ethical shopping options, the greater our collective impact will be.
                                    </CardDescription>
                                    <div>
                                        <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-8">
                                            Share SwitchMarket
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
