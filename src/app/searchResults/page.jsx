"use client";

import { useState, useEffect } from "react";
import SearchCard from "@/components/searchcard";

const testProducts = [
  {
    _id: { $oid: "67fce2ec7b3409d0b02aeab2" },
    product_name: "Dentifrice Bio Fraise",
    brands: "Melvita",
    ingredients: [
      { text: "AQUAWATER", percent: 23.33 },
      { text: "XYLITOL", percent: 5.83 },
    ],
    labeltags: ["organic", "natural"],
    completion_score: "37.5",
    additives: [
      {
        tag: "en:e202",
        shortName: "E202",
      },
    ],
  },
  {
    _id: { $oid: "67fce2ec7b3409d0b02aeab3" },
    product_name: "Dentifrice Menthe Fraîche",
    brands: "Bio Natura",
    ingredients: [
      { text: "AQUAWATER", percent: 25.0 },
      { text: "MENTHA PIPERITA", percent: 10.0 },
    ],
    labeltags: ["organic", "vegan"],
    completion_score: "42.0",
    additives: [],
  },
];

function SearchResults() {
  const [displayedProducts, setDisplayedProducts] = useState([]); // On initialise le state pour afficher les produits

  const [isLoading, setIsLoading] = useState(false); // On initialise le state pour le chargement

  async function loadMoreProducts() {
    // Fonction pour charger plus de produits
    setIsLoading(true); // Charger les produits

    await new Promise((resolve) => setTimeout(resolve, 500)); // Simuler un délai pour voir le chargement
    const currentProductCount = displayedProducts.length; // Compter le nombre de produits affichés
    const nextProduct = testProducts[currentProductCount]; // Obtenir le prochain produit

    if (nextProduct) {
      setDisplayedProducts((prev) => [...prev, nextProduct]); // Ajouter le prochain produit à la liste
    }

    setIsLoading(false); // Fin du chargement
  }

  useEffect(() => {
    loadMoreProducts();
  }, []);

  const hasMoreProducts = displayedProducts.length < testProducts.length;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {displayedProducts.map((props) => (
          <div key={props._id.$oid} className="w-full">
            <SearchCard product={props} />
          </div>
        ))}
      </div>

      {hasMoreProducts && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadMoreProducts}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Load more products"}
          </button>
        </div>
      )}
    </main>
  );
}

export default SearchResults;
