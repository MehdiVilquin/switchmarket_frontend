"use client" // Indique que ce code doit être exécuté côté client (navigateur)

import { useState, useEffect } from "react" // Import des hooks useState et useEffect depuis React
import { useRouter } from "next/navigation" // Import du hook useRouter pour la navigation dans Next.js
import { Card, CardContent } from "@/components/ui/card" // Import de composants d'interface utilisateur pour l'affichage de cartes
import { Badge } from "@/components/ui/badge" // Import du composant Badge pour afficher des étiquettes
import { Progress } from "@/components/ui/progress" // Import du composant Progress pour montrer des barres de progression
import { Button } from "@/components/ui/button" // Import du composant Button pour les boutons interactifs
import { Skeleton } from "@/components/ui/skeleton" // Import du composant Skeleton pour afficher des placeholders pendant le chargement
import { motion } from "framer-motion" // Import du composant motion de framer-motion pour les animations
import { ArrowLeft, Heart, Share2, AlertCircle, Leaf, Beaker } from "lucide-react" // Import d'icônes issues de la bibliothèque lucide-react
import Link from "next/link" // Import du composant Link de Next.js pour la navigation par liens
import { useParams } from 'next/navigation'


// Définition de l'URL de base de l'API via une variable d'environnement ou une valeur par défaut
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Fonction pour formater le nom d'un ingrédient de manière à l'afficher correctement
const formatIngredientName = (name) => {
  if (!name) return "Unknown" // Si le nom est vide ou non défini, retourne "Unknown"
  // Met en majuscule la première lettre et le reste en minuscule
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}

// Fonction pour générer l'URL de l'image à partir de l'EAN (identifiant produit)
// avec des vérifications de sécurité pour éviter les erreurs
const getOBFImageUrl = (ean) => {
  if (!ean) return null // Si l'EAN est absent, renvoie null
  try {
    // Construit l'URL de l'image en découpant l'EAN en segments pour correspondre au format du serveur
    return `https://images.openbeautyfacts.org/images/products/${ean.slice(0, 3)}/${ean.slice(3, 6)}/${ean.slice(6, 9)}/${ean.slice(9)}/front_fr.4.full.jpg`
  } catch (error) {
    console.error("Error generating OBF image URL:", error) // Affiche l'erreur dans la console en cas d'exception
    return null
  }
}

