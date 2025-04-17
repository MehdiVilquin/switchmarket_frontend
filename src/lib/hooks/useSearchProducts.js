"use client"
import { useState, useRef, useEffect, useCallback } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
const PRODUCTS_PER_PAGE = 12
const MAX_RETRIES = 3
const RETRY_DELAY = 1000

/**
 * Hook personnalisé pour charger et gérer les produits de recherche
 * @param {Object} searchParams - Paramètres de recherche pour l'API
 * @returns {Object} - État et fonctions pour gérer les produits
 */
export default function useSearchProducts(searchParams = {}) {
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [error, setError] = useState(null)
    const [retryCount, setRetryCount] = useState(0)

    // Références pour suivre les pages chargées et les paramètres actuels
    const loadedPagesRef = useRef(new Set())
    const currentParamsRef = useRef(JSON.stringify(searchParams))
    const abortControllerRef = useRef(null)
    const isMountedRef = useRef(true)

    // Fonction pour charger les produits
    const loadProducts = useCallback(
        async (pageNum = 1, params = searchParams) => {
            if (isLoading) return

            // Annuler toute requête précédente
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }

            // Créer un nouveau contrôleur d'abandon
            abortControllerRef.current = new AbortController()
            const signal = abortControllerRef.current.signal

            // Créer une clé unique pour cette combinaison de page et paramètres
            const paramsKey = JSON.stringify(params)
            const pageKey = `${paramsKey}-${pageNum}`

            if (loadedPagesRef.current.has(pageKey)) return

            setIsLoading(true)
            setError(null)

            try {
                // Construire l'URL avec tous les paramètres de recherche
                // Filtrer les paramètres undefined ou null
                const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null && v !== undefined))

                const queryParams = new URLSearchParams({
                    page: pageNum,
                    limit: PRODUCTS_PER_PAGE,
                    ...cleanParams,
                })

                // Si aucun paramètre n'est fourni, charger des produits aléatoires
                const endpoint =
                    Object.keys(cleanParams).length === 0
                        ? `${API_URL}/products/random/${PRODUCTS_PER_PAGE}`
                        : `${API_URL}/products?${queryParams.toString()}`

                const response = await fetch(endpoint, { signal })

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`)
                }

                const data = await response.json()

                if (!isMountedRef.current) return

                if (data.result && data.products?.length) {
                    // Assurer que chaque produit a un ID unique
                    const processed = data.products.map((p) => ({
                        id: p._id || `product-${Math.random().toString(36).substr(2, 9)}`,
                        name: p.product_name || "Produit sans nom",
                        brands: p.brands || "Marque inconnue",
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
                        // Si les paramètres ont changé ou c'est la première page, remplacer les produits
                        if (paramsKey !== currentParamsRef.current || pageNum === 1) {
                            return processed
                        }
                        // Sinon, ajouter à la liste existante en évitant les doublons
                        const existingIds = new Set(prev.map((p) => p.id))
                        const newProducts = processed.filter((p) => !existingIds.has(p.id))
                        return [...prev, ...newProducts]
                    })

                    setHasMore(data.pagination ? pageNum < data.pagination.pages : data.products.length >= PRODUCTS_PER_PAGE)
                    loadedPagesRef.current.add(pageKey)
                    setRetryCount(0)

                    // Mettre à jour les paramètres courants
                    if (paramsKey !== currentParamsRef.current) {
                        currentParamsRef.current = paramsKey
                        loadedPagesRef.current.clear()
                        loadedPagesRef.current.add(pageKey)
                    }
                } else {
                    if (pageNum === 1 || paramsKey !== currentParamsRef.current) {
                        setProducts([])
                        currentParamsRef.current = paramsKey
                    }
                    setHasMore(false)
                }
            } catch (err) {
                // Ne pas traiter les erreurs d'abandon
                if (err.name === "AbortError") return
                if (!isMountedRef.current) return

                console.error("Error loading products:", err)
                if (retryCount < MAX_RETRIES) {
                    setRetryCount((prev) => prev + 1)
                    setTimeout(() => loadProducts(pageNum, params), RETRY_DELAY)
                } else {
                    setError(err.message || "Erreur lors du chargement des produits")
                }
            } finally {
                if (isMountedRef.current && !signal.aborted) {
                    setIsLoading(false)
                }
            }
        },
        [isLoading, retryCount, searchParams],
    )

    // Fonction pour réinitialiser la recherche
    const resetSearch = useCallback(() => {
        setProducts([])
        setPage(1)
        setHasMore(true)
        setRetryCount(0)
        loadedPagesRef.current.clear()
    }, [])

    // Charger les produits quand les paramètres de recherche changent
    useEffect(() => {
        const paramsKey = JSON.stringify(searchParams)
        if (paramsKey !== currentParamsRef.current) {
            resetSearch()
            loadProducts(1, searchParams)
        }
    }, [searchParams, resetSearch, loadProducts])

    // Charger les produits initiaux - même sans paramètres de recherche
    useEffect(() => {
        isMountedRef.current = true
        loadProducts(1, searchParams)

        // Nettoyer les requêtes en cours lors du démontage
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
