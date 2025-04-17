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
    image = "/placeholder.png?height=200&width=200",
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
        <Card className="flex flex-row overflow-hidden hover:shadow-md transition-shadow border border-gray-200 rounded-xl bg-white min-h-[160px]">
  
  {/* Conteneur Image */}
  <div className="relative w-36 min-w-36 flex items-center justify-center border-r border-gray-200">
    <Image
      src={image || "/placeholder.png"}
      alt={name}
      fill
      className="object-contain p-2"
      sizes="144px"
    />
    <div
      className={`absolute top-2 right-2 ${getScoreColor(displayScore)} text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs`}
    >
      {displayScore}
    </div>
  </div>

  {/* Conteneur Texte */}
  <CardContent className="flex-1 p-4 flex flex-col gap-2 justify-start overflow-hidden">
    <div>
      <div className="text-xs text-gray-500 mb-1 line-clamp-1">{brands}</div>
      <h3 className="font-medium text-sm text-gray-900 line-clamp-2">{name}</h3>
    </div>

    {/* Section barres de progression sécurisée */}
    <div className="mt-auto space-y-2 pb-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-green-600">Natural</span>
        <span>{naturalPercentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
        <div
          className="bg-green-500 h-1 rounded-full"
          style={{ width: `${naturalPercentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-red-600">Chemical</span>
        <span>{chemicalPercentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
        <div
          className="bg-red-500 h-1 rounded-full"
          style={{ width: `${chemicalPercentage}%` }}
        />
      </div>
    </div>
  </CardContent>
</Card>


      
      
    )
}