// Composant principal de la page produit
export default function ProductPage() {
  const router = useRouter() // Initialisation de l'objet router pour la navigation
  // Extraction sécurisée de l'ID de produit depuis les paramètres de l'URL
  const { id: productId } = useParams()

  // Déclaration des états du composant pour stocker le produit, l'image, le chargement, l'erreur et le statut "favori"
  const [product, setProduct] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)

  // Utilisation de useEffect pour charger les données du produit lors du montage du composant ou quand l'ID change
  useEffect(() => {
    // Si aucun ID de produit n'est fourni, on affiche une erreur et on arrête le chargement
    if (!productId) {
      setError("Product ID is missing")
      setIsLoading(false)
      return
    }

    // Fonction asynchrone pour récupérer les informations du produit depuis l'API
    const fetchProduct = async () => {
      setIsLoading(true) // Active le mode chargement
      try {
        console.log(`Fetching product from: ${API_URL}/products/${productId}`)
        // Appel à l'API pour récupérer les détails du produit
        const response = await fetch(`${API_URL}/products/${productId}`)

        // Vérifie que la réponse de l'API est correcte
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`)
        }

        // Récupère les données JSON
        const data = await response.json()
        console.log("Product data received:", data)

        // Vérifie si la structure des données est conforme (présence de result et product)
        if (data.result && data.product) {
          setProduct(data.product) // Stocke les informations du produit dans l'état

          // Essaie de charger l'image du produit via Open Beauty Facts si un identifiant est disponible
          if (data.product.OBFProductId) {
            const url = getOBFImageUrl(data.product.OBFProductId)
            if (url) {
              try {
                // Vérifie que l'image existe en effectuant une requête HEAD
                const imgResponse = await fetch(url, { method: "HEAD" })
                if (imgResponse.ok) {
                  setImageUrl(url) // Si l'image existe, on la définit comme URL d'image
                } else {
                  // Si l'image n'existe pas, on utilise une image de remplacement
                  setImageUrl("/placeholder.svg?height=400&width=400&text=Product+Image")
                }
              } catch (imgError) {
                console.error("Error checking image:", imgError)
                // En cas d'erreur lors de la vérification, on utilise également l'image de remplacement
                setImageUrl("/placeholder.svg?height=400&width=400&text=Product+Image")
              }
            } else {
              // Si l'URL n'est pas générée correctement, on affiche l'image de remplacement
              setImageUrl("/placeholder.svg?height=400&width=400&text=Product+Image")
            }
          } else {
            // Si aucun identifiant OBF n'est présent dans le produit, on affiche l'image de remplacement
            setImageUrl("/placeholder.svg?height=400&width=400&text=Product+Image")
          }
        } else {
          // Si la structure des données reçues n'est pas valide, on lance une erreur
          throw new Error("Invalid data structure received from API")
        }
      } catch (err) {
        console.error("Error fetching product:", err)
        setError(err.message) // Stocke le message d'erreur dans l'état
      } finally {
        setIsLoading(false) // Désactive le mode chargement une fois la requête terminée
      }
    }

    // Appelle la fonction asynchrone pour récupérer le produit
    fetchProduct()
  }, [productId]) // Relance useEffect uniquement si l'ID du produit change

  // Fonction pour basculer le statut de favori
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  // Fonction pour gérer le partage du produit
  const handleShare = () => {
    // Vérifie que l'API Web Share est supportée par le navigateur
    if (navigator.share) {
      navigator
        .share({
          // Titre du produit (ou texte par défaut)
          title: product?.product_name || "Beauty Product",
          // Message à partager
          text: `Check out this product: ${product?.product_name}`,
          // URL de la page courante
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err))
    } else {
      // Solution de repli : copie l'URL dans le presse-papiers
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  // Si une erreur est survenue lors du chargement, afficher une page d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          {/* Icône d'erreur */}
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          {/* Bouton pour revenir en arrière */}
          <Button onClick={() => router.back()} className="bg-emerald-500 hover:bg-emerald-600 text-white">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  // Rendu principal du composant
  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* Bouton de retour et fil d'Ariane */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          {/* Bouton pour revenir à la page précédente */}
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          {/* Fil d'Ariane indiquant le chemin de navigation */}
          <div className="text-sm text-gray-500 ml-4">
            <span className="text-gray-400">Home</span> / <span className="text-gray-400">Products</span> /{" "}
            <span>{isLoading ? "..." : product?.product_name || "Product Details"}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Si le produit est en cours de chargement, afficher des éléments Skeleton */}
        {isLoading ? (
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
                  // Création de lignes Skeleton pour simuler la liste des ingrédients ou autres éléments
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 flex-1 mx-2" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
            </div>
          </div>
        ) : product ? (
          // Si le produit est chargé, afficher ses détails avec une animation de fondu grâce à framer-motion
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Section Image du produit */}
              <div className="w-full md:w-1/3">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 p-4 flex items-center justify-center h-80">
                  {imageUrl ? (
                    // Affiche l'image si l'URL est définie, sinon affiche un fallback
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={product.product_name || "Product image"}
                      className="object-contain max-h-full max-w-full"
                    />
                  ) : (
                    // Message de chargement de l'image si l'URL n'est pas encore disponible
                    <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-400">
                      Loading image...
                    </div>
                  )}
                </div>
              </div>

              {/* Section Détails du produit */}
              <div className="w-full md:w-2/3">
                {/* Nom du produit */}
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.product_name || "Unnamed Product"}</h1>
                {/* Marque du produit */}
                <p className="text-xl text-gray-600 mb-4">{product.brands || "Unknown Brand"}</p>

                {/* Section Composition */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">COMPOSITION</h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      {/* Indication pour une composition naturelle */}
                      <span className="flex items-center text-emerald-600">
                        <Leaf className="h-4 w-4 mr-1" /> Natural
                      </span>
                      {/* Indication pour une composition chimique */}
                      <span className="flex items-center text-amber-600">
                        <Beaker className="h-4 w-4 mr-1" /> Chemical
                      </span>
                    </div>
                    {/* Barre de progression pour visualiser le pourcentage naturel vs. chimique */}
                    <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
                      <div className="bg-emerald-400" style={{ width: `${product.naturalPercentage || 0}%` }}></div>
                      <div className="bg-amber-400" style={{ width: `${product.chemicalPercentage || 0}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1 text-gray-500">
                      <span>{product.naturalPercentage || 0}%</span>
                      <span>{product.chemicalPercentage || 0}%</span>
                    </div>
                  </div>
                </div>

                {/* Section des Labels et Tags */}
                {product.labeltags && Array.isArray(product.labeltags) && product.labeltags.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">LABELS</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.labeltags.map((tag, index) => (
                        // Affiche chaque tag sous forme d'étiquette (Badge)
                        <Badge key={index} className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section des Additifs */}
                {product.additives && Array.isArray(product.additives) && product.additives.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">ADDITIVES</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.additives.map((additive, index) => (
                        // Affiche le nom court de l'additif ou une valeur par défaut si non défini
                        <Badge key={index} className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                          {additive.shortName || (additive.additiveRef && additive.additiveRef.shortName) || "Unknown"}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Boutons d'action (favori et partage) */}
                <div className="flex flex-wrap gap-3 mt-6">
                  {/* Bouton pour ajouter/enlever du favoris */}
                  <Button
                    onClick={toggleFavorite}
                    className={
                      isFavorite
                        ? "bg-pink-500 hover:bg-pink-600 text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                    {isFavorite ? "Saved to Favorites" : "Add to Favorites"}
                  </Button>

                  {/* Bouton pour partager le produit */}
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Section des Ingrédients */}
            {product.ingredients && Array.isArray(product.ingredients) && product.ingredients.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">INGREDIENTS</h2>
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {product.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center">
                          {/* Affichage du nom de l'ingrédient formaté */}
                          <span className="w-1/3 text-gray-700">{formatIngredientName(ingredient.text)}</span>
                          {/* Barre de progression indiquant le pourcentage de l'ingrédient */}
                          <div className="flex-1 mx-4">
                            <Progress value={ingredient.percent || 0} max={100} className="h-2 bg-gray-100" />
                          </div>
                          {/* Pourcentage affiché à droite */}
                          <span className="w-16 text-right text-gray-600 font-medium">
                            {(ingredient.percent || 0).toFixed(2)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Section des Effets, affichée uniquement si des effets existent */}
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
        ) : (
          // Si aucun produit n'est trouvé, affichage d'un message d'erreur avec un lien pour retourner à l'accueil
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
        )}
      </div>
    </main>
  )
}
