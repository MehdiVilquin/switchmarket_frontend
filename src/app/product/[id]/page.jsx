"use client" // Indique que ce composant s'exécute côté client (Next.js)

import { useState, useEffect, use } from "react" // Importation des hooks React
import { useRouter } from "next/navigation" // Importation du hook de navigation Next.js pour la redirection
import { Card, CardContent } from "@/components/ui/card" // Composants pour afficher des cartes stylisées
import { Badge } from "@/components/ui/badge" // Composant Badge pour les labels, indiquations visuelles
import { Progress } from "@/components/ui/progress" // Composant Progress pour afficher des barres de progression
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover" // Composants Popover pour afficher des info-bulles/interactions contextuelles
import { Button } from "@/components/ui/button" // Composant Button pour les boutons stylisés
import { Skeleton } from "@/components/ui/skeleton" // Composant Skeleton pour l'affichage d'un chargement (placeholder)
import { motion } from "framer-motion" // Librairie pour ajouter des animations
import { ArrowLeft, Heart, Share2, AlertCircle, Info, Leaf, Beaker } from "lucide-react" // Importation d'icônes
import Link from "next/link" // Composant Link de Next.js pour la navigation côté client sans rechargement de page
import Barcode from "react-barcode" // Composant Barcode pour générer des codes-barres

// Définition de l'URL de l'API à utiliser (prise depuis les variables d'environnement ou défaut en localhost)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Fonction pour formater le nom d'un ingrédient en mettant la première lettre en majuscule
const formatIngredientName = (name) => {
  if (!name) return "Unknown" // Si le nom est vide, retourne "Unknown"
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() // Met la première lettre en majuscule et le reste en minuscule
}

// Fonction asynchrone pour récupérer les données depuis l'API OpenBeautyFacts en utilisant le code-barres (EAN)
const fetchOpenBeautyFactsData = async (ean) => {
  try {
    // Effectue une requête GET sur l'API OpenBeautyFacts
    const response = await fetch(`https://world.openbeautyfacts.org/api/v0/product/${ean}.json`)
    if (!response.ok) {
      // Si la réponse n'est pas OK, lance une erreur avec le status HTTP
      throw new Error(`OpenBeautyFacts API responded with status: ${response.status}`)
    }
    // Retourne le JSON parsé de la réponse
    return await response.json()
  } catch (error) {
    // En cas d'erreur, l'affiche dans la console et retourne null
    console.error("Error fetching from OpenBeautyFacts API:", error)
    return null
  }
}

// Fonction pour extraire la meilleure URL d'image du produit à partir des données reçues de OpenBeautyFacts
const getBestProductImage = (obfData) => {
  if (!obfData || !obfData.product) {
    return null // Si les données ou le produit sont absents, retourne null
  }

  // Définit un tableau d'options d'URLs d'images à partir des différentes propriétés de l'objet produit
  const imageOptions = [
    obfData.product.images?.front?.display?.fr,
    obfData.product.image_front_url,
    obfData.product.image_url,
    obfData.product.image_front_small_url,
  ]

  // Retourne la première URL valide trouvée dans le tableau ou null si aucune n'est valide
  return imageOptions.find((url) => url && typeof url === "string") || null
}

// Méthode alternative pour générer directement l'URL de l'image depuis l'EAN
const getOBFImageUrl = (ean) => {
  if (!ean) return null
  try {
    // Construit l'URL basée sur des segments découpés de l'EAN (selon la structure définie par OpenBeautyFacts)
    return `https://images.openbeautyfacts.org/images/products/${ean.slice(0, 3)}/${ean.slice(3, 6)}/${ean.slice(6, 9)}/${ean.slice(9)}/front_fr.4.full.jpg`
  } catch (error) {
    // En cas d'erreur, l'affiche dans la console et retourne null
    console.error("Error generating OBF image URL:", error)
    return null
  }
}

