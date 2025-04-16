import { Card, CardContent } from "@/components/ui/card"
import { Info, AlertCircle, Database } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function ProductCard({ name, brand, score, ingredients = [], additives = [] }) {
    // Calculate transparency score based on available data
    const getTransparencyLevel = () => {
        if (!ingredients.length && !additives.length) return "low"
        if (ingredients.length > 10 || additives.length > 3) return "high"
        return "medium"
    }

    const transparencyLevel = getTransparencyLevel()

    // Get appropriate styling based on transparency level
    const getTransparencyStyles = () => {
        switch (transparencyLevel) {
            case "high":
                return {
                    bgColor: "bg-blue-100",
                    textColor: "text-blue-800",
                    icon: <Info className="h-4 w-4" />,
                    label: "Detailed info",
                }
            case "medium":
                return {
                    bgColor: "bg-amber-100",
                    textColor: "text-amber-800",
                    icon: <AlertCircle className="h-4 w-4" />,
                    label: "Basic info",
                }
            case "low":
            default:
                return {
                    bgColor: "bg-gray-100",
                    textColor: "text-gray-600",
                    icon: <AlertCircle className="h-4 w-4" />,
                    label: "Limited info",
                }
        }
    }

    const transparencyStyles = getTransparencyStyles()

    // Calculate completion percentage from string
    const completionPercentage = Number.parseFloat(score) || 0

    return (
        <Card className="bg-white hover:shadow-lg transition-all duration-300 cursor-pointer h-full border border-gray-100 group overflow-hidden">
            <CardContent className="p-5">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h3 className="font-medium text-gray-800 group-hover:text-emerald-600 transition-colors line-clamp-2">
                            {name || "Unnamed product"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{brand || "Unknown brand"}</p>

                        {/* Transparency indicator */}
                        <div className="flex items-center mt-3">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${transparencyStyles.bgColor} ${transparencyStyles.textColor}`}
                                        >
                                            {transparencyStyles.icon}
                                            <span className="ml-1">{transparencyStyles.label}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            Based on {ingredients.length} ingredients and {additives.length} additives in our database
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    {/* Data completeness indicator */}
                    <div className="relative">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="relative">
                                        <svg className="w-12 h-12" viewBox="0 0 36 36">
                                            <circle
                                                cx="18"
                                                cy="18"
                                                r="15.91549430918954"
                                                fill="transparent"
                                                stroke="#f3f4f6"
                                                strokeWidth="3"
                                            />
                                            <circle
                                                cx="18"
                                                cy="18"
                                                r="15.91549430918954"
                                                fill="transparent"
                                                stroke="#64748b" // Neutral color for data completeness
                                                strokeWidth="3"
                                                strokeDasharray={`${completionPercentage}, 100`}
                                                strokeDashoffset="25"
                                                className="transition-all duration-1000 ease-out group-hover:stroke-dasharray-[100,100]"
                                            />
                                            <text
                                                x="18"
                                                y="18.5"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                className="text-xs font-medium"
                                                fill="#475569" // Slate-600
                                            >
                                                {Math.round(completionPercentage)}%
                                            </text>
                                        </svg>
                                        <Database className="h-3 w-3 absolute bottom-0 right-0 text-slate-500" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Data completeness: {Math.round(completionPercentage)}% of product information available</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                {/* Ingredient count indicator */}
                {ingredients.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                        {ingredients.length > 3 ? (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                {ingredients.length} ingredients
                            </span>
                        ) : (
                            ingredients.slice(0, 3).map((ing, idx) => (
                                <span
                                    key={idx}
                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full truncate max-w-[100px]"
                                >
                                    {ing.text}
                                </span>
                            ))
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
