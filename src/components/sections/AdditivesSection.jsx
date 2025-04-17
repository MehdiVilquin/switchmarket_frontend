import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AdditiveCard from "@/components/cards/AdditiveCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Cosmetic Additives
            </h2>
          </div>
          <p className="text-gray-600 text-lg max-w-md">
            Learn about common ingredients and additives in your beauty
            products.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {isLoading
            ? Array(4)
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
                  <Link href={`/additives/${add.id}`} className="block h-full">
                    <AdditiveCard {...add} />
                  </Link>
                </motion.div>
              ))}
        </motion.div>

        <div className="flex justify-center mt-10">
          <Link href="/additives">
            <Button
              variant="outline"
              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 rounded-full px-6 group"
            >
              Explore more additives
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
