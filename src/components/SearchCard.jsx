import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Beaker } from "lucide-react"
import Link from "next/link"

export default function SearchCard({ product }) {
  // Calculate score color based on value
  const getScoreColor = (score) => {
    const numScore = Number.parseFloat(score)
    if (numScore >= 80) return "text-green-600"
    if (numScore >= 60) return "text-emerald-500"
    if (numScore >= 40) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <Link href={`/products/${product._id}`}>
      <Card className="h-full hover:shadow-md transition-shadow border-gray-100 cursor-pointer">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">{product.product_name}</h3>
              <p className="text-sm text-gray-500">{product.brands}</p>
            </div>
            <div className={`text-lg font-bold ${getScoreColor(product.completion_score)}`}>
              {product.completion_score}
            </div>
          </div>

          {/* Natural vs Chemical Composition */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="flex items-center text-emerald-600">
                <Leaf className="h-3 w-3 mr-1" /> Natural
              </span>
              <span className="flex items-center text-amber-600">
                <Beaker className="h-3 w-3 mr-1" /> Chemical
              </span>
            </div>
            <div className="flex h-2 rounded-full overflow-hidden bg-gray-100">
              <div className="bg-emerald-400" style={{ width: `${product.naturalPercentage || 0}%` }}></div>
              <div className="bg-amber-400" style={{ width: `${product.chemicalPercentage || 0}%` }}></div>
            </div>
            <div className="flex justify-between text-xs mt-1 text-gray-500">
              <span>{product.naturalPercentage || 0}%</span>
              <span>{product.chemicalPercentage || 0}%</span>
            </div>
          </div>

          {/* Labels */}
          {product.labeltags && product.labeltags.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {product.labeltags.slice(0, 2).map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-emerald-50 text-emerald-700">
                    {tag}
                  </Badge>
                ))}
                {product.labeltags.length > 2 && (
                  <Badge variant="outline" className="text-xs bg-gray-50">
                    +{product.labeltags.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Additives */}
          {product.additives && product.additives.length > 0 && (
            <div className="text-xs text-gray-500">Contains {product.additives.length} additives</div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
