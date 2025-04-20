/**
Fichier utilitaire pour le traitement des effets des ingrédients en effet 
 */

// Ces valeurs sont utilisées pour filtrer et catégoriser les effets
export const SCORE_THRESHOLDS = {
  MIN_SIGNIFICANT: 5,
  HIGH_IMPACT: 7,
};

// Les scores minimum pour qu'un effet soit pris en compte
const SCORE_MIN = 5;

/**
 * Version simplifiée du traitement des effets
 */
export const processEffects = (effects) => {
  // 1. On sépare d'abord les effets positifs et négatifs
  const benefits = [];
  const concerns = [];

  // Pour chaque effet, on regarde son score et on le met dans la bonne liste
  effects.forEach((effect) => {
    // Si c'est un bon effet (eco_score élevé)
    if (effect.eco_score >= SCORE_MIN) {
      benefits.push({
        function: effect.functions,
        score: effect.eco_score,
        ingredients: [
          {
            name: effect.ingredient,
            percent: effect.percent,
          },
        ],
      });
    }

    // Si c'est un mauvais effet (toxicity_score élevé)
    if (effect.toxicity_score >= SCORE_MIN) {
      concerns.push({
        function: effect.functions,
        score: effect.toxicity_score,
        ingredients: [
          {
            name: effect.ingredient,
            percent: effect.percent,
          },
        ],
      });
    }
  });

  // 2. On regroupe les effets qui ont la même fonction
  const groupEffects = (effectsList) => {
    // On crée un objet où la clé est la fonction
    const grouped = {};

    effectsList.forEach((effect) => {
      const functionName = effect.function;

      // Si on n'a pas encore cette fonction, on l'ajoute
      if (!grouped[functionName]) {
        grouped[functionName] = {
          function: functionName,
          score: effect.score,
          ingredients: [...effect.ingredients],
        };
      } else {
        // Si on a déjà cette fonction
        // On garde le plus haut score
        if (effect.score > grouped[functionName].score) {
          grouped[functionName].score = effect.score;
        }
        // On ajoute le nouvel ingrédient s'il n'est pas déjà présent
        const newIngredient = effect.ingredients[0];
        const alreadyExists = grouped[functionName].ingredients.some(
          (ing) => ing.name === newIngredient.name // Vérifie si l'ingrédient existe déjà dans le groupe
        );

        if (!alreadyExists) {
          grouped[functionName].ingredients.push(newIngredient);
        }
      }
    });

    // On transforme l'objet en tableau et on trie par score
    return Object.values(grouped).sort((a, b) => b.score - a.score);
  };

  // 3. On retourne le résultat final
  return {
    benefits: groupEffects(benefits),
    concerns: groupEffects(concerns),
  };
};
