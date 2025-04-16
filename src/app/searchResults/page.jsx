"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Loader2, Search, Filter } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import ProductCard from "@/components/ProductCard"

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
}

export default function SearchResults() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("q") || ""

  const [displayedProducts, setDisplayedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [error, setError] = useState(null)
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const [isSearching, setIsSearching] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  // Track loaded pages to prevent duplicate requests
  const loadedPagesRef = useRef(new Set())
  // Store the current search query to detect changes
  const currentQueryRef = useRef("")

  const observer = useRef()
  const PRODUCTS_PER_PAGE = 10

  // Debug log to check search query
  useEffect(() => {
    console.log("Search query from URL:", searchQuery)
  }, [searchQuery])

  // Function to load products from API
  const loadProducts = useCallback(
    async (pageNum, query) => {
      // Don't proceed if already loading or no query
      if (isLoading || !query) return

      // Check if this page for this query has already been loaded
      const pageKey = `${query}-${pageNum}`
      if (loadedPagesRef.current.has(pageKey)) {
        console.log(`Page ${pageNum} for query "${query}" already loaded, skipping`)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        console.log(`Loading products for query: ${query}, page: ${pageNum}`)

        // Using the all parameter for search
        const response = await fetch(
          `${API_URL}/product?all=${encodeURIComponent(query)}&page=${pageNum}&limit=${PRODUCTS_PER_PAGE}`,
        )

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()

        if (data.result && data.products && data.products.length > 0) {
          // Process products to match our component props
          const processedProducts = data.products.map((p) => ({
            id: p._id,
            name: p.product_name,
            brand: p.brands,
            score: p.completion_score,
            ingredients: p.ingredients || [],
            additives: p.additives || [],
            labeltags: p.labeltags || [],
            naturalPercentage: p.naturalPercentage || 0,
            chemicalPercentage: p.chemicalPercentage || 0,
            effects: [],
          }))

          setDisplayedProducts((prev) => {
            // If it's a new search (page 1), replace all products
            // Otherwise, append new products
            return pageNum === 1 ? processedProducts : [...prev, ...processedProducts]
          })

          // Mark this page as loaded
          loadedPagesRef.current.add(pageKey)

          // Check if we have more pages based on pagination info
          if (data.pagination) {
            setHasMore(pageNum < data.pagination.pages)
          } else {
            // If we received fewer products than requested, there are no more to load
            setHasMore(data.products.length >= PRODUCTS_PER_PAGE)
          }

          // Reset retry count on success
          setRetryCount(0)
        } else {
          if (pageNum === 1) {
            setDisplayedProducts([])
          }
          setHasMore(false)
        }
      } catch (err) {
        console.error("Error loading products:", err)

        // Implement retry logic
        if (retryCount < maxRetries) {
          console.log(`Retrying... Attempt ${retryCount + 1} of ${maxRetries}`)
          setRetryCount((prev) => prev + 1)
          // Wait a bit before retrying
          setTimeout(() => {
            loadProducts(pageNum, query)
          }, 1000)
        } else {
          setError(err.message)
        }
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, retryCount], // Only depend on these values
  )

  // Initialize search on first load or when search query changes
  useEffect(() => {
    // Always update the local search query when URL param changes
    setLocalSearchQuery(searchQuery)

    // If we have a search query and it's different from what we've already loaded
    if (searchQuery && currentQueryRef.current !== searchQuery) {
      console.log(`Search query changed from "${currentQueryRef.current}" to "${searchQuery}", resetting`)
      setDisplayedProducts([])
      setPage(1)
      setHasMore(true)
      setRetryCount(0)
      loadedPagesRef.current.clear() // Clear loaded pages
      currentQueryRef.current = searchQuery // Update the ref

      // Load the first page
      loadProducts(1, searchQuery)
    }
  }, [searchQuery, loadProducts])

  // Set up intersection observer for infinite scroll
  const lastProductElementRef = useCallback(
    (node) => {
      if (isLoading) return

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1
          console.log(`Intersection observed, loading page ${nextPage}`)
          setPage(nextPage)
          loadProducts(nextPage, searchQuery)
        }
      })

      if (node) observer.current.observe(node)
    },
    [isLoading, hasMore, page, searchQuery, loadProducts],
  )

  // Handle new search submission
  const handleSearch = (e) => {
    e.preventDefault()
    if (!localSearchQuery.trim()) return

    setIsSearching(true)

    // Update the URL with the new search query
    router.push(`/searchResults?q=${encodeURIComponent(localSearchQuery)}`)

    // Reset and load new search
    setDisplayedProducts([])
    setPage(1)
    setHasMore(true)
    setRetryCount(0)
    loadedPagesRef.current.clear() // Clear loaded pages

    // Only update currentQueryRef after the router has updated
    // This will be handled by the useEffect that watches searchQuery

    setIsSearching(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* Search header with gradient background */}
      <section className="bg-gradient-to-b from-emerald-50 to-white pt-8 pb-12 px-4 md:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Badge className="mb-2 px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
              Search Results
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Results for "{searchQuery}"</h1>
            <p className="text-gray-600">Explore products matching your search criteria</p>
          </div>

          {/* Search form */}
          <form
            onSubmit={handleSearch}
            className="max-w-3xl bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
          >
            <div className="flex items-center p-3">
              <Search className="h-5 w-5 text-emerald-500 ml-2 mr-3" />
              <Input
                className="border-none flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
                placeholder="Refine your search..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                size="sm"
                disabled={isSearching}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-4"
              >
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Search"}
              </Button>
            </div>
            <div className="border-t px-4 py-2 flex items-center text-sm text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <Filter className="h-4 w-4 mr-2 text-emerald-500" />
              <span className="font-medium">Advanced Filters</span>
            </div>
          </form>
        </div>
      </section>

      {/* Results section */}
      <section className="px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Results count */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              {displayedProducts.length > 0
                ? `Showing ${displayedProducts.length} results`
                : isLoading && page === 1
                  ? "Searching..."
                  : "No products found"}
            </p>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-gray-600">
                Sort by: <span className="font-medium ml-1">Relevance</span>
              </Button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              Error: {error}. Please try again.
            </div>
          )}

          {/* Products grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Display products */}
            {displayedProducts.map((product, index) => {
              // If this is the last item, attach the ref for infinite scroll
              if (displayedProducts.length === index + 1) {
                return (
                  <motion.div
                    ref={lastProductElementRef}
                    key={product.id}
                    variants={itemVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Link href={`/products/${product.id}`} className="block h-full">
                      <ProductCard
                        name={product.name}
                        brand={product.brand}
                        score={product.score}
                        ingredients={product.ingredients}
                        additives={product.additives}
                        naturalPercentage={product.naturalPercentage}
                        chemicalPercentage={product.chemicalPercentage}
                        effects={product.effects}
                      />
                    </Link>
                  </motion.div>
                )
              } else {
                return (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Link href={`/products/${product.id}`} className="block h-full">
                      <ProductCard
                        name={product.name}
                        brand={product.brand}
                        score={product.score}
                        ingredients={product.ingredients}
                        additives={product.additives}
                        naturalPercentage={product.naturalPercentage}
                        chemicalPercentage={product.chemicalPercentage}
                        effects={product.effects}
                      />
                    </Link>
                  </motion.div>
                )
              }
            })}

            {/* Loading skeletons - show when loading more products */}
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

          {/* Initial loading state */}
          {isLoading && page === 1 && displayedProducts.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={`initial-loading-${i}`} className="h-[180px] w-full rounded-xl" />
                ))}
            </div>
          )}

          {/* No results message */}
          {!isLoading && displayedProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                We couldn't find any products matching "{searchQuery}". Try using different keywords or browse our
                categories.
              </p>
              <Link href="/">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Return to Home</Button>
              </Link>
            </div>
          )}

          {/* Loading indicator at bottom */}
          {isLoading && page > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2 text-emerald-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading more products...</span>
              </div>
            </div>
          )}

          {/* End of results message */}
          {!isLoading && !hasMore && displayedProducts.length > 0 && (
            <div className="text-center mt-12 py-8 border-t border-gray-200">
              <p className="text-gray-600">You've reached the end of the results</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}