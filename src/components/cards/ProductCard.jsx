import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"

export default function ProductCard({
    name,
    brands,
    score,
    naturalPercentage,
    chemicalPercentage,
    labeltags = [],
    image = "/placeholder.svg?height=200&width=200",
}) {
    // Calculate health score color
    const getScoreColor = (score) => {
        if (score >= 80) return "bg-green-500"
        if (score >= 60) return "bg-green-400"
        if (score >= 40) return "bg-yellow-400"
        if (score >= 20) return "bg-orange-400"
        return "bg-red-500"
    }

    // Format score for display
    const formattedScore = typeof score === "string" ? Number.parseInt(score, 10) : score
    const displayScore = isNaN(formattedScore) ? 0 : formattedScore

    return (
        <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative pt-[100%]">
                <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />

                {/* Score badge */}
                <div
                    className={`absolute top-2 right-2 ${getScoreColor(displayScore)} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm`}
                >
                    {displayScore}
                </div>
            </div>

            <CardContent className="p-4">
                <div className="text-sm text-gray-500 mb-1">{brands}</div>
                <h3 className="font-medium text-gray-900 line-clamp-2">{name}</h3>

                {/* Composition bars */}
                <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-green-600">Natural</span>
                        <span>{naturalPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${naturalPercentage}%` }}></div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <span className="text-red-600">Chemical</span>
                        <span>{chemicalPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${chemicalPercentage}%` }}></div>
                    </div>
                </div>
            </CardContent>

            {labeltags && labeltags.length > 0 && (
                <CardFooter className="p-4 pt-0 flex flex-wrap gap-1">
                    {labeltags.slice(0, 3).map((label, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                            {label}
                        </Badge>
                    ))}
                    {labeltags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                            +{labeltags.length - 3}
                        </Badge>
                    )}
                </CardFooter>
            )}
        </Card>
    )
}
