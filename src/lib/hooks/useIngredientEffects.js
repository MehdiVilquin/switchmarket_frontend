"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const fetchIngredientEffects = async (ingredient) => {
  const response = await fetch(
    `${API_URL}/effects/search?query=${encodeURIComponent(ingredient.text)}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch effects for ${ingredient.text}`);
  }

  const data = await response.json();
  return (
    data.effects?.map((effect) => ({
      ...effect,
      ingredient: ingredient.text,
      percent: ingredient.percent,
    })) || []
  );
};

const groupEffectsByFunction = (effects) => {
  const grouped = {};

  effects.forEach((effect) => {
    const key = effect.functions;
    if (!grouped[key]) {
      grouped[key] = {
        function: effect.functions,
        ingredients: [],
        score: effect.score,
      };
    }

    // Ajoute l'ingrédient s'il n'est pas déjà présent
    if (!grouped[key].ingredients.some((i) => i.name === effect.ingredient)) {
      grouped[key].ingredients.push({
        name: effect.ingredient,
        percent: effect.percent,
      });
    }

    // Met à jour le score si celui-ci est plus élevé
    if (effect.score > grouped[key].score) {
      grouped[key].score = effect.score;
    }
  });

  return Object.values(grouped);
};

const processEffects = (effects) => {
  const benefitsRaw = effects
    .filter((e) => e.eco_score >= 5)
    .map((e) => ({
      ...e,
      functions: e.functions,
      score: e.eco_score,
    }));

  const concernsRaw = effects
    .filter((e) => e.toxicity_score >= 5)
    .map((e) => ({
      ...e,
      functions: e.functions,
      score: e.toxicity_score,
    }));

  return {
    benefits: groupEffectsByFunction(benefitsRaw).sort(
      (a, b) => b.score - a.score
    ),
    concerns: groupEffectsByFunction(concernsRaw).sort(
      (a, b) => b.score - a.score
    ),
  };
};

const useIngredientEffects = (ingredients) => {
  const [effects, setEffects] = useState({ benefits: [], concerns: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ingredients?.length) return;

    const fetchEffects = async () => {
      try {
        const results = await Promise.all(
          ingredients.map((ingredient) =>
            fetchIngredientEffects(ingredient).catch((err) => {
              console.error(`Error fetching ${ingredient.text}:`, err);
              return [];
            })
          )
        );

        setEffects(processEffects(results.flat()));
      } catch (err) {
        console.error("Error processing effects:", err);
        setError("Failed to process ingredient effects");
      }
    };

    fetchEffects();
  }, [ingredients]);

  return { effects, error };
};

export default useIngredientEffects;
