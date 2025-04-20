"use client";

import useIngredientEffects from "@/lib/hooks/useIngredientEffects";
import { Card } from "@/components/ui/card";
import { EffectTagGroup } from "@/components/ui/EffectTag";
import { processEffects } from "@/lib/utils/effects";

// Component to display effect groups
const EffectsDisplay = ({ effects }) => {
  // If no effects, display nothing
  if (!effects?.benefits?.length && !effects?.concerns?.length) {
    return null;
  }

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
  // If we have direct effects, use them
  if (effects?.length > 0) {
    return <EffectsDisplay effects={processEffects(effects)} />;
  }

  // Otherwise, use ingredient-based effects
  const { effects: ingredientEffects, error } =
    useIngredientEffects(ingredients);

  if (error) {
    return <div className="mt-12 text-red-500">{error}</div>;
  }

  return <EffectsDisplay effects={ingredientEffects} />;
}
