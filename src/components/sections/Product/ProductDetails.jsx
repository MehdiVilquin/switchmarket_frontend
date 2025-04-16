"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Info, Leaf, Beaker } from "lucide-react"

export default function ProductDetails({ product, imageUrl }) {
    const [isFavorite, setIsFavorite] = useState(false)

    const toggleFavorite = () => setIsFavorite(!isFavorite)

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product?.product_name,
                text: `Check out this product: ${product?.product_name}`,
                url: window.location.href,
            }).catch(console.error)
        } else {
            navigator.clipboard.writeText(window.location.href)
            alert("Link copied to clipboard!")
        }
    }

    const natural = product.naturalPercentage || 65
    const chemical = product.chemicalPercentage || 35

    return (
        <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.product_name || "Unnamed Product"}</h1>
            <p className="text-xl text-emerald-700 font-medium mb-4">{product.brands || "Unknown Brand"}</p>

            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Composition</h3>
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center text-emerald-600">
                            <Leaf className="h-4 w-4 mr-1" /> Natural
                        </span>
                        <span className="flex items-center text-amber-600">
                            <Beaker className="h-4 w-4 mr-1" /> Chemical
                        </span>
                    </div>
                    <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
                        <div className="bg-emerald-400" style={{ width: `${natural}%` }}></div>
                        <div className="bg-amber-400" style={{ width: `${chemical}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1 text-gray-500">
                        <span>{natural}%</span>
                        <span>{chemical}%</span>
                    </div>
                </div>
            </div>

            {product.labeltags?.length > 0 && (
                <div className="mb-5">
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Labels</h3>
                    <div className="flex flex-wrap gap-2">
                        {product.labeltags.map((tag, index) => (
                            <Badge key={index} className="bg-emerald-50 text-emerald-700 border border-emerald-200 py-1 px-3 rounded-full">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {product.OBFProductId && (
                <div className="mb-5 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <a
                        href={`https://world.openbeautyfacts.org/product/${product.OBFProductId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-emerald-700 flex items-center"
                    >
                        <Info className="w-4 h-4 mr-2 text-emerald-600" />
                        <span>Voir sur OpenBeautyFacts</span>
                        <span className="ml-auto text-xs text-gray-400">Ref: {product.OBFProductId}</span>
                    </a>
                </div>
            )}

            <div className="flex flex-wrap gap-3 mt-6">
                <Button onClick={toggleFavorite} className={isFavorite ? "bg-pink-500 text-white" : "bg-emerald-600 text-white"}>
                    <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                    {isFavorite ? "Saved to Favorites" : "Add to Favorites"}
                </Button>
                <Button variant="outline" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
            </div>
        </div>
    )
}