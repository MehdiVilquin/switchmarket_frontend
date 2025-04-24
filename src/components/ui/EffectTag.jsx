"use client";

import { Leaf, AlertTriangle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Configuration des couleurs selon le type et le score
const TAG_COLORS = {
  benefit: {
    high: "bg-emerald-300 text-emerald-800", // Score >= 7
    medium: "bg-green-200 text-green-800", // Score >= 5
    low: "bg-gray-100 text-gray-800", // Score < 5
  },
  concern: {
    high: "bg-red-300 text-red-800", // Score >= 7
    medium: "bg-orange-200 text-orange-800", // Score >= 5
    low: "bg-yellow-100 text-yellow-800", // Score < 5
  },
};

// Fonction pour obtenir le niveau basé sur le score
const getScoreLevel = (score) => {
  if (score >= 7) return "high";
  if (score >= 5) return "medium";
  return "low";
};

const formatIngredients = (ingredients) => {
  // Regrouper les ingrédients par pourcentage
  const groupedByPercent = ingredients.reduce((acc, ing) => {
    const percent = ing.percent || "N/A";
    if (!acc[percent]) {
      acc[percent] = [];
    }
    acc[percent].push(ing.name);
    return acc;
  }, {});

  // Trier les pourcentages par ordre décroissant
  return Object.entries(groupedByPercent)
    .sort(([percentA], [percentB]) => {
      if (percentA === "N/A") return 1;
      if (percentB === "N/A") return -1;
      return parseFloat(percentB) - parseFloat(percentA);
    })
    .map(([percent, names]) => {
      const uniqueNames = [...new Set(names)].join(", ");
      return percent === "N/A"
        ? uniqueNames
        : `${uniqueNames} (${parseFloat(percent).toFixed(1)}%)`;
    })
    .join("\n");
};

// Composant pour afficher un effet
export const EffectTag = ({ label, score, type = "benefit", ingredients }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <div className="flex h-[52px] items-center justify-center rounded-full border-2 border-gray-200 bg-white px-4 hover:border-black transition-colors">
          <div className="flex items-center gap-2">
            {type === "benefit" ? (
              <Leaf className="h-5 w-5 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            )}
            <span className="text-lg">{label}</span>
            {score && (
              <span className="ml-1 text-sm text-gray-500">({score})</span>
            )}
          </div>
        </div>
      </TooltipTrigger>
      {ingredients?.length > 0 && (
        <TooltipContent>
          <p className="font-medium mb-1">Related ingredients:</p>
          <p className="text-sm text-gray-400 whitespace-pre-line">
            {formatIngredients(ingredients)}
          </p>
        </TooltipContent>
      )}
    </Tooltip>
  </TooltipProvider>
);

// Composant pour afficher un groupe d'effets
export const EffectTagGroup = ({ title, tags, type = "benefit" }) => {
  if (!tags?.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag, index) => (
          <EffectTag
            key={`${tag.function}-${index}`}
            label={tag.function}
            score={tag.score}
            type={type}
            ingredients={tag.ingredients}
          />
        ))}
      </div>
    </div>
  );
};
