"use client"

import { useSearchParams } from "next/navigation"
import useSearchProducts from "@/lib/hooks/useSearchProducts"
import SearchHeader from "@/components/sections/SearchResults/SearchHeader"
import ResultsGrid from "@/components/sections/SearchResults/ResultsGrid"
import NoResults from "@/components/sections/SearchResults/NoResults"
import { Loader2 } from "lucide-react"

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("q") || ""

  const {
    products,
    isLoading,
    hasMore,
    error,
    page,
    setPage,
    loadProducts,
  } = useSearchProducts(searchQuery)

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <SearchHeader searchQuery={searchQuery} />

      <section className="px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Résumé du nombre de résultats */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              {products.length > 0
                ? `Showing ${products.length} results`
                : isLoading && page === 1
                  ? "Searching..."
                  : "No products found"}
            </p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              Error: {error}. Please try again.
            </div>
          )}

          {/* Grille des produits */}
          {products.length > 0 && (
            <ResultsGrid
              products={products}
              isLoading={isLoading}
              hasMore={hasMore}
              page={page}
              loadMore={(nextPage) => {
                setPage(nextPage)
                loadProducts(nextPage, searchQuery)
              }}
            />
          )}

          {/* Chargement initial (aucun produit encore affiché) */}
          {isLoading && page === 1 && products.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <div key={`loading-${i}`} className="h-[180px] w-full rounded-xl bg-gray-200 animate-pulse" />
                ))}
            </div>
          )}

          {/* Aucun résultat */}
          {!isLoading && products.length === 0 && <NoResults query={searchQuery} />}

          {/* Fin de liste */}
          {!isLoading && !hasMore && products.length > 0 && (
            <div className="text-center mt-12 py-8 border-t border-gray-200">
              <p className="text-gray-600">You've reached the end of the results</p>
            </div>
          )}

          {/* Indicateur de chargement bas de page */}
          {isLoading && page > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2 text-emerald-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading more products...</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
