"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import useSearchProducts from "@/lib/hooks/useSearchProducts"
import SearchHeader from "@/components/sections/SearchResults/SearchHeader"
import ResultsGrid from "@/components/sections/SearchResults/ResultsGrid"
import NoResults from "@/components/sections/SearchResults/NoResults"
import FilterSidebar from "@/components/sections/SearchResults/FilterSidebar"
import { Loader2, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("q") || ""

  // State for filters
  const [filters, setFilters] = useState({
    brand: searchParams.get("brand") || null,
    labels: searchParams.get("labels") || null,
    categories: searchParams.get("categories") || null,
  })

  // State for mobile filter sidebar
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Get products using the hook
  const { products, isLoading, hasMore, error, page, setPage, loadProducts } = useSearchProducts(searchQuery, filters)

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
    setShowMobileFilters(false) // Close mobile filters after applying
  }

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <SearchHeader />

      <section className="px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Mobile filter button */}
          <div className="md:hidden mb-4">
            <Button
              onClick={() => setShowMobileFilters(true)}
              variant="outline"
              className="w-full flex items-center justify-center"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile filter sidebar */}
          {showMobileFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
              <div className="absolute right-0 top-0 h-full w-80 bg-white p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-lg">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <FilterSidebar onFiltersChange={handleFiltersChange} />
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {/* Desktop sidebar */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <FilterSidebar onFiltersChange={handleFiltersChange} />
            </div>

            <div className="flex-1">
              {/* Results summary */}
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600">
                  {searchQuery && (
                    <span className="font-medium">
                      Search: <span className="text-emerald-600">"{searchQuery}"</span>
                    </span>
                  )}
                  {products.length > 0
                    ? ` • ${products.length} results`
                    : isLoading && page === 1
                      ? " • Searching..."
                      : " • No products found"}
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  Error: {error}. Please try again.
                </div>
              )}

              {/* Product grid */}
              {products.length > 0 && (
                <ResultsGrid
                  products={products}
                  isLoading={isLoading}
                  hasMore={hasMore}
                  page={page}
                  loadMore={(nextPage) => {
                    setPage(nextPage)
                    loadProducts(nextPage)
                  }}
                />
              )}

              {/* Initial loading (no products yet displayed) */}
              {isLoading && page === 1 && products.length === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <div key={`loading-${i}`} className="h-[180px] w-full rounded-xl bg-gray-200 animate-pulse" />
                    ))}
                </div>
              )}

              {/* No results */}
              {!isLoading && products.length === 0 && <NoResults query={searchQuery} />}

              {/* End of list */}
              {!isLoading && !hasMore && products.length > 0 && (
                <div className="text-center mt-12 py-8 border-t border-gray-200">
                  <p className="text-gray-600">You've reached the end of the results</p>
                </div>
              )}

              {/* Bottom loading indicator */}
              {isLoading && page > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading more products...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
