import { useState, useRef, useEffect, useCallback } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
const PRODUCTS_PER_PAGE = 10
const MAX_RETRIES = 3

export default function useSearchProducts(searchQuery) {
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [error, setError] = useState(null)
    const [retryCount, setRetryCount] = useState(0)

    const loadedPagesRef = useRef(new Set())
    const currentQueryRef = useRef("")

    const loadProducts = useCallback(
        async (pageNum = 1, query = searchQuery) => {
            if (isLoading || !query) return
            const pageKey = `${query}-${pageNum}`
            if (loadedPagesRef.current.has(pageKey)) return

            setIsLoading(true)
            setError(null)

            try {
                const response = await fetch(
                    `${API_URL}/products?all=${encodeURIComponent(query)}&page=${pageNum}&limit=${PRODUCTS_PER_PAGE}`
                )
                if (!response.ok) throw new Error(`API error: ${response.status}`)
                const data = await response.json()

                if (data.result && data.products?.length) {
                    const processed = data.products.map(p => ({
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
                    setProducts(prev => pageNum === 1 ? processed : [...prev, ...processed])
                    setHasMore(data.pagination ? pageNum < data.pagination.pages : data.products.length >= PRODUCTS_PER_PAGE)
                    loadedPagesRef.current.add(pageKey)
                    setRetryCount(0)
                } else {
                    if (pageNum === 1) setProducts([])
                    setHasMore(false)
                }
            } catch (err) {
                if (retryCount < MAX_RETRIES) {
                    setRetryCount(prev => prev + 1)
                    setTimeout(() => loadProducts(pageNum, query), 1000)
                } else {
                    setError(err.message)
                }
            } finally {
                setIsLoading(false)
            }
        },
        [isLoading, retryCount, searchQuery]
    )

    const resetSearch = useCallback(() => {
        setProducts([])
        setPage(1)
        setHasMore(true)
        setRetryCount(0)
        loadedPagesRef.current.clear()
    }, [])

    useEffect(() => {
        if (searchQuery && currentQueryRef.current !== searchQuery) {
            currentQueryRef.current = searchQuery
            resetSearch()
            loadProducts(1, searchQuery)
        }
    }, [searchQuery, resetSearch, loadProducts])

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
