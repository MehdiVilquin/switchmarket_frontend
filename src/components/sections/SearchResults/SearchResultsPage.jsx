"use client"

import { memo, useState, useEffect } from "react"
import SearchHeader from "@/components/sections/SearchResults/SearchHeader"
import ResultsGrid from "@/components/sections/SearchResults/ResultsGrid"
import NoResults from "@/components/sections/SearchResults/NoResults"
import FilterSidebar from "@/components/sections/SearchResults/FilterSidebar"
import PromoBanner from "@/components/sections/SearchResults/PromoBanner"
import SortDropdown from "@/components/sections/SearchResults/SortDropdown"
import MobileFilterButton from "@/components/sections/SearchResults/MobileFilterButton"
import { Loader2 } from "lucide-react"

import useSearchFilters from "@/lib/hooks/useSearchFilters"
import useSearchProducts from "@/lib/hooks/useSearchProducts"
import useProductFiltering from "@/lib/hooks/useProductFiltering"
import useFilterData from "@/lib/hooks/useFilterData"

// Skeleton pendant le chargement initial
const LoadingState = memo(function LoadingState() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array(8)
                .fill(0)
                .map((_, i) => (
                    <div key={`loading-${i}`} className="h-[180px] w-full rounded-xl bg-gray-200 animate-pulse" />
                ))}
        </div>
    )
})

const LoadingIndicator = memo(function LoadingIndicator() {
    return (
        <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2 text-emerald-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Chargement de plus de produits...</span>
            </div>
        </div>
    )
})

const EndOfResults = memo(function EndOfResults() {
    return (
        <div className="text-center mt-12 py-8 border-t border-gray-200">
            <p className="text-gray-600">Vous avez atteint la fin des résultats</p>
        </div>
    )
})

export default function SearchResultsPage() {
    const {
        searchQuery,
        activeFilters,
        sortOption,
        apiParams,
        handleFilterChange,
        handleClearFilters,
        handleSortChange,
        isFilterActive,
    } = useSearchFilters()

    const {
        products,
        isLoading,
        hasMore,
        error,
        page,
        setPage,
        loadProducts,
    } = useSearchProducts(apiParams)

    const {
        brands,
        labels,
        ingredients,
        additives,
        isLoading: isFilterDataLoading,
        error: filterError,
    } = useFilterData()

    const displayedProducts = useProductFiltering(products, activeFilters, sortOption)

    // État pour suivre si les filtres ont été chargés au moins une fois
    const [filtersLoaded, setFiltersLoaded] = useState(false)

    // Mettre à jour l'état des filtres chargés
    useEffect(() => {
        if (!isFilterDataLoading && (brands.length > 0 || labels.length > 0 || ingredients.length > 0 || additives.length > 0)) {
            setFiltersLoaded(true)
        }
    }, [isFilterDataLoading, brands, labels, ingredients, additives])

    return (
        <main className="min-h-screen bg-gray-50 pb-16">
            <SearchHeader searchQuery={searchQuery} />

            <section className="px-4 md:px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    <PromoBanner />

                    <div className="mb-6 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <p className="text-gray-600">
                                {displayedProducts.length > 0
                                    ? `Affichage de ${displayedProducts.length} résultats`
                                    : isLoading && page === 1
                                        ? "Recherche en cours..."
                                        : "Aucun produit trouvé"}
                            </p>
                            <MobileFilterButton
                                onFilterChange={handleFilterChange}
                                activeFilters={activeFilters}
                                onClearFilters={handleClearFilters}
                                isFilterActive={isFilterActive}
                            />
                        </div>
                        <SortDropdown onSortChange={handleSortChange} currentSort={sortOption} />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            Erreur: {error}. Veuillez réessayer.
                        </div>
                    )}

                    {filterError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            Erreur filtres: {filterError}. Veuillez réessayer.
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
                        <div className="hidden md:block">
                            {isFilterDataLoading ? (
                                <div className="text-center text-gray-400">Chargement des filtres...</div>
                            ) : !filtersLoaded ? (
                                <div className="text-center text-gray-400">Initialisation des filtres...</div>
                            ) : (
                                <FilterSidebar
                                    brands={brands}
                                    labels={labels}
                                    ingredients={ingredients}
                                    additives={additives}
                                    onFilterChange={handleFilterChange}
                                    activeFilters={activeFilters}
                                    onClearFilters={handleClearFilters}
                                    isFilterActive={isFilterActive}
                                />
                            )}
                        </div>

                        <div>
                            {displayedProducts.length > 0 && (
                                <ResultsGrid
                                    products={displayedProducts}
                                    isLoading={isLoading}
                                    hasMore={hasMore}
                                    page={page}
                                    loadMore={(nextPage) => {
                                        setPage(nextPage)
                                        loadProducts(nextPage)
                                    }}
                                />
                            )}

                            {isLoading && page === 1 && displayedProducts.length === 0 && <LoadingState />}
                            {!isLoading && displayedProducts.length === 0 && <NoResults query={searchQuery} />}
                            {!isLoading && !hasMore && displayedProducts.length > 0 && <EndOfResults />}
                            {isLoading && page > 1 && <LoadingIndicator />}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
