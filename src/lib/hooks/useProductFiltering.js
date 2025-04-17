"use client"
import { useMemo } from "react"

/**
 * Hook personnalisé pour filtrer et trier les produits
 * @param {Array} products - Liste des produits à filtrer
 * @param {Object} activeFilters - Filtres actifs
 * @param {string} sortOption - Option de tri
 * @returns {Array} - Produits filtrés et triés
 */

export default function useProductFiltering(products, activeFilters, sortOption = "relevance") {
    return useMemo(() => {
        if (!products?.length) return []

        const filterByBrand = (list) =>
            activeFilters.brand?.length
                ? list.filter((p) => activeFilters.brand.includes(p.brands))
                : list

        const filterByLabel = (list) =>
            activeFilters.label?.length
                ? list.filter((p) => p.labeltags?.some((l) => activeFilters.label.includes(l)))
                : list

        const filterByIngredient = (list) =>
            activeFilters.ingredient?.length
                ? list.filter((p) =>
                    p.ingredients?.some((i) =>
                        activeFilters.ingredient.some((ing) => i.text?.includes(ing)),
                    ),
                )
                : list

        const filterByAdditive = (list) =>
            activeFilters.additive?.length
                ? list.filter((p) =>
                    p.additives?.some((a) => activeFilters.additive.includes(a.tag)),
                )
                : list

        const filterByNaturalPercentage = (list) => {
            const range = activeFilters.naturalPercentage?.[0]
            if (!Array.isArray(range) || range.length !== 2) return list
            const [min, max] = range
            return list.filter((p) => {
                const val = p.naturalPercentage || 0
                return val >= min && val <= max
            })
        }

        let result = [...products]
        result = filterByBrand(result)
        result = filterByLabel(result)
        result = filterByIngredient(result)
        result = filterByAdditive(result)
        result = filterByNaturalPercentage(result)

        // Tri
        if (sortOption && sortOption !== "relevance") {
            result.sort((a, b) => {
                switch (sortOption) {
                    case "natural-high":
                        return (b.naturalPercentage || 0) - (a.naturalPercentage || 0)
                    case "natural-low":
                        return (a.naturalPercentage || 0) - (b.naturalPercentage || 0)
                    case "chemical-high":
                        return (b.chemicalPercentage || 0) - (a.chemicalPercentage || 0)
                    case "chemical-low":
                        return (a.chemicalPercentage || 0) - (b.chemicalPercentage || 0)
                    default:
                        return 0
                }
            })
        }

        return result
    }, [products, activeFilters, sortOption])
}
