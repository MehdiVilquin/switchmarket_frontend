"use client"
import { useState, useRef, useEffect, useCallback } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
const PRODUCTS_PER_PAGE = 12

/**
 * Hook for searching and filtering products
 * @param {string} searchQuery - Text search query
 * @param {Object} filterParams - Additional filter parameters
 * @returns {Object} - State and functions to manage products
 */
export default function useSearchProducts(searchQuery = "", filterParams = {}) {
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [error, setError] = useState(null)

    // References to track loaded pages and current parameters
    const loadedPagesRef = useRef(new Set())
    const abortControllerRef = useRef(null)
    const isMountedRef = useRef(true)

    // Combine search query and filter params
    const allParams = useRef({
        ...(searchQuery ? { all: searchQuery } : {}),
        ...filterParams,
    })

    // Function to load products
    const loadProducts = useCallback(
        async (pageNum = 1, params = allParams.current) => {
            if (isLoading) return

            // Cancel any previous request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }

            // Create a new abort controller
            abortControllerRef.current = new AbortController()
            const signal = abortControllerRef.current.signal

            // Create a unique key for this page and params combination
            const paramsKey = JSON.stringify(params)
            const pageKey = `${paramsKey}-${pageNum}`

            // Skip if this page was already loaded with the same params
            if (loadedPagesRef.current.has(pageKey)) return

            setIsLoading(true)
            setError(null)

            try {
                // Build URL with all search parameters
                // Filter out undefined or null parameters
                const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null && v !== ""))

                const queryParams = new URLSearchParams({
                    page: pageNum,
                    limit: PRODUCTS_PER_PAGE,
                    ...cleanParams,
                })

                // If no parameters are provided, load random products
                const endpoint =
                    Object.keys(cleanParams).length === 0
                        ? `${API_URL}/products/random/${PRODUCTS_PER_PAGE}`
                        : `${API_URL}/products?${queryParams.toString()}`

                console.log("Fetching products from:", endpoint)

                const response = await fetch(endpoint, { signal })

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`)
                }

                const data = await response.json()

                if (!isMountedRef.current) return

                if (data.result && data.products?.length) {
                    // Process products to ensure consistent structure
                    const processed = data.products.map((p) => ({
                        id: p._id || `product-${Math.random().toString(36).substr(2, 9)}`,
                        name: p.product_name || "Unnamed Product",
                        brands: p.brands || "Unknown Brand",
                        score: p.completion_score || 0,
                        ingredients: p.ingredients || [],
                        additives: p.additives || [],
                        labeltags: p.labeltags || [],
                        naturalPercentage: p.naturalPercentage || 0,
                        chemicalPercentage: p.chemicalPercentage || 0,
                        effects: p.effects || [],
                        image: p.image || "/placeholder.svg?height=200&width=200",
                    }))

                    setProducts((prev) => {
                        // If params changed or it's the first page, replace products
                        if (pageNum === 1) {
                            return processed
                        }
                        // Otherwise, add to existing list avoiding duplicates
                        const existingIds = new Set(prev.map((p) => p.id))
                        const newProducts = processed.filter((p) => !existingIds.has(p.id))
                        return [...prev, ...newProducts]
                    })

                    setHasMore(data.pagination ? pageNum < data.pagination.pages : data.products.length >= PRODUCTS_PER_PAGE)
                    loadedPagesRef.current.add(pageKey)
                } else {
                    if (pageNum === 1) {
                        setProducts([])
                    }
                    setHasMore(false)
                }
            } catch (err) {
                // Don't handle abort errors
                if (err.name === "AbortError") return
                if (!isMountedRef.current) return

                console.error("Error loading products:", err)
                setError(err.message || "Error loading products")
            } finally {
                if (isMountedRef.current && !signal.aborted) {
                    setIsLoading(false)
                }
            }
        },
        [isLoading],
    )

    // Function to reset search
    const resetSearch = useCallback(() => {
        setProducts([])
        setPage(1)
        setHasMore(true)
        loadedPagesRef.current.clear()
    }, [])

    // Update params when search query or filters change
    useEffect(() => {
        const newParams = {
            ...(searchQuery ? { all: searchQuery } : {}),
            ...filterParams,
        }

        const newParamsKey = JSON.stringify(newParams)
        const currentParamsKey = JSON.stringify(allParams.current)

        if (newParamsKey !== currentParamsKey) {
            allParams.current = newParams
            resetSearch()
            loadProducts(1, newParams)
        }
    }, [searchQuery, filterParams, resetSearch, loadProducts])

    // Load initial products
    useEffect(() => {
        isMountedRef.current = true
        loadProducts(1, allParams.current)

        // Clean up requests on unmount
        return () => {
            isMountedRef.current = false
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [])

    return {
        products,
        isLoading,
        hasMore,
        error,
        page,
        setPage,
        loadProducts,
        resetSearch,
    }
}
