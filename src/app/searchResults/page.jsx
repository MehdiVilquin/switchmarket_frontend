"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchCard from "@/components/searchcard";

// API base URL (à mettre dans un fichier de configuration)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function SearchResults() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  async function loadMoreProducts() {
    if (isLoading || !hasMore || !searchQuery) return;

    setIsLoading(true);
    try {
      // Utilisation de la bonne route avec le paramètre 'all'
      const response = await fetch(
        `${API_URL}/products?all=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data.result && data.products && data.products.length > 0) {
        setDisplayedProducts((prev) => [...prev, ...data.products]);
        // Si on reçoit moins de produits que prévu, on désactive le bouton "Load more"
        if (data.products.length < 20) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setHasMore(false);
    }
  }

  useEffect(() => {
    // Réinitialiser les résultats quand la recherche change
    setDisplayedProducts([]);
    setHasMore(true);
    loadMoreProducts();
  }, [searchQuery]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for "{searchQuery}"
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {displayedProducts.map((product) => (
          <div key={product._id} className="w-full">
            <SearchCard product={product} />
          </div>
        ))}
      </div>

      {displayedProducts.length === 0 && !isLoading && (
        <p className="text-center text-gray-500 my-8">
          No products found for your search.
        </p>
      )}

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadMoreProducts}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Load more products"}
          </button>
        </div>
      )}
    </main>
  );
}

export default SearchResults;
