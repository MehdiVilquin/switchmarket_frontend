import { motion } from "framer-motion"
import { Leaf, ShieldCheck, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function FeaturesSection() {
    const features = [
        {
            icon: <Leaf className="h-8 w-8 text-emerald-600" />,
            title: "Ethical Products",
            description: "Discover beauty products that align with your values and ethical standards",
        },
        {
            icon: <ShieldCheck className="h-8 w-8 text-emerald-600" />,
            title: "Ingredient Transparency",
            description: "Understand what's in your products with our detailed ingredient analysis",
        },
        {
            icon: <Heart className="h-8 w-8 text-emerald-600" />,
            title: "Better Choices",
            description: "Make informed decisions for your skin health and environmental impact",
        },
    ]

    return (
        <section className="py-16 px-4 md:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose SwitchMarket</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We help you make better choices for your beauty routine and the environment
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            className="bg-emerald-50 rounded-2xl p-6 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * i }}
                        >
                            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{f.title}</h3>
                            <p className="text-gray-600">{f.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
