"use client"

import { memo } from "react"
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

// Composant pour afficher le statut de chargement
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

// Composant pour afficher l'indicateur de chargement en bas de page
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

// Composant pour afficher la fin des résultats
const EndOfResults = memo(function EndOfResults() {
  return (
    <div className="text-center mt-12 py-8 border-t border-gray-200">
      <p className="text-gray-600">Vous avez atteint la fin des résultats</p>
    </div>
  )
})

// Composant principal de la page de résultats de recherche
export default function SearchResultsPage() {
  // Utiliser les hooks personnalisés pour gérer les filtres et les produits
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


  const { products, isLoading, hasMore, error, page, setPage, loadProducts } = useSearchProducts(apiParams)

  // Filtrer et trier les produits
  const displayedProducts = useProductFiltering(products, activeFilters, sortOption)

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <SearchHeader searchQuery={searchQuery} />

      <section className="px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Bannière promotionnelle */}
          <PromoBanner />

          {/* Résumé du nombre de résultats et tri */}
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

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              Erreur: {error}. Veuillez réessayer.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            {/* Barre latérale avec filtres - cachée sur mobile */}
            <div className="hidden md:block">
              <FilterSidebar
                onFilterChange={handleFilterChange}
                activeFilters={activeFilters}
                onClearFilters={handleClearFilters}
                isFilterActive={isFilterActive}
              />
            </div>

            {/* Zone de contenu principal */}
            <div>
              {/* Grille des produits */}
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

              {/* Chargement initial (aucun produit encore affiché) */}
              {isLoading && page === 1 && displayedProducts.length === 0 && <LoadingState />}

              {/* Aucun résultat */}
              {!isLoading && displayedProducts.length === 0 && <NoResults query={searchQuery} />}

              {/* Fin de liste */}
              {!isLoading && !hasMore && displayedProducts.length > 0 && <EndOfResults />}

              {/* Indicateur de chargement bas de page */}
              {isLoading && page > 1 && <LoadingIndicator />}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
