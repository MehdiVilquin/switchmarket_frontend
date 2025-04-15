"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

// pour avoir des ingrédients mieux harmonisés, on garde que la première majuscule
const formatIngredientName = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

const getOBFImageUrl = (ean) => {
  return `https://images.openbeautyfacts.org/images/products/${ean.slice(0, 3)}/${ean.slice(3, 6)}/${ean.slice(6, 9)}/${ean.slice(9)}/front_fr.4.full.jpg`;
};

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const productId = params.id;
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          const url = getOBFImageUrl(data.OBFProductId);
          fetch(url)
            .then((res) => {
              if (res.ok) {
                setImageUrl(url);
              } else {
                setImageUrl("/fallback-image.png");
              }
            })
            .catch(() => {
              setImageUrl("/fallback-image.png");
            });
        } else {
          console.error('Failed to fetch product');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-4xl w-full">
        <div className="flex gap-8">
          <div className="w-1/3 bg-gray-100 h-64 flex items-center justify-center rounded-lg shadow-md">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.product_name}
                className="object-contain h-full"
              />
            ) : (
              <span className="text-gray-400">Chargement...</span>
            )}
          </div>
          <div className="w-2/3">
            <h1 className="text-3xl font-bold mb-2">{product.product_name}</h1>
            <p className="text-lg mb-4">{product.brands}</p>
            <div className="flex gap-2 mb-4">
              {product.labeltags.map((tag, index) => (
                <Badge key={index} className="bg-green-200 text-green-800">{tag}</Badge>
              ))}
            </div>
            <div className="flex gap-2 mb-4">
              {product.additives.map((additive, index) => (
                <Badge key={index} className="bg-red-200 text-red-800">{additive.shortName}</Badge>
              ))}
            </div>
            <button className="bg-green-500 text-white px-4 py-2 rounded">Ajouter aux favoris</button>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">INGREDIENTS</h2>
          <div className="space-y-2">
            {product.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center">
                <span className="w-1/3">{formatIngredientName(ingredient.text)}</span>
                <Progress value={ingredient.percent} max={100} className="flex-1 h-2 rounded-full mx-2" style={{ backgroundColor: '#f5f5f5' }}>
                  <div style={{ width: `${ingredient.percent}%`, backgroundColor: '#14b8a6' }} className="h-full rounded-full"></div>
                </Progress>
                <span className="w-1/6 text-right">{ingredient.percent.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