// Composant principal de la page produit
export default function ProductPage({ params: paramsPromise }) {
  // Utilisation du hook de navigation pour la redirection
  const router = useRouter()
  // Récupération des paramètres de la route (ici le product id)
  const params = use(paramsPromise)
  const productId = params?.id

  // Déclaration des états locaux
  const [product, setProduct] = useState(null) // Stocke les données du produit
  const [imageUrl, setImageUrl] = useState(null) // Stocke l'URL de l'image à afficher
  const [isLoading, setIsLoading] = useState(true) // Indique si la requête est en cours de chargement
  const [error, setError] = useState(null) // Stocke un message d'erreur, le cas échéant
  const [obfData, setObfData] = useState(null) // Stocke les données récupérées depuis OpenBeautyFacts
  const [isFavorite, setIsFavorite] = useState(false) // État pour la gestion des favoris

  // useEffect se déclenche à l'affichage ou lorsque productId change
  useEffect(() => {
    // Vérifie que l'ID du produit existe sinon affiche une erreur
    if (!productId) {
      setError("Product ID is missing")
      setIsLoading(false)
      return
    }

    // Fonction asynchrone pour récupérer les données du produit
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        // Affiche dans la console l'URL de récupération du produit
        console.log(`Fetching product from: ${API_URL}/products/${productId}`)
        const response = await fetch(`${API_URL}/products/${productId}`)

        if (!response.ok) {
          // Si la réponse n'est pas valide, lance une erreur
          throw new Error(`Failed to fetch product: ${response.status}`)
        }

        // Parse la réponse JSON
        const data = await response.json()
        console.log("Product data received:", data)

        // Gère différentes structures de réponse de l'API
        const productData = data.result && data.product ? data.product : data
        setProduct(productData)

        // Si le produit possède un identifiant OpenBeautyFacts, tenter de récupérer l'image depuis leur API
        if (productData.OBFProductId) {
          // Récupère les données détaillées depuis OpenBeautyFacts
          const obfProductData = await fetchOpenBeautyFactsData(productData.OBFProductId)
          setObfData(obfProductData)

          // Tente d'obtenir la meilleure image depuis les données récupérées
          const bestImageUrl = getBestProductImage(obfProductData)

          if (bestImageUrl) {
            // Si une URL valide est trouvée, l'utilise
            setImageUrl(bestImageUrl)
          } else {
            // Sinon, construit directement l'URL de l'image
            const directUrl = getOBFImageUrl(productData.OBFProductId)

            if (directUrl) {
              try {
                // Vérifie que l'image existe en faisant une requête HEAD
                const imgResponse = await fetch(directUrl, { method: "HEAD" })
                if (imgResponse.ok) {
                  setImageUrl(directUrl)
                } else {
                  // Utilise une image par défaut si la requête HEAD échoue
                  setImageUrl("/placeholder.svg?height=400&width=400&text=Product+Image")
                }
              } catch (imgError) {
                // En cas d'erreur lors de la vérification de l'image, affiche une erreur et utilise l'image par défaut
                console.error("Error checking image:", imgError)
                setImageUrl("/placeholder.svg?height=400&width=400&text=Product+Image")
              }
            } else {
              // Si aucune URL n'est générée, utilise l'image par défaut
              setImageUrl("/placeholder.svg?height=400&width=400&text=Product+Image")
            }
          }
        } else {
          // Si aucune OBFProductId, utilise une image par défaut
          setImageUrl("/placeholder.svg?height=400&width=400&text=Product+Image")
        }
      } catch (err) {
        // Gère les erreurs lors de la récupération du produit et affiche un message d'erreur
        console.error("Error fetching product:", err)
        setError(err.message)
        setImageUrl("/placeholder.svg?height=400&width=400&text=Product+Image")
      } finally {
        // Quel que soit le résultat, on arrête l'état de chargement
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId]) // Déclenche le useEffect à chaque changement de productId

  // Fonction pour basculer l'état "favori" du produit
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  // Fonction gérant le partage du produit
  const handleShare = () => {
    if (navigator.share) {
      // Utilise l'API de partage Web si disponible
      navigator
        .share({
          title: product?.product_name || "Beauty Product",
          text: `Check out this product: ${product?.product_name}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err))
    } else {
      // Sinon, copie l'URL dans le presse-papiers et avertit l'utilisateur
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  // Si une erreur est survenue, on affiche un écran d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.back()} className="bg-emerald-500 hover:bg-emerald-600 text-white">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  // État de chargement : affichage de composants Skeleton pour simuler le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16">
        {/* Barre de navigation simulée pendant le chargement */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="text-sm text-gray-500 ml-4">
              <span className="text-gray-400">Home</span> / <span className="text-gray-400">Products</span> /{" "}
              <span>...</span>
            </div>
          </div>
        </div>

        {/* Contenu principal de la page pendant le chargement */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
              <Skeleton className="h-80 w-full md:w-1/3 rounded-xl" />
              <div className="w-full md:w-2/3 space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <Skeleton className="h-32 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-40" />
                  <Skeleton className="h-10 w-40" />
                </div>
              </div>
            </div>
            <Skeleton className="h-8 w-40" />
            <div className="space-y-3">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 flex-1 mx-2" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Si aucun produit n'est trouvé, affiche un message d'erreur spécifique
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Product not found</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            We couldn't find the product you're looking for. It may have been removed or doesn't exist.
          </p>
          <Link href="/">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Return to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Définition des pourcentages de produits naturels et chimiques (valeurs par défaut si non fournis par l'API)
  const naturalPercentage = product.naturalPercentage || 65 // Valeur par défaut pour la démo
  const chemicalPercentage = product.chemicalPercentage || 35 // Valeur par défaut pour la démo

  // Rendu principal de la page avec les données du produit
  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* Navigation Breadcrumb pour faciliter la navigation */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="text-sm text-gray-500 ml-4">
            <span className="text-gray-400">Home</span> / <span className="text-gray-400">Products</span> /{" "}
            <span>{product.product_name || "Product Details"}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Animation d'apparition progressive avec Framer Motion */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Section pour l'image du produit et le code barre */}
            <div className="w-full md:w-1/3 flex flex-col">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 p-4 flex items-center justify-center h-80">
                {imageUrl ? (
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt={product.product_name || "Product image"}
                    className="object-contain max-h-full max-w-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-400">
                    Loading image...
                  </div>
                )}
              </div>

              {/* Affichage du code barre si OBFProductId existe */}
              {product.OBFProductId && (
                <div className="mt-4 flex flex-col items-center">
                  <p className="text-xs text-gray-500 mb-1">Code produit</p>
                  <Barcode
                    value={product.OBFProductId}
                    format="EAN13"
                    height={40}
                    width={1.5}
                    fontSize={10}
                    margin={0}
                    background="#ffffff"
                    lineColor="#333333"
                  />
                </div>
              )}
            </div>

            {/* Section pour les détails du produit */}
            <div className="w-full md:w-2/3">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.product_name || "Unnamed Product"}</h1>
              <p className="text-xl text-emerald-700 font-medium mb-4">{product.brands || "Unknown Brand"}</p>

              {/* Section Composition avec indication des pourcentages de composants naturels et chimiques */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Composition</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center text-emerald-600">
                      <Leaf className="h-4 w-4 mr-1" /> Natural
                    </span>
                    <span className="flex items-center text-amber-600">
                      <Beaker className="h-4 w-4 mr-1" /> Chemical
                    </span>
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
                    <div className="bg-emerald-400" style={{ width: `${naturalPercentage}%` }}></div>
                    <div className="bg-amber-400" style={{ width: `${chemicalPercentage}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1 text-gray-500">
                    <span>{naturalPercentage}%</span>
                    <span>{chemicalPercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Section Labels pour afficher des étiquettes sur le produit */}
              {product.labeltags && Array.isArray(product.labeltags) && product.labeltags.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Labels</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.labeltags.map((tag, index) => (
                      <Badge
                        key={index}
                        className="bg-emerald-50 text-emerald-700 border border-emerald-200 py-1 px-3 rounded-full transition-all hover:bg-emerald-100 cursor-pointer"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Lien vers OpenBeautyFacts si l'ID est disponible */}
              {product.OBFProductId && (
                <div className="mb-5 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <a
                    href={`https://world.openbeautyfacts.org/product/${product.OBFProductId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-emerald-700 flex items-center transition-colors"
                  >
                    <Info className="w-4 h-4 mr-2 text-emerald-600" />
                    <span>Voir sur OpenBeautyFacts</span>
                    <span className="ml-auto text-xs text-gray-400">Ref: {product.OBFProductId}</span>
                  </a>
                </div>
              )}

              {/* Section Additifs : affiche les additifs sous forme de badge avec des popovers informatifs */}
              {product.additives && Array.isArray(product.additives) && product.additives.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Additifs</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.additives.map((additive, index) => (
                      <Popover key={index}>
                        <PopoverTrigger>
                          <Badge
                            className={`cursor-pointer transition-all hover:shadow-sm px-3 py-1 rounded-full ${additive.additiveRef?.risk?.toLowerCase() === "high"
                              ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                              : additive.additiveRef?.risk?.toLowerCase() === "medium"
                                ? "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100"
                                : "bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100"
                              }`}
                          >
                            {additive.shortName ||
                              (additive.additiveRef && additive.additiveRef.shortName) ||
                              "Unknown"}
                          </Badge>
                        </PopoverTrigger>
                        <PopoverContent className="p-4 max-w-xs bg-white rounded-lg shadow-lg border-0">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-gray-900">
                                {additive.shortName ||
                                  (additive.additiveRef && additive.additiveRef.shortName) ||
                                  "Unknown"}
                              </h3>
                              {additive.additiveRef?.risk && (
                                <Badge
                                  className={`${additive.additiveRef.risk.toLowerCase() === "high"
                                    ? "bg-red-100 text-red-700"
                                    : additive.additiveRef.risk.toLowerCase() === "medium"
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                  Risque {additive.additiveRef.risk}
                                </Badge>
                              )}
                            </div>
                            <div className="pt-2 border-t border-gray-100">
                              {additive.additiveRef?.name?.en && (
                                <p className="text-sm mb-2 text-gray-700">
                                  <span className="font-medium">Nom:</span> {additive.additiveRef.name.en}
                                </p>
                              )}
                              {additive.additiveRef?.description?.en && (
                                <p className="text-sm mb-2 text-gray-700">
                                  <span className="font-medium">Description:</span>{" "}
                                  {additive.additiveRef.description.en}
                                </p>
                              )}
                              {additive.additiveRef?.origin && (
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Origine:</span> {additive.additiveRef.origin}
                                </p>
                              )}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ))}
                  </div>
                </div>
              )}

              {/* Boutons d'actions : ajout aux favoris et partage */}
              <div className="flex flex-wrap gap-3 mt-6">
                <Button
                  onClick={toggleFavorite}
                  className={
                    isFavorite
                      ? "bg-pink-500 hover:bg-pink-600 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "Saved to Favorites" : "Add to Favorites"}
                </Button>

                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Section Ingrédients si la donnée existe */}
          {product.ingredients && Array.isArray(product.ingredients) && product.ingredients.length > 0 && (
            <div className="mt-10 p-6 bg-gray-50 rounded-xl">
              <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="bg-emerald-100 text-emerald-700 p-2 rounded-lg mr-3">
                  <Info className="w-5 h-5" />
                </span>
                Ingredients
              </h2>
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {product.ingredients.map((ingredient, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          {/* Affiche le nom de l'ingrédient avec le formatage défini */}
                          <span className="font-medium text-gray-900">{formatIngredientName(ingredient.text)}</span>
                          {/* Affiche le pourcentage de l'ingrédient */}
                          <Badge className="bg-emerald-50 text-emerald-700 font-medium">
                            {(ingredient.percent || 0).toFixed(2)}%
                          </Badge>
                        </div>
                        {/* Barres de progression personnalisée pour visualiser le pourcentage */}
                        <Progress
                          value={ingredient.percent || 0}
                          max={100}
                          className="h-2 rounded-full bg-gray-100"
                          style={{
                            background: "linear-gradient(to right, #10b981 0%, #d1fae5 100%)",
                            backgroundSize: `${ingredient.percent || 0}% 100%`,
                            backgroundRepeat: "no-repeat",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Section Effets présentant les effets positifs ou négatifs du produit */}
          {product.effects && Array.isArray(product.effects) && product.effects.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">EFFECTS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.effects.map((effect, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-gray-800">{effect.name || "Effect"}</h3>
                      <p className="text-gray-600 text-sm mt-1">{effect.description || "No description available"}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
