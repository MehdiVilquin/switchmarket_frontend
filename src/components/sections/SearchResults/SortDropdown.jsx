"use client"
import { useState, useEffect, memo } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowUpDown } from "lucide-react"

const sortOptions = [
    { id: "relevance", label: "Pertinence" },
    { id: "natural-high", label: "% Naturel: élevé à faible" },
    { id: "natural-low", label: "% Naturel: faible à élevé" },
    { id: "chemical-high", label: "% Chimique: élevé à faible" },
    { id: "chemical-low", label: "% Chimique: faible à élevé" },
]

const SortDropdown = memo(function SortDropdown({ onSortChange, currentSort = "relevance" }) {
    const [sortOption, setSortOption] = useState(currentSort)

    // Synchroniser l'état local avec la prop
    useEffect(() => {
        if (currentSort !== sortOption) {
            setSortOption(currentSort)
        }
    }, [currentSort, sortOption])

    const handleSortChange = (option) => {
        setSortOption(option.id)
        onSortChange(option.id)
    }

    const currentSortLabel = sortOptions.find((option) => option.id === sortOption)?.label || "Pertinence"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-gray-600">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Trier par: <span className="font-medium ml-1">{currentSortLabel}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {sortOptions.map((option) => (
                    <DropdownMenuItem
                        key={option.id}
                        className={`cursor-pointer ${sortOption === option.id ? "bg-emerald-50 text-emerald-600 font-medium" : ""}`}
                        onClick={() => handleSortChange(option)}
                    >
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
})

export default SortDropdown
