"use client"
import { useState, useEffect, useCallback, memo } from "react"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import useFilterData from "@/lib/hooks/useFilterData"

// Composant pour une section de filtre
const FilterSection = memo(function FilterSection({ title, isExpanded, onToggle, children }) {
    return (
        <div className="mb-6 border-b border-gray-100 pb-4">
            <button
                className="flex justify-between items-center w-full text-left mb-3"
                onClick={onToggle}
                type="button"
                aria-expanded={isExpanded}
            >
                <h4 className="font-medium text-gray-800">{title}</h4>
                {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
            </button>

            {isExpanded && children}
        </div>
    )
})

// Composant pour un élément de filtre avec checkbox
const FilterItem = memo(function FilterItem({ id, name, count, isChecked, onChange }) {
    return (
        <div className="flex items-center">
            <Checkbox
                id={id}
                className="mr-2 text-emerald-500 border-gray-300"
                checked={isChecked}
                onCheckedChange={(checked) => onChange(!!checked)}
            />
            <label htmlFor={id} className="text-sm text-gray-700 flex-1 cursor-pointer">
                {name}
            </label>
            {count !== undefined && <span className="text-xs text-gray-500">({count})</span>}
        </div>
    )
})

// Composant principal de la barre latérale de filtres
const FilterSidebar = memo(function FilterSidebar({
    onFilterChange,
    activeFilters = {},
    onClearFilters,
    isFilterActive,
    isMobile,
    onCloseMobile,
}) {
    const [expandedCategories, setExpandedCategories] = useState({
        brands: true,
        labels: true,
        ingredients: true,
        additives: true,
        naturalPercentage: true,
    })

    const [naturalRange, setNaturalRange] = useState([0, 100])
    const [brandSearch, setBrandSearch] = useState("")
    const [ingredientSearch, setIngredientSearch] = useState("")
    const [additiveSearch, setAdditiveSearch] = useState("")

    // Utiliser le hook personnalisé pour charger les données des filtres
    const { brands, labels, ingredients, additives, isLoading } = useFilterData()

    // Mettre à jour le slider quand les filtres actifs changent
    useEffect(() => {
        if (activeFilters.naturalPercentage && activeFilters.naturalPercentage.length > 0) {
            setNaturalRange(activeFilters.naturalPercentage[0])
        } else {
            setNaturalRange([0, 100])
        }
    }, [activeFilters])

    const toggleCategory = useCallback((category) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [category]: !prev[category],
        }))
    }, [])

    const handleFilterChange = useCallback(
        (type, value, checked) => {
            onFilterChange(type, value, checked)
        },
        [onFilterChange],
    )

    const handleNaturalRangeChange = useCallback(
        (value) => {
            setNaturalRange(value)
            // Utiliser un délai pour éviter les mises à jour trop fréquentes
            const timer = setTimeout(() => {
                onFilterChange("naturalPercentage", value, true)
            }, 100)
            return () => clearTimeout(timer)
        },
        [onFilterChange],
    )

    // Filtrer les marques en fonction de la recherche
    const filteredBrands = brandSearch
        ? brands.filter((brand) => brand.name.toLowerCase().includes(brandSearch.toLowerCase()))
        : brands

    // Filtrer les ingrédients en fonction de la recherche
    const filteredIngredients = ingredientSearch
        ? ingredients.filter((ing) => ing.name.toLowerCase().includes(ingredientSearch.toLowerCase()))
        : ingredients

    // Filtrer les additifs en fonction de la recherche
    const filteredAdditives = additiveSearch
        ? additives.filter(
            (add) =>
                add.name.toLowerCase().includes(additiveSearch.toLowerCase()) ||
                add.tag.toLowerCase().includes(additiveSearch.toLowerCase()),
        )
        : additives

    const activeFiltersCount = Object.values(activeFilters).flat().length

    return (
        <div
            className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 ${isMobile ? "fixed inset-0 z-50 overflow-auto" : ""}`}
        >
            {isMobile && (
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <h3 className="font-semibold text-lg">Filtres</h3>
                    <Button variant="ghost" size="sm" onClick={onCloseMobile}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-800">Filtres</h3>
                {activeFiltersCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-emerald-600 hover:text-emerald-700 text-xs p-0 h-auto"
                        onClick={onClearFilters}
                    >
                        Tout effacer
                    </Button>
                )}
            </div>

            {activeFiltersCount > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                    {Object.entries(activeFilters).map(([type, values]) =>
                        values.map((value, index) => (
                            <Badge
                                key={`${type}-${index}-${typeof value === "object" ? value.join("-") : value}`}
                                variant="outline"
                                className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1"
                            >
                                {typeof value === "object" ? `${value[0]}-${value[1]}%` : value}
                                <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange(type, value, false)} />
                            </Badge>
                        )),
                    )}
                </div>
            )}

            {isLoading ? (
                <div className="py-8 text-center text-gray-500">Chargement des filtres...</div>
            ) : (
                <>
                    {/* Marques */}
                    <FilterSection
                        title="Marques"
                        isExpanded={expandedCategories.brands}
                        onToggle={() => toggleCategory("brands")}
                    >
                        <div className="space-y-3">
                            <Input
                                placeholder="Rechercher une marque..."
                                value={brandSearch}
                                onChange={(e) => setBrandSearch(e.target.value)}
                                className="mb-2"
                            />
                            <div className="max-h-48 overflow-y-auto space-y-2">
                                {filteredBrands.length > 0 ? (
                                    filteredBrands.map((brand) => (
                                        <FilterItem
                                            key={brand.id}
                                            id={brand.id}
                                            name={brand.name}
                                            count={brand.count}
                                            isChecked={isFilterActive("brand", brand.name)}
                                            onChange={(checked) => handleFilterChange("brand", brand.name, checked)}
                                        />
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">Aucune marque trouvée</p>
                                )}
                            </div>
                        </div>
                    </FilterSection>

                    {/* Labels */}
                    <FilterSection
                        title="Labels"
                        isExpanded={expandedCategories.labels}
                        onToggle={() => toggleCategory("labels")}
                    >
                        <div className="max-h-48 overflow-y-auto space-y-2">
                            {labels.length > 0 ? (
                                labels.map((label) => (
                                    <FilterItem
                                        key={label.id}
                                        id={label.id}
                                        name={label.name}
                                        count={label.count}
                                        isChecked={isFilterActive("label", label.name)}
                                        onChange={(checked) => handleFilterChange("label", label.name, checked)}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">Aucun label trouvé</p>
                            )}
                        </div>
                    </FilterSection>

                    {/* Ingrédients */}
                    <FilterSection
                        title="Ingrédients"
                        isExpanded={expandedCategories.ingredients}
                        onToggle={() => toggleCategory("ingredients")}
                    >
                        <div className="space-y-3">
                            <Input
                                placeholder="Rechercher un ingrédient..."
                                value={ingredientSearch}
                                onChange={(e) => setIngredientSearch(e.target.value)}
                                className="mb-2"
                            />
                            <div className="max-h-48 overflow-y-auto space-y-2">
                                {filteredIngredients.length > 0 ? (
                                    filteredIngredients.map((ingredient) => (
                                        <FilterItem
                                            key={ingredient.id}
                                            id={ingredient.id}
                                            name={ingredient.name}
                                            count={ingredient.count}
                                            isChecked={isFilterActive("ingredient", ingredient.name)}
                                            onChange={(checked) => handleFilterChange("ingredient", ingredient.name, checked)}
                                        />
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">Aucun ingrédient trouvé</p>
                                )}
                            </div>
                        </div>
                    </FilterSection>

                    {/* Additifs */}
                    <FilterSection
                        title="Additifs"
                        isExpanded={expandedCategories.additives}
                        onToggle={() => toggleCategory("additives")}
                    >
                        <div className="space-y-3">
                            <Input
                                placeholder="Rechercher un additif..."
                                value={additiveSearch}
                                onChange={(e) => setAdditiveSearch(e.target.value)}
                                className="mb-2"
                            />
                            <div className="max-h-48 overflow-y-auto space-y-2">
                                {filteredAdditives.length > 0 ? (
                                    filteredAdditives.map((additive) => (
                                        <FilterItem
                                            key={additive.id}
                                            id={additive.id}
                                            name={`${additive.name} (${additive.tag})`}
                                            isChecked={isFilterActive("additive", additive.tag)}
                                            onChange={(checked) => handleFilterChange("additive", additive.tag, checked)}
                                        />
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">Aucun additif trouvé</p>
                                )}
                            </div>
                        </div>
                    </FilterSection>

                    {/* Pourcentage naturel */}
                    <FilterSection
                        title="% Naturel"
                        isExpanded={expandedCategories.naturalPercentage}
                        onToggle={() => toggleCategory("naturalPercentage")}
                    >
                        <div className="px-1">
                            <div className="mb-4">
                                <Slider
                                    defaultValue={[0, 100]}
                                    max={100}
                                    step={1}
                                    value={naturalRange}
                                    onValueChange={handleNaturalRangeChange}
                                    className="text-emerald-500"
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="bg-gray-50 rounded px-2 py-1 text-sm text-gray-700">{naturalRange[0]}%</div>
                                <div className="bg-gray-50 rounded px-2 py-1 text-sm text-gray-700">{naturalRange[1]}%</div>
                            </div>
                        </div>
                    </FilterSection>
                </>
            )}

            {isMobile && (
                <div className="sticky bottom-0 bg-white pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="w-full" onClick={onClearFilters}>
                            Tout effacer
                        </Button>
                        <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" onClick={onCloseMobile}>
                            Appliquer
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
})

export default FilterSidebar
