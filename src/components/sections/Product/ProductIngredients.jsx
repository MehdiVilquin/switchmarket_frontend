"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Info } from "lucide-react"

const formatName = (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()

export default function ProductIngredients({ ingredients }) {
    if (!ingredients || ingredients.length === 0) return null

    return (
        <div className="mt-10 p-6 bg-gray-50 rounded-xl">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="bg-emerald-100 text-emerald-700 p-2 rounded-lg mr-3">
                    <Info className="w-5 h-5" />
                </span>
                Ingredients
            </h2>
            <Card>
                <CardContent className="p-6 space-y-4">
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-gray-900">{formatName(ingredient.text)}</span>
                                <Badge className="bg-emerald-50 text-emerald-700">{(ingredient.percent || 0).toFixed(2)}%</Badge>
                            </div>
                            <Progress value={ingredient.percent || 0} max={100} className="h-2 rounded-full bg-gray-100" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}