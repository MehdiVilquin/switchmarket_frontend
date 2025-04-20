"use client";

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
      return percent === "N/A" ? uniqueNames : `${uniqueNames} (${percent}%)`;
    })
    .join("\n");
};

// Composant pour afficher un effet
export const EffectTag = ({ label, score, type = "benefit", ingredients }) => (
  <div className="group relative">
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
        TAG_COLORS[type][getScoreLevel(score)]
      }`}
    >
      <span className="font-medium">{label}</span>
      {score && (
        <span className="inline-flex items-center justify-center rounded-full bg-white/25 px-1.5 py-0.5 text-xs font-medium">
          {score}
        </span>
      )}
    </div>
    {ingredients?.length > 0 && (
      <div className="absolute z-10 invisible group-hover:visible bg-white border border-gray-200 rounded-md p-2 shadow-lg min-w-[200px] max-w-[300px] whitespace-pre-line text-sm text-gray-700 top-full left-0 mt-1">
        {formatIngredients(ingredients)}
      </div>
    )}
  </div>
);

// Composant pour afficher un groupe d'effets
export const EffectTagGroup = ({ title, tags, type = "benefit" }) => {
  if (!tags?.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <div className="flex flex-wrap gap-2">
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
