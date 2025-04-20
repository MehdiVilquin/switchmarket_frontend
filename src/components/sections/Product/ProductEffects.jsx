"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function ProductEffects({ effects }) {
  if (!effects || effects.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Effects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {effects.map((effect, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-800">
                {effect.name || "Effect"}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {effect.description || "No description available"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";

import useIngredientEffects from "@/lib/hooks/useIngredientEffects";
import { Card } from "@/components/ui/card";
import { EffectTagGroup } from "@/components/ui/EffectTag";
import { processEffects } from "@/lib/utils/effects";

// Composant pour afficher les groupes d'effets
const EffectsDisplay = ({ effects }) => {
  // Si aucun effet, ne rien afficher
  if (!effects?.benefits?.length && !effects?.concerns?.length) {
    return null;
  }

  // Afficher les effets
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Effects</h2>
      <Card className="p-6 space-y-8">
        {/* Benefits */}
        {effects.benefits?.length > 0 && (
          <EffectTagGroup
            title="Benefits"
            tags={effects.benefits}
            type="benefit"
          />
        )}
        {/* Concerns */}
        {effects.concerns?.length > 0 && (
          <EffectTagGroup
            title="Concerns"
            tags={effects.concerns}
            type="concern"
          />
        )}
      </Card>
    </div>
  );
};

export default function ProductEffects({ effects = [], ingredients = [] }) {
  // Si nous avons des effets directs, les utiliser
  if (effects?.length > 0) {
    return <EffectsDisplay effects={processEffects(effects)} />;
  }

  // Sinon, utiliser les effets basés sur les ingrédients
  const { effects: ingredientEffects, error } =
    useIngredientEffects(ingredients);

  if (error) {
    return <div className="mt-12 text-red-500">{error}</div>;
  }

  return <EffectsDisplay effects={ingredientEffects} />;
}
