import { motion } from "framer-motion"
import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function CommunitySection() {
    return (
        <section className="py-16 px-4 md:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Badge className="mb-4 px-3 py-1 bg-white/20 text-white hover:bg-white/30 transition-colors">
                                    Join Our Community
                                </Badge>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                    Be part of the ethical beauty movement
                                </h2>
                                <p className="text-white/90 text-lg mb-8 max-w-md">
                                    Join thousands of conscious consumers making better choices for themselves and the planet.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 rounded-full px-8">
                                        Create Account
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-white/50 hover:bg-white/10 rounded-full px-8"
                                    >
                                        Learn More
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                        <div className="hidden md:block relative">
                            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=600')] bg-center bg-cover opacity-20"></div>
                            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-emerald-500/90"></div>
                            <div className="absolute bottom-12 left-12 flex items-center">
                                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 flex items-center">
                                    <Users className="h-8 w-8 text-white mr-3" />
                                    <div>
                                        <p className="text-white font-bold text-xl">10,000+</p>
                                        <p className="text-white/80 text-sm">Community Members</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
