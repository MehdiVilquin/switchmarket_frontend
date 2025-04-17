"use client"
import { useState, memo } from "react"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import FilterSidebar from "./FilterSidebar"

const MobileFilterButton = memo(function MobileFilterButton({
    onFilterChange,
    activeFilters,
    onClearFilters,
    isFilterActive,
}) {
    const [isOpen, setIsOpen] = useState(false)

    const activeFiltersCount = Object.values(activeFilters).flat().length

    return (
        <>
            <Button variant="outline" size="sm" className="md:hidden flex items-center gap-2" onClick={() => setIsOpen(true)}>
                <Filter className="h-4 w-4" />
                Filtres
                {activeFiltersCount > 0 && (
                    <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {activeFiltersCount}
                    </span>
                )}
            </Button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsOpen(false)} />
                    <FilterSidebar
                        onFilterChange={onFilterChange}
                        activeFilters={activeFilters}
                        onClearFilters={onClearFilters}
                        isFilterActive={isFilterActive}
                        isMobile={true}
                        onCloseMobile={() => setIsOpen(false)}
                    />
                </>
            )}
        </>
    )
})

export default MobileFilterButton
