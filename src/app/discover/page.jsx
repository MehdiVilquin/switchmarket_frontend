"use client";

import { useState } from "react";
import useNewsData from "@/lib/hooks/useNewsData";
import NewsCard from "@/components/cards/NewsCard";
import { Newspaper, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

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

export default function DiscoverPage() {
  const { articles, isLoading, error } = useNewsData();
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrer les articles en fonction de la recherche
  const filteredArticles =
    searchQuery.trim() === ""
      ? articles
      : articles.filter((article) => {
          const searchText = searchQuery.toLowerCase();
          return (
            (article.title &&
              article.title.toLowerCase().includes(searchText)) ||
            (article.description &&
              article.description.toLowerCase().includes(searchText)) ||
            (article.source &&
              article.source.toLowerCase().includes(searchText))
          );
        });

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // Effacer la recherche
  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-gray-900">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: "url('/discover_hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-black/40 -z-10" />
        <div className="py-16 md:py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="flex flex-col items-center text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-3 px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
                Latest News
              </Badge>
              <h1 className="text-4xl md:text-6xl font-medium text-white leading-tight tracking-tight md:leading-[1.2] -tracking-[0.02em] mb-4 max-w-4xl">
                Ethical Beauty News
              </h1>
              <p className="text-lg md:text-2xl text-gray-200 leading-[1.35] max-w-3xl">
                Stay up to date with the latest news and trends in ethical and
                sustainable beauty products.
              </p>
            </motion.div>

            {/* Barre de recherche */}
            <div className="mb-8">
              <form
                onSubmit={handleSubmit}
                className="relative max-w-2xl mx-auto"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full px-6 py-4 pl-14 pr-12 bg-white rounded-xl border-2 border-gray-200 focus:outline-none focus:border-black transition-colors text-lg"
                  />
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </form>
              {searchQuery && (
                <div className="text-center text-base text-gray-500 mt-4">
                  Found {filteredArticles.length} article
                  {filteredArticles.length !== 1 ? "s" : ""} matching "
                  {searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8">
              Error: {error}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-xl h-[480px] animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <NewsCard article={article} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-16 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <Newspaper className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl text-gray-500 mb-4">
                    {searchQuery
                      ? "No articles found matching your search"
                      : "No articles found"}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="text-emerald-600 hover:text-emerald-700 hover:underline text-lg font-medium"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
