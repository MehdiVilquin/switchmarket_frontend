"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BigAdditiveCard from "@/components/cards/BigAdditiveCard";
import { Skeleton } from "@/components/ui/skeleton";
import useInfiniteScroll from "@/lib/hooks/useInfiniteScroll";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function AdditivesPage() {
  const [additives, setAdditives] = useState([]);
  const { isLoading } = useInfiniteScroll(fetchAdditives);

  async function fetchAdditives(pageNumber) {
    try {
      const res = await fetch(
        `${API_URL}/additives?page=${pageNumber}&limit=8`
      );
      const data = await res.json();

      if (data.result && data.additives) {
        const processedAdditives = data.additives.map((a) => ({
          id: a._id,
          shortName: a.shortName || "N/A",
          name: a.name?.uk || "Unknown",
          origin: a.origin || "Unknown origin",
          risk: a.risk || "Not specified",
          function: a.fonction || "Unknown function",
          family: a.famille || "Unclassified",
          productExamples: a.exemples_produits || "No examples available",
          adi: a.dja || "Not specified",
          possibleAllergy: a.allergie_possible === "Oui" ? "Yes" : "No",
          comment: a.commentaire,
          note: a.note,
        }));

        if (pageNumber === 1) {
          setAdditives(processedAdditives);
        } else {
          setAdditives((prev) => [...prev, ...processedAdditives]);
        }
        return processedAdditives.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error fetching additives:", error);
      return false;
    }
  }

  return (
    <main className="min-h-screen py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Cosmetic Additives Library
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive database of cosmetic ingredients and
            additives. Learn about their properties, risks, and uses in beauty
            products.
          </p>
        </div>

        {/* Grid of Additives */}
        <div className="space-y-6">
          {additives.map((additive, index) => (
            <motion.div
              key={additive.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BigAdditiveCard {...additive} />
            </motion.div>
          ))}

          {/* Loading States */}
          {isLoading && (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
