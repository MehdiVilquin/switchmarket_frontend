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
    <section className="py-32 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex flex-col items-center text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="mb-4 px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
            Ingredients Library
          </Badge>
          <h2 className="text-5xl md:text-[80px] font-medium text-black leading-tight tracking-tight md:leading-[1.35] -tracking-[0.02em] mb-5 max-w-4xl">
            Cosmetic Additives
          </h2>
          <p className="text-xl md:text-3xl text-[#3D3F3D] leading-[1.35] max-w-4xl">
            Learn about common ingredients and additives in your beauty
            products.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {isLoading
            ? Array(8)
                .fill(0)
                .map((_, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Skeleton className="h-[200px] w-full rounded-xl" />
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

        <div className="flex justify-center mt-16">
          <Link href="/additives">
            <Button
              variant="outline"
              className="bg-black hover:bg-gray-900 text-white rounded-lg px-8 h-12 text-base group"
            >
              Explore all additives
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
