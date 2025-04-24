"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const formatName = (name) =>
  name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

export default function ProductIngredients({ ingredients }) {
  if (!ingredients || ingredients.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Ingredients</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="border-2 border-gray-200 rounded-lg p-4 hover:border-black transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">
                {formatName(ingredient.text)}
              </span>
              <Badge className="bg-emerald-50 text-emerald-700 border-0">
                {(ingredient.percent || 0).toFixed(2)}%
              </Badge>
            </div>
            <Progress
              value={ingredient.percent || 0}
              max={100}
              className="h-1.5 bg-gray-100"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
