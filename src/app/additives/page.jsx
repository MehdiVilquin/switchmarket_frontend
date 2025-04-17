"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BigAdditiveCard from "@/components/cards/BigAdditiveCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const ITEMS_PER_BATCH = 6;

export default function AdditivesPage() {
  const [additives, setAdditives] = useState([]);
  const [filteredAdditives, setFilteredAdditives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_BATCH);

  // Filter states
  const [allergyFilter, setAllergyFilter] = useState("all");
  const [originFilter, setOriginFilter] = useState("all");
  const [noteFilter, setNoteFilter] = useState("all");

  // Unique values for filters
  const [origins, setOrigins] = useState(new Set());
  const [notes, setNotes] = useState(new Set());

  useEffect(() => {
    fetchAdditives();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...additives];

    if (allergyFilter !== "all") {
      result = result.filter((item) => item.possibleAllergy === allergyFilter);
    }

    if (originFilter !== "all") {
      result = result.filter((item) => item.origin === originFilter);
    }

    if (noteFilter !== "all") {
      result = result.filter((item) => item.note === noteFilter);
    }

    setFilteredAdditives(result);
    setDisplayCount(ITEMS_PER_BATCH); // Reset display count when filters change
  }, [additives, allergyFilter, originFilter, noteFilter]);

  async function fetchAdditives() {
    try {
      const res = await fetch(`${API_URL}/additives`);
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

        // Extract unique values for filters
        const uniqueOrigins = new Set(processedAdditives.map((a) => a.origin));
        const uniqueNotes = new Set(
          processedAdditives.filter((a) => a.note).map((a) => a.note)
        );

        setOrigins(uniqueOrigins);
        setNotes(uniqueNotes);
        setAdditives(processedAdditives);
        setFilteredAdditives(processedAdditives);
      }
    } catch (error) {
      console.error("Error fetching additives:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const loadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_BATCH);
  };

  const displayedAdditives = filteredAdditives.slice(0, displayCount);
  const hasMore = displayCount < filteredAdditives.length;

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

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 items-center justify-center">
          <Select value={allergyFilter} onValueChange={setAllergyFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Allergy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Allergies</SelectItem>
              <SelectItem value="Yes">With Allergy</SelectItem>
              <SelectItem value="No">No Allergy</SelectItem>
            </SelectContent>
          </Select>

          <Select value={originFilter} onValueChange={setOriginFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Origin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Origins</SelectItem>
              {Array.from(origins).map((origin) => (
                <SelectItem key={origin} value={origin}>
                  {origin}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {notes.size > 0 && (
            <Select value={noteFilter} onValueChange={setNoteFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Note" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Notes</SelectItem>
                {Array.from(notes).map((note) => (
                  <SelectItem key={note} value={note}>
                    {note}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Reset Filters Button */}
          <Button
            variant="outline"
            onClick={() => {
              setAllergyFilter("all");
              setOriginFilter("all");
              setNoteFilter("all");
            }}
            className="bg-white"
          >
            Reset Filters
          </Button>
        </div>

        {/* Grid of Additives */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!isLoading &&
              displayedAdditives.map((additive, index) => (
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
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
                ))}
              </>
            )}
          </div>

          {/* Load More Button */}
          {!isLoading && hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={loadMore}
                variant="outline"
                size="lg"
                className="bg-white hover:bg-gray-50"
              >
                Load More Additives
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
