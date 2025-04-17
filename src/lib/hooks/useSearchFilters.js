"use client"
import { useState, useCallback, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const parseFiltersFromSearchParams = (params) => {
    const filters = {}

    if (params.get("brand")) filters.brand = params.get("brand").split(",")
    if (params.get("label")) filters.label = params.get("label").split(",")
    if (params.get("ingredient")) filters.ingredient = params.get("ingredient").split(",")
    if (params.get("additive")) filters.additive = params.get("additive").split(",")

    const min = parseInt(params.get("naturalMin"))
    const max = parseInt(params.get("naturalMax"))
    if (!isNaN(min) && !isNaN(max)) {
        filters.naturalPercentage = [[min, max]]
    }

    return filters
}

export default function useSearchFilters({ defaultSort = "relevance", debounceMs = 300 } = {}) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // 🚨 S'assurer que le hook ne s'exécute que quand les searchParams sont bien disponibles (côté client)
    const isReady = typeof window !== "undefined" && searchParams?.toString().length > 0

    const searchQuery = isReady ? searchParams.get("q") || "" : ""

    const [activeFilters, setActiveFilters] = useState({})
    const [sortOption, setSortOption] = useState(defaultSort)

    // Initialiser les filtres et le tri **une fois que searchParams est prêt**
    useEffect(() => {
        if (!isReady) return

        setActiveFilters(parseFiltersFromSearchParams(searchParams))
        const sortFromParams = searchParams.get("sort")
        if (sortFromParams) {
            setSortOption(sortFromParams)
        }
    }, [isReady, searchParams])

    const apiParams = useMemo(() => {
        return {
            all: searchQuery || undefined,
            ...(activeFilters.brand?.length ? { brand: activeFilters.brand.join(",") } : {}),
            ...(activeFilters.label?.length ? { label: activeFilters.label.join(",") } : {}),
            ...(activeFilters.ingredient?.length ? { ingredient: activeFilters.ingredient.join(",") } : {}),
            ...(activeFilters.additive?.length ? { additive: activeFilters.additive.join(",") } : {}),
            // naturalPercentage peut être ignoré si non supporté côté backend
        }
    }, [searchQuery, activeFilters])

    const updateUrlWithFilters = useCallback(() => {
        const params = new URLSearchParams()

        if (searchQuery) params.set("q", searchQuery)
        if (activeFilters.brand?.length) params.set("brand", activeFilters.brand.join(","))
        if (activeFilters.label?.length) params.set("label", activeFilters.label.join(","))
        if (activeFilters.ingredient?.length) params.set("ingredient", activeFilters.ingredient.join(","))
        if (activeFilters.additive?.length) params.set("additive", activeFilters.additive.join(","))

        if (activeFilters.naturalPercentage?.length) {
            const [min, max] = activeFilters.naturalPercentage[0]
            params.set("naturalMin", min.toString())
            params.set("naturalMax", max.toString())
        }

        if (sortOption !== defaultSort) params.set("sort", sortOption)

        router.replace(`/searchResults?${params.toString()}`, { scroll: false })
    }, [activeFilters, sortOption, searchQuery, router, defaultSort])

    // Mettre à jour l’URL quand les filtres changent
    useEffect(() => {
        if (!isReady) return
        const timer = setTimeout(() => {
            updateUrlWithFilters()
        }, debounceMs)

        return () => clearTimeout(timer)
    }, [updateUrlWithFilters, debounceMs, isReady])

    const handleFilterChange = useCallback((type, value, checked) => {
        setActiveFilters((prev) => {
            const current = { ...prev }
            const isArray = Array.isArray(value)

            if (checked) {
                if (type === "naturalPercentage") {
                    current[type] = [value]
                } else {
                    const valuesToAdd = isArray ? value : [value]
                    current[type] = Array.from(new Set([...(current[type] || []), ...valuesToAdd]))
                }
            } else {
                if (type === "naturalPercentage") {
                    delete current[type]
                } else {
                    const valuesToRemove = isArray ? value : [value]
                    const updated = (current[type] || []).filter((v) => !valuesToRemove.includes(v))
                    if (updated.length > 0) {
                        current[type] = updated
                    } else {
                        delete current[type]
                    }
                }
            }

            return current
        })
    }, [])

    const handleClearFilters = useCallback(() => {
        setActiveFilters({})
    }, [])

    const handleSortChange = useCallback((option) => {
        setSortOption(option)
    }, [])

    const isFilterActive = useCallback(
        (type, value) => {
            if (!activeFilters[type]) return false

            if (type === "naturalPercentage") {
                return activeFilters[type].some(
                    (range) => Array.isArray(range) && range[0] === value[0] && range[1] === value[1],
                )
            }

            return activeFilters[type].includes(value)
        },
        [activeFilters],
    )

    return {
        searchQuery,
        activeFilters,
        sortOption,
        apiParams,
        handleFilterChange,
        handleClearFilters,
        handleSortChange,
        isFilterActive,
    }
}
