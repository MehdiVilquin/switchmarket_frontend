"use client";
import { useRef, useCallback, memo } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/cards/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

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

const ResultsGrid = memo(function ResultsGrid({
  products,
  isLoading,
  hasMore,
  loadMore,
  page,
}) {
  const observer = useRef();

  const lastItemRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore(page + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, page, loadMore]
  );

  return (
    <motion.div
      className="grid gap-6 auto-rows-auto grid-cols-1 sm:grid-cols-2"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {products.map((product, index) => {
        const card = (
          <motion.div
            key={`${product.id}-${index}`}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Link href={`/product/${product.id}`} className="block">
              <ProductCard {...product} />
            </Link>
          </motion.div>
        );

        return index === products.length - 1 ? (
          <div key={`${product.id}-${index}-ref`} ref={lastItemRef}>
            {card}
          </div>
        ) : (
          card
        );
      })}

      {isLoading &&
        page > 1 &&
        Array(4)
          .fill(0)
          .map((_, i) => (
            <motion.div key={`loading-${i}`} variants={itemVariants}>
              <Skeleton className="h-[180px] w-full rounded-xl" />
            </motion.div>
          ))}
    </motion.div>
  );
});

export default ResultsGrid;
