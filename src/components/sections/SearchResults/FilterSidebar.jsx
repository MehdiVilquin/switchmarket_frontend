"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, X } from "lucide-react"

export default function FilterSidebar({ onFiltersChange }) {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [labels, setLabels] = useState({})
    const [categories, setCategories] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // Selected filters state
    const [selectedBrands, setSelectedBrands] = useState([])
    const [selectedLabels, setSelectedLabels] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])

    // Replace the hardcoded popularBrands array and add a state for brands
    const [brands, setBrands] = useState([])

    // Fetch labels and categories on mount
    useEffect(() => {
        const fetchFiltersData = async () => {
            setIsLoading(true)
            setError(null)

            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

                // Fetch labels
                const labelsResponse = await fetch(`${API_URL}/labels`)
                if (!labelsResponse.ok) {
                    throw new Error(`API error: ${labelsResponse.status}`)
                }
                const labelsData = await labelsResponse.json()

                if (labelsData.result) {
                    setLabels(labelsData.labels || {})
                    setCategories(labelsData.categories || {})
                }

                // Fetch unique brands from products
                const brandsResponse = await fetch(`${API_URL}/products/brands`)
                if (brandsResponse.ok) {
                    const brandsData = await brandsResponse.json()
                    if (brandsData.result) {
                        setBrands(brandsData.brands || [])
                    }
                } else {
                    // If the brands endpoint doesn't exist, fetch some products and extract brands
                    const productsResponse = await fetch(`${API_URL}/products/random/50`)
                    if (productsResponse.ok) {
                        const productsData = await productsResponse.json()
                        if (productsData.result && productsData.products) {
                            // Extract unique brands from products
                            const uniqueBrands = [
                                ...new Set(
                                    productsData.products
                                        .map((p) => p.brands)
                                        .filter(Boolean)
                                        .flatMap((brand) => brand.split(",").map((b) => b.trim()))
                                        .filter((b) => b.length > 0),
                                ),
                            ]
                            setBrands(uniqueBrands)
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching filters data:", err)
                setError(err.message || "Error loading filters")
            } finally {
                setIsLoading(false)
            }
        }

        fetchFiltersData()
    }, [])

    // Initialize filters from URL params
    useEffect(() => {
        const brands = searchParams.get("brand")?.split(",") || []
        const labelIds = searchParams.get("labels")?.split(",") || []
        const categoryIds = searchParams.get("categories")?.split(",") || []

        setSelectedBrands(brands)
        setSelectedLabels(labelIds)
        setSelectedCategories(categoryIds)
    }, [searchParams])

    // Update URL and notify parent when filters change
    const updateFilters = () => {
        const params = new URLSearchParams(searchParams.toString())

        // Update brand parameter
        if (selectedBrands.length > 0) {
            params.set("brand", selectedBrands.join(","))
        } else {
            params.delete("brand")
        }

        // Update labels parameter
        if (selectedLabels.length > 0) {
            params.set("labels", selectedLabels.join(","))
        } else {
            params.delete("labels")
        }

        // Update categories parameter
        if (selectedCategories.length > 0) {
            params.set("categories", selectedCategories.join(","))
        } else {
            params.delete("categories")
        }

        // Keep the search query if it exists
        const query = searchParams.get("q")
        if (query) {
            params.set("q", query)
        }

        // Update URL
        router.replace(`/searchResults?${params.toString()}`, { scroll: false })

        // Notify parent component
        if (onFiltersChange) {
            onFiltersChange({
                brand: selectedBrands.length > 0 ? selectedBrands.join(",") : null,
                labels: selectedLabels.length > 0 ? selectedLabels.join(",") : null,
                categories: selectedCategories.length > 0 ? selectedCategories.join(",") : null,
            })
        }
    }

    // Toggle brand selection
    const toggleBrand = (brand) => {
        setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
    }

    // Toggle label selection
    const toggleLabel = (labelId) => {
        setSelectedLabels((prev) => (prev.includes(labelId) ? prev.filter((id) => id !== labelId) : [...prev, labelId]))
    }

    // Toggle category selection
    const toggleCategory = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
        )
    }

    // Clear all filters
    const clearAllFilters = () => {
        setSelectedBrands([])
        setSelectedLabels([])
        setSelectedCategories([])

        const params = new URLSearchParams(searchParams.toString())
        params.delete("brand")
        params.delete("labels")
        params.delete("categories")

        // Keep the search query if it exists
        const query = searchParams.get("q")
        if (query) {
            params.set("q", query)
        }

        router.replace(`/searchResults?${params.toString()}`, { scroll: false })

        if (onFiltersChange) {
            onFiltersChange({
                brand: null,
                labels: null,
                categories: null,
            })
        }
    }

    // Apply filters when user clicks the button
    const applyFilters = () => {
        updateFilters()
    }

    // Count total active filters
    const activeFiltersCount = selectedBrands.length + selectedLabels.length + selectedCategories.length

    return (
        <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Filters</h2>
                {activeFiltersCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                    >
                        <X className="w-4 h-4 mr-1" />
                        Clear all
                    </Button>
                )}
            </div>

            {isLoading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                </div>
            ) : error ? (
                <div className="text-red-500 text-sm py-4">Error loading filters: {error}</div>
            ) : (
                <div className="space-y-4">
                    {/* Brands filter */}
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="brands">
                            <AccordionTrigger className="text-base">Brands</AccordionTrigger>
                            <AccordionContent>
                                <div className="grid gap-2 max-h-60 overflow-y-auto pr-2">
                                    {brands.length > 0 ? (
                                        brands.map((brand) => (
                                            <Label key={brand} className="flex items-center gap-2 font-normal cursor-pointer">
                                                <Checkbox
                                                    id={`brand-${brand}`}
                                                    checked={selectedBrands.includes(brand)}
                                                    onCheckedChange={() => toggleBrand(brand)}
                                                />
                                                {brand}
                                            </Label>
                                        ))
                                    ) : (
                                        <div className="text-sm text-gray-500 py-2">No brands available</div>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {/* Categories filter */}
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="categories">
                            <AccordionTrigger className="text-base">Categories</AccordionTrigger>
                            <AccordionContent>
                                <div className="grid gap-2 max-h-60 overflow-y-auto pr-2">
                                    {Object.keys(categories).map((category) => (
                                        <Label key={category} className="flex items-center gap-2 font-normal cursor-pointer">
                                            <Checkbox
                                                id={`category-${category}`}
                                                checked={selectedCategories.includes(category)}
                                                onCheckedChange={() => toggleCategory(category)}
                                            />
                                            {category}
                                        </Label>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {/* Labels filter */}
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="labels">
                            <AccordionTrigger className="text-base">Labels</AccordionTrigger>
                            <AccordionContent>
                                <div className="grid gap-2 max-h-60 overflow-y-auto pr-2">
                                    {Object.entries(labels).map(([id, label]) => (
                                        <Label key={id} className="flex items-center gap-2 font-normal cursor-pointer">
                                            <Checkbox
                                                id={`label-${id}`}
                                                checked={selectedLabels.includes(id)}
                                                onCheckedChange={() => toggleLabel(id)}
                                            />
                                            {label.canonical}
                                        </Label>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <Button onClick={applyFilters} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                        Apply Filters
                        {activeFiltersCount > 0 && (
                            <span className="ml-2 bg-emerald-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {activeFiltersCount}
                            </span>
                        )}
                    </Button>
                </div>
            )}
        </div>
    )
}
