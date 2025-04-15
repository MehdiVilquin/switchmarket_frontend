"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Heart, Info } from "lucide-react";
import { useState, useEffect, use } from "react";
import Barcode from 'react-barcode';

// pour avoir des ingrédients mieux harmonisés, on garde que la première majuscule
const formatIngredientName = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

// Nouvelle fonction pour récupérer les détails du produit via l'API OpenBeautyFacts
const fetchOpenBeautyFactsData = async (ean) => {
  try {
    const response = await fetch(`https://world.openbeautyfacts.org/api/v0/product/${ean}.json`);
    if (!response.ok) {
      throw new Error(`OpenBeautyFacts API responded with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching from OpenBeautyFacts API:', error);
    return null;
  }
};

// Fonction pour obtenir la meilleure image disponible à partir des données OpenBeautyFacts
const getBestProductImage = (obfData) => {
  if (!obfData || !obfData.product) {
    return null;
  }
  
  // Options d'images par ordre de préférence
  const imageOptions = [
    // Image de face localisée en français
    obfData.product.images?.front?.display?.fr,
    // Image de face standard
    obfData.product.image_front_url,
    // Image principale
    obfData.product.image_url,
    // Petite image de face
    obfData.product.image_front_small_url
  ];
  
  // Retourner la première URL valide
  return imageOptions.find(url => url && typeof url === 'string') || null;
};

export default function ProductPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [obfData, setObfData] = useState(null);

  useEffect(() => {
    const productId = params.id;
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          
          // Récupérer les détails du produit depuis OpenBeautyFacts
          const obfProductData = await fetchOpenBeautyFactsData(data.OBFProductId);
          setObfData(obfProductData);
          
          // Obtenir la meilleure image disponible
          const bestImageUrl = getBestProductImage(obfProductData);
          
          if (bestImageUrl) {
            setImageUrl(bestImageUrl);
          } else {
            console.log('No valid image found in OpenBeautyFacts data, using fallback');
            setImageUrl("/fallback-image.png");
          }
        } else {
          console.error('Failed to fetch product');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setImageUrl("/fallback-image.png");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-green-500 border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Produit non trouvé</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-4xl w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Colonne de gauche - Image et code-barres */}
          <div className="w-full md:w-1/3 flex flex-col">
            <div className="bg-gray-100 h-64 flex items-center justify-center rounded-lg shadow-md overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.product_name}
                  className="object-contain h-full max-w-full"
                />
              ) : (
                <span className="text-gray-400">Image non disponible</span>
              )}
            </div>
            {/* Code-barres positionné discrètement sous l'image */}
            <div className="mt-3 flex justify-center">
              <Barcode 
                value={product.OBFProductId} 
                format="EAN13" 
                height={40}
                width={1.5}
                fontSize={10}
                margin={0}
                background="#f8f9fa"
              />
            </div>
          </div>
          
          {/* Colonne de droite - Informations produit */}
          <div className="w-full md:w-2/3">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.product_name}</h1>
            <p className="text-lg mb-4">{product.brands}</p>
            
            {/* Labels */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.labeltags.map((tag, index) => (
                <Badge key={index} className="bg-green-100 text-green-800 border border-green-300 transition-transform transform hover:scale-105 cursor-pointer">
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* Lien OpenBeautyFacts */}
            <div className="mb-4">
              <a 
                href={`https://world.openbeautyfacts.org/product/${product.OBFProductId}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
              >
                <Info className="w-4 h-4 mr-1" />
                OpenBeautyFact Ref: {product.OBFProductId}
              </a>
            </div>
            
            {/* Additifs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.additives.map((additive, index) => (
                <Popover key={index} trigger="hover">
                  <PopoverTrigger>
                    <Badge 
                      className={`cursor-pointer transition-transform transform hover:scale-105 ${
                        additive.additiveRef.risk?.toLowerCase() === 'high' 
                          ? 'bg-red-100 text-red-800 border border-red-300' 
                          : additive.additiveRef.risk?.toLowerCase() === 'medium'
                            ? 'bg-orange-100 text-orange-800 border border-orange-300'
                            : 'bg-red-100 text-red-800 border border-red-200'
                      }`}
                    >
                      {additive.shortName}
                    </Badge>
                  </PopoverTrigger>
                  <PopoverContent className="p-4 max-w-xs">
                    <h3 className="font-bold text-gray-900 mb-1">{additive.shortName}</h3>
                    <p className="text-sm mb-2"><strong>Nom:</strong> {additive.additiveRef.name.en}</p>
                    {additive.additiveRef.description?.en && (
                      <p className="text-sm mb-2"><strong>Description:</strong> {additive.additiveRef.description.en}</p>
                    )}
                    {additive.additiveRef.origin && (
                      <p className="text-sm mb-2"><strong>Origine:</strong> {additive.additiveRef.origin}</p>
                    )}
                    {additive.additiveRef.risk && (
                      <p className="text-sm font-semibold">
                        <strong>Risque:</strong> 
                        <span className={`ml-1 ${
                          additive.additiveRef.risk?.toLowerCase() === 'high'
                            ? 'text-red-600'
                            : additive.additiveRef.risk?.toLowerCase() === 'medium'
                              ? 'text-orange-600'
                              : 'text-yellow-600'
                        }`}>
                          {additive.additiveRef.risk}
                        </span>
                      </p>
                    )}
                  </PopoverContent>
                </Popover>
              ))}
            </div>
            
            {/* Bouton d'action */}
            <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center">
              <Heart className="w-4 h-4 mr-2" />
              Ajouter aux favoris
            </Button>
          </div>
        </div>
        
        {/* Section des ingrédients */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">INGREDIENTS</h2>
          <div className="space-y-3">
            {product.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center">
                <span className="w-1/3 text-gray-900">{formatIngredientName(ingredient.text)}</span>
                <div className="flex-1 mx-2">
                  <Progress 
                    value={ingredient.percent} 
                    max={100} 
                    className="h-2 rounded-full"
                  />
                </div>
                <span className="w-20 text-right text-gray-700">{ingredient.percent.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}