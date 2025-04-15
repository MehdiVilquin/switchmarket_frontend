"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchCard from "@/components/searchcard";

// Configuration constants
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const PRODUCTS_PER_PAGE = 20;

function SearchResults() {
  const searchParams = useSearchParams(); // récupère les paramètres de l'URL
  const searchQuery = searchParams.get("q"); // Récupère la valeur du paramètre 'q' de l'URL
  const [displayedProducts, setDisplayedProducts] = useState([]); //  afficher les produits
  const [isLoading, setIsLoading] = useState(false); //  le chargement
  const [hasMore, setHasMore] = useState(true); // la pagination
  const [totalResults, setTotalResults] = useState(0); //  nombre total de résultats

  // Function to load more products from the API
  async function loadMoreProducts() {
    if (isLoading || !hasMore) return; // Charge en cours > plus de produits à charger > on ne charge pas

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/products?all=${encodeURIComponent(searchQuery)}&offset=${
          displayedProducts.length // offset = nombre de produits déjà affichés
        }&limit=${PRODUCTS_PER_PAGE}` // limit = 20 produits par page
      );

      const data = await response.json();

      if (data.products && data.products.length > 0) {
        // Update displayed products and total count
        setDisplayedProducts((prev) => [...prev, ...data.products]);
        setTotalResults(data.total || data.products.length);

        // Check if we have more products to load
        setHasMore(data.products.length === PRODUCTS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Reset and load initial products when search query changes
  useEffect(() => {
    setDisplayedProducts([]);
    setHasMore(true);
    setTotalResults(0);
    loadMoreProducts();
  }, [searchQuery]);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header section with search results count */}
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">
          Search Results for "{searchQuery}"
        </h1>
        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
          {totalResults} results
        </span>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {displayedProducts.map((product) => (
          <div key={product._id} className="w-full">
            <SearchCard product={product} />
          </div>
        ))}
      </div>

      {/* No results message */}
      {displayedProducts.length === 0 && !isLoading && (
        <p className="text-center text-gray-500 my-8">
          No products found for your search.
        </p>
      )}

      {/* Load more button section */}
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadMoreProducts}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
                Loading...
              </>
            ) : (
              `Load more products`
            )}
          </button>
        </div>
      )}
    </main>
  );
}

export default SearchResults;
