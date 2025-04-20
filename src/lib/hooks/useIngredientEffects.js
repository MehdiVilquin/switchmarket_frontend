"use client";

import { useState, useEffect } from "react";
import { processEffects } from "@/lib/utils/effects";

// API URL (uses environment variable or localhost as default)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Simple cache to avoid repeated API calls
const effectsCache = new Map();

/**
 * Fetches effects for a single ingredient from the API
 * Uses caching to avoid repeated calls
 */
const fetchIngredientEffects = async (ingredient) => {
  // 1. Check cache first
  const cacheKey = ingredient.text.toLowerCase();
  if (effectsCache.has(cacheKey)) {
    console.log(`Using cache for ${ingredient.text}`);
    return effectsCache.get(cacheKey);
  }

  // 2. If not in cache, call API
  try {
    console.log(`Fetching effects for ${ingredient.text}`);
    const response = await fetch(
      `${API_URL}/effects/search?query=${encodeURIComponent(ingredient.text)}`
    );

    if (!response.ok) {
      throw new Error(`API error for ${ingredient.text}`);
    }

    const data = await response.json();

    // Add ingredient information to effects
    const effects =
      data.effects?.map((effect) => ({
        ...effect,
        ingredient: ingredient.text,
        percent: ingredient.percent,
      })) || [];

    // Save to cache
    effectsCache.set(cacheKey, effects);
    return effects;
  } catch (error) {
    console.error(`Error for ${ingredient.text}:`, error);
    return []; // Return empty array on error
  }
};

/**
 * Custom hook to handle ingredient effects
 * Manages loading, errors, and caching
 */
const useIngredientEffects = (ingredients) => {
  const [effects, setEffects] = useState({ benefits: [], concerns: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Do nothing if no ingredients
    if (!ingredients?.length) {
      return;
    }

    // Function to load all effects
    const loadEffects = async () => {
      setLoading(true);
      setError(null);

      try {
        // Load effects for all ingredients in parallel
        const results = await Promise.all(
          ingredients.map((ingredient) => fetchIngredientEffects(ingredient))
        );

        // Combine all effects and process them
        const allEffects = results.flat();
        setEffects(processEffects(allEffects));
      } catch (error) {
        console.error("Error processing effects:", error);
        setError("Unable to load ingredient effects");
      }

      setLoading(false);
    };

    loadEffects();
  }, [ingredients]); // Runs when ingredients change

  return { effects, error, isLoading: loading };
};

export default useIngredientEffects;
