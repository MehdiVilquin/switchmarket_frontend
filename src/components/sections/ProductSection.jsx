import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ProductCard from "@/components/cards/ProductCard"
import { Skeleton } from "@/components/ui/skeleton"

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 },
    },
}

export default function ProductSection({ products, isLoading }) {
    return (
        <section className="py-16 px-4 md:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <Badge className="mb-2 px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
                            Featured Products
                        </Badge>
                        <div className="flex items-center">
                            <Sparkles className="h-7 w-7 text-emerald-500 mr-3" />
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                                Discover Products
                            </h2>
                        </div>
                    </div>
                    <p className="text-gray-600 text-lg max-w-md">
                        Explore high-scoring cosmetics based on real data and ethical standards.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {isLoading
                        ? Array(6)
                            .fill(0)
                            .map((_, index) => (
                                <motion.div key={index} variants={itemVariants}>
                                    <Skeleton className="h-[180px] w-full rounded-xl" />
                                </motion.div>
                            ))
                        : products.map((product, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <Link href={`/product/${product.id}`} className="block h-full">
                                    <ProductCard {...product} />
                                </Link>
                            </motion.div>
                        ))}
                </motion.div>

                <div className="flex justify-center mt-10">
                    <Button
                        variant="outline"
                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 rounded-full px-6 group"
                    >
                        Explore more products
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </section>
    )
}
