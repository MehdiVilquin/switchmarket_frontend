"use client"

import { motion } from "framer-motion"
import {
    CircleCheck,
    AlertTriangle,
    MessageSquare,
    ThumbsUp,
    Share2,
    CheckCircle2,
    Search,
    ShieldCheck,
    Upload,
} from "lucide-react"
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
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-emerald-50 to-white pt-24 pb-16 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Badge className="bg-emerald-100 text-emerald-700 border-0 mb-4 px-3 py-1">Community Contributions</Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                            Contribute to SwitchMarket
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                            Help us build the most comprehensive ethical shopping platform by sharing your knowledge and experiences
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid md:grid-cols-2 gap-8"
                    >
                        {/* Suggest an Ethical Brand */}
                        <motion.div variants={itemVariants}>
                            <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-emerald-100 rounded-full">
                                            <CircleCheck className="h-6 w-6 text-emerald-600" />
                                        </div>
                                        <CardTitle className="text-2xl">Suggest an Ethical Brand</CardTitle>
                                    </div>
                                    <CardDescription className="text-base">
                                        Know an ethical brand that should be on our platform? Help us grow our database by suggesting brands
                                        that align with ethical values.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {[
                                            "Share brands with sustainable practices",
                                            "Highlight companies with ethical labor policies",
                                            "Introduce local businesses with positive impact",
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white">
                                        Suggest a Brand
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>

                        {/* Report Unethical Practices */}
                        <motion.div variants={itemVariants}>
                            <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-amber-400 to-red-500"></div>
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-amber-100 rounded-full">
                                            <AlertTriangle className="h-6 w-6 text-amber-600" />
                                        </div>
                                        <CardTitle className="text-2xl">Report Unethical Practices</CardTitle>
                                    </div>
                                    <CardDescription className="text-base">
                                        Help keep brands accountable by reporting unethical practices or misleading claims that you've
                                        discovered.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {[
                                            "Report environmental violations",
                                            "Flag labor rights concerns",
                                            "Identify greenwashing or false claims",
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white">
                                        Report an Issue
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </motion.div>

                    {/* Additional Ways to Contribute */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-16"
                    >
                        <h2 className="text-3xl font-bold text-center mb-10">More Ways to Contribute</h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Give Feedback */}
                            <Card className="border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px]">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-center mb-4">
                                        <div className="p-3 bg-blue-100 rounded-full">
                                            <MessageSquare className="h-6 w-6 text-blue-600" />
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl text-center">Give Feedback</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center pb-4">
                                    <p className="text-gray-600">
                                        Share your thoughts on how we can improve the platform and user experience.
                                    </p>
                                </CardContent>
                                <CardFooter className="pt-0 flex justify-center">
                                    <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                        Provide Feedback
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Vote on Campaigns */}
                            <Card className="border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px]">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-center mb-4">
                                        <div className="p-3 bg-purple-100 rounded-full">
                                            <ThumbsUp className="h-6 w-6 text-purple-600" />
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl text-center">Vote on Campaigns</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center pb-4">
                                    <p className="text-gray-600">
                                        Help ethical brands reach discount goals by voting on active campaigns.
                                    </p>
                                </CardContent>
                                <CardFooter className="pt-0 flex justify-center">
                                    <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                                        View Campaigns
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Spread the Word */}
                            <Card className="border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px]">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-center mb-4">
                                        <div className="p-3 bg-teal-100 rounded-full">
                                            <Share2 className="h-6 w-6 text-teal-600" />
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl text-center">Spread the Word</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center pb-4">
                                    <p className="text-gray-600">
                                        Share SwitchMarket with friends and family to grow our ethical community.
                                    </p>
                                </CardContent>
                                <CardFooter className="pt-0 flex justify-center">
                                    <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                                        Share SwitchMarket
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </motion.div>

                    {/* Verification Process */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-24 mb-16"
                    >
                        <h2 className="text-3xl font-bold text-center mb-4">How We Verify Contributions</h2>
                        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
                            We take accuracy seriously. Here's our rigorous process to ensure all information on our platform is
                            reliable.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    number: "1",
                                    title: "Initial Review",
                                    description:
                                        "Our team reviews all submissions for completeness and relevance before adding them to our verification queue.",
                                    icon: <Upload className="h-6 w-6 text-white" />,
                                },
                                {
                                    number: "2",
                                    title: "Research & Verification",
                                    description:
                                        "We research claims using multiple sources, including third-party certifications, public records, and industry reports.",
                                    icon: <Search className="h-6 w-6 text-white" />,
                                },
                                {
                                    number: "3",
                                    title: "Publication",
                                    description:
                                        "Verified information is published on our platform with sources cited. Contributors are credited (if desired).",
                                    icon: <ShieldCheck className="h-6 w-6 text-white" />,
                                },
                            ].map((step, i) => (
                                <motion.div key={i} variants={stepVariants} className="relative">
                                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 h-full">
                                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                {step.icon}
                                            </div>
                                        </div>
                                        <div className="pt-8 text-center">
                                            <h3 className="text-xl font-bold mb-2 text-gray-800">{step.title}</h3>
                                            <p className="text-gray-600">{step.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 md:p-12 text-white text-center shadow-xl"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
                            Join our community of conscious consumers and help build a more ethical marketplace.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-white text-emerald-700 hover:bg-gray-100">
                                Start Contributing
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
