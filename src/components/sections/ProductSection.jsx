import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductCard from "@/components/cards/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function ProductSection({ products, isLoading }) {
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
            Featured Products
          </Badge>
          <h2 className="text-5xl md:text-[80px] font-medium text-black leading-tight tracking-tight md:leading-[1.35] -tracking-[0.02em] mb-5 max-w-4xl">
            Discover our best products
          </h2>
          <p className="text-xl md:text-3xl text-[#3D3F3D] leading-[1.35] max-w-4xl">
            Explore high-scoring cosmetics based on real data and ethical
            standards.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {isLoading
            ? Array(6)
              .fill(0)
              .map((_, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Skeleton className="h-[400px] w-full rounded-xl" />
                </motion.div>
              ))
            : products.map((product, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="h-full"
              >
                <Link
                  href={`/product/${product.id}`}
                  className="block h-full"
                >
                  <ProductCard {...product} />
                </Link>
              </motion.div>
            ))}
        </motion.div>

        <div className="flex justify-center mt-16">
          <Button
            asChild
            variant="outline"
            className="bg-black hover:bg-white text-white rounded-lg px-8 h-12 text-base group"
          >
            <Link href="/searchResults">
              Explore more products
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
