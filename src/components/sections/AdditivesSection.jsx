import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import IngredientCard from "@/components/cards/IngredientCard"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

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

export default function AdditivesSection({ additives, isLoading }) {
    return (
        <section className="py-16 px-4 md:px-8 bg-emerald-50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <Badge className="mb-2 px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
                            Ingredients Library
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Cosmetic Additives</h2>
                    </div>
                    <p className="text-gray-600 text-lg max-w-md">
                        Learn about common ingredients and additives in your beauty products.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {isLoading
                        ? Array(6)
                            .fill(0)
                            .map((_, index) => (
                                <motion.div key={index} variants={itemVariants}>
                                    <Skeleton className="h-[180px] w-full rounded-lg" />
                                </motion.div>
                            ))
                        : additives.map((add, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={`/additives/${add.id}`} className="block h-full">
                                                <IngredientCard {...add} />
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{add.description}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </motion.div>
                        ))}
                </motion.div>
            </div>
        </section>
    )
}
