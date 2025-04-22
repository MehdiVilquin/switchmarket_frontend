"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/cards/ProductCard";
import SuggestBrandCard from "@/components/cards/SuggestBrandCard";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Share2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const useProductsUnderScore = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/products?limit=50&sort=-completion_score`
        );
        const data = await response.json();

        if (data.result && data.products) {
          const sortedProducts = [...data.products].sort(
            (a, b) => Number(a.completion_score) - Number(b.completion_score)
          );

          const filteredProducts = sortedProducts
            .filter((p) => {
              const score = Number(p.completion_score);
              return score < 50;
            })
            .slice(0, 5);

          const processedProducts = filteredProducts.map((p) => {
            return {
              id: p._id,
              name: p.product_name,
              brands: p.brands,
              score: Number(p.completion_score),
              ingredients: p.ingredients || [],
              additives: p.additives || [],
              labeltags: p.labeltags || [],
              image: p.image || "/placeholder.png",
              chemicalPercentage: p.chemicalPercentage || 0,
            };
          });
          setProducts(processedProducts);
        }
      } catch (error) {
        // Keep error handling but remove console.error
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, isLoading };
};

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

export default function ContributePage() {
  const { products, isLoading } = useProductsUnderScore();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Hero Section */}
      <div
        className="w-full relative isolate overflow-hidden bg-gray-900"
        style={{
          backgroundImage: "url('/community-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="relative px-6 pt-14 lg:px-8 z-10">
          <div className="mx-auto max-w-2xl py-20 sm:py-32">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-medium tracking-tight text-white sm:text-7xl [text-wrap:balance] bg-clip-text">
                  Community Contributions
                </h1>
                <h2 className="text-xl sm:text-2xl font-regular leading-8 text-gray-100">
                  Contribute to SwitchMarket
                </h2>
              </div>
              <p className="text-base sm:text-lg leading-8 text-gray-200 max-w-xl mx-auto font-light">
                Help us build the most comprehensive ethical shopping platform
                by sharing your knowledge and experiences with our growing
                community.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button
                  asChild
                  variant="outline"
                  className="bg-white hover:bg-gray-100 text-black-600 rounded-lg px-8 h-12 text-base group"
                >
                  <Link href="/register">
                    Join Community
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
              <div className="mt-4 flex justify-center space-x-6">
                <div className="flex items-center"></div>
                <div className="flex items-center">
                  <div className="rounded-full bg-white/10 p-2">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                    </svg>
                  </div>
                  <span className="ml-3 text-sm font-medium text-white">
                    4.9/5 rating
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          These products are incomplete
        </h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {isLoading ? (
            Array(5)
              .fill(0)
              .map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  variants={itemVariants}
                  className="h-[400px] bg-gray-100 rounded-xl animate-pulse"
                />
              ))
          ) : (
            <>
              <motion.div variants={itemVariants} className="h-full">
                <Link href="/suggest-brand" className="block h-full">
                  <SuggestBrandCard />
                </Link>
              </motion.div>
              {products?.map((product) => (
                <motion.div
                  key={product.id}
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
            </>
          )}
        </motion.div>
      </section>

      {/* More Ways to Contribute Section */}
      <section className="w-full bg-[#FBF9F7] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-medium tracking-tight bg-[#FBF9F]">
              More Ways to Contribute
            </h2>
            <div className="space-y-8">
              <div className="flex flex-col items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-white rounded-lg">
                    <Share2 className="h-6 w-6 text-dark-600" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Spread the Word
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Share SwitchMarket with friends and family to grow our
                    ethical community. The more people know about ethical
                    shopping options, the greater our collective impact will be.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-6">
              <Button
                asChild
                variant="outline"
                className="bg-white hover:bg-gray-100 text-black-600 rounded-lg px-8 h-12 text-base group"
              >
                <Link href="/register">
                  Join Community
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
