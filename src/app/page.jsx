"use client"
// Indique à Next.js que ce composant doit être rendu côté client.

/* =================== */
/* IMPORT DES MODULES */
/* =================== */

// Import des hooks de React pour la gestion de l'état et des effets
import { useState, useEffect } from "react"

// Import du composant Button depuis la bibliothèque de composants
import { Button } from "@/components/ui/button"

// Import du composant Input pour les champs de saisie
import { Input } from "@/components/ui/input"

// Import de diverses icônes issues de la bibliothèque lucide-react
import { Loader2, Search, Sparkles, Filter, Leaf, ShieldCheck, Heart, ChevronRight, Star, Users } from "lucide-react"

// Import de deux cartes personnalisées pour afficher des ingrédients et produits
import IngredientCard from "@/components/IngredientCard"
import ProductCard from "@/components/ProductCard"

// Import du composant Link de Next.js pour la navigation interne
import Link from "next/link"

// Import du hook useRouter pour la navigation programmatique de Next.js
import { useRouter } from "next/navigation"

// Import du composant Skeleton pour afficher des états de chargement (placeholder)
import { Skeleton } from "@/components/ui/skeleton"

// Import de "motion" depuis Framer Motion pour l'animation des éléments
import { motion } from "framer-motion"

// Import de composants Tooltip pour afficher des infobulles
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Import du composant Badge pour afficher des étiquettes stylisées
import { Badge } from "@/components/ui/badge"

/* ============================= */
/* CONFIGURATION ET VARIABLES    */
/* ============================= */

// URL de base de l'API : utilise la variable d'environnement si définie, sinon "http://localhost:3000"
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Définition des variantes d'animation pour un conteneur avec effet de cascade sur ses enfants
const containerVariants = {
  hidden: { opacity: 0 }, // État initial : complètement transparent
  show: {
    opacity: 1, // État final : totalement opaque
    transition: { staggerChildren: 0.05 }, // Décalage de 0.05 seconde entre l'animation des enfants
  },
}

// Variantes d'animation pour chaque item, avec un effet de transition du bas vers sa position finale
const itemVariants = {
  hidden: { opacity: 0, y: 10 }, // Position de départ légèrement en bas avec opacité nulle
  show: {
    opacity: 1,
    y: 0, // Position finale normale
    transition: { duration: 0.3 }, // Durée de l'animation de 0.3 secondes
  },
}

/* ============================= */
/* COMPOSANT PRINCIPAL : Home     */
/* ============================= */

export default function Home() {
  // Instanciation du hook useRouter pour la navigation par programmation
  const router = useRouter()

  // Déclaration d'états locaux pour gérer la recherche, le chargement des données, etc.
  const [searchQuery, setSearchQuery] = useState("") // Stocke la requête de recherche saisie par l'utilisateur
  const [isSearching, setIsSearching] = useState(false) // Indique si une recherche est en cours
  const [products, setProducts] = useState([]) // Tableau qui contiendra les produits récupérés de l'API
  const [additives, setAdditives] = useState([]) // Tableau qui contiendra les additifs/ingrédients récupérés de l'API
  const [isLoading, setIsLoading] = useState(true) // Flag indiquant l'état de chargement des données

  /* ===================================== */
  /* EFFECT : Chargement des données API   */
  /* ===================================== */
  useEffect(() => {
    // Fonction asynchrone pour charger les données depuis le backend
    const loadData = async () => {
      setIsLoading(true) // Démarre l'état de chargement
      try {
        // En parallèle : 
        // - Récupération de 6 produits aléatoires
        // - Récupération de 6 additifs aléatoires
        const [productsRes, additivesRes] = await Promise.all([
          fetch(`${API_URL}/products/random/6`),
          fetch(`${API_URL}/additives/random/6`),
        ])

        // Conversion des réponses JSON
        const productsData = await productsRes.json()
        const additivesData = await additivesRes.json()

        // Traitement des données produits renvoyées par l'API
        if (productsData.result && productsData.products) {
          // Mise en forme de chaque produit pour normaliser les clés attendues par le composant ProductCard
          const processedProducts = productsData.products.map((p) => ({
            id: p._id, // Identifiant du produit
            name: p.product_name, // Nom du produit
            brand: p.brands, // Marque du produit
            score: p.completion_score, // Score de complétion (peut être un indicateur de qualité/éthique)
            ingredients: p.ingredients || [], // Liste des ingrédients (ou tableau vide si non disponible)
            additives: p.additives || [], // Liste des additifs (ou tableau vide)
            labeltags: p.labeltags || [], // Labels ou tags associés
          }))
          setProducts(processedProducts)
        } else {
          console.error("No products received from API")
        }

        // Traitement des données additifs renvoyées par l'API
        if (additivesData.result && additivesData.additives) {
          // Mise en forme de chaque additif avec des clés adaptées pour le composant IngredientCard
          const processedAdditives = additivesData.additives.map((a) => ({
            id: a._id, // Identifiant de l'additif
            // On affiche le nom en anglais s'il est présent, sinon on utilise une version courte ou "Unknown"
            name: a.name?.en || a.shortName || "Unknown",
            // Description en anglais s'il existe, sinon un message par défaut
            description: a.description?.en || "No description available",
            // URL d'une image fictive servant d'espace réservé ("placeholder") avec texte personnalisé
            imageUrl: `/placeholder.svg?height=100&width=100&text=${encodeURIComponent(a.shortName || "A")}`,
          }))
          setAdditives(processedAdditives)
        } else {
          console.error("No additives received from API")
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false) // Fin du chargement des données
      }
    }
    loadData() // Appel de la fonction de chargement de données au montage du composant
  }, [])

  /* ===================================== */
  /* FONCTION : Gestion de la recherche   */
  /* ===================================== */
  const handleSearch = async (e) => {
    e.preventDefault() // Empêche le rechargement de la page lors de la soumission du formulaire
    if (!searchQuery.trim()) return // Si la chaîne de recherche est vide, on ne procède pas

    setIsSearching(true) // On active l'indicateur de recherche
    try {
      // Redirige vers la page de résultats de recherche en passant la requête en paramètre d'URL
      router.push(`/searchResults?q=${encodeURIComponent(searchQuery)}`)
    } catch (error) {
      console.error("Error during search:", error)
    } finally {
      setIsSearching(false) // Réinitialise le flag de recherche après le traitement
    }
  }

  /* ===================================== */
  /* RENDU DU COMPOSANT (JSX)             */
  /* ===================================== */
  return (
    <main className="min-h-screen">
      {/* ======================== */}
      {/* SECTION HERO (accueil) */}
      {/* ======================== */}
      <section className="relative bg-gradient-to-b from-emerald-50 to-white pt-16 pb-24 px-4 md:px-8 overflow-hidden">
        {/* Image de fond en mode "placeholder" */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] opacity-5 bg-center bg-no-repeat bg-cover"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge avec étiquette */}
            <Badge className="mb-4 px-3 py-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
              Ethical Beauty Choices
            </Badge>
            {/* Titre principal */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 tracking-tight leading-tight">
              Beauty begins with <span className="text-emerald-500">truth</span>
            </h1>
            {/* Sous-titre explicatif */}
            <p className="text-gray-600 text-lg md:text-xl mb-8 leading-relaxed">
              Understand what's in your beauty products and make informed choices for your skin and the planet.
            </p>
            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-8">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8">
                Learn More
              </Button>
            </div>
          </motion.div>

          {/* =================================== */}
          {/* BARRE DE RECHERCHE */}
          {/* =================================== */}
          <motion.form
            onSubmit={handleSearch} // Appel de la fonction de recherche à la soumission du formulaire
            className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center p-4">
              {/* Icône de recherche */}
              <Search className="h-5 w-5 text-emerald-500 ml-2 mr-3" />
              {/* Champ de saisie pour la recherche */}
              <Input
                className="border-none flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 text-lg"
                placeholder="Find a product and get its scoring"
                value={searchQuery} // Liaison de la valeur avec l'état searchQuery
                onChange={(e) => setSearchQuery(e.target.value)} // Mise à jour de l'état à la saisie
              />
              {/* Bouton de soumission */}
              <Button
                type="submit"
                size="default"
                disabled={isSearching}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6"
              >
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Search"}
              </Button>
            </div>
            {/* Section "Advanced Filters" (se déclenche au survol) */}
            <div className="border-t px-4 py-3 flex items-center text-sm text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <Filter className="h-4 w-4 mr-2 text-emerald-500" />
              <span className="font-medium">Advanced Filters</span>
            </div>
          </motion.form>
        </div>
      </section>

      {/* ======================== */}
      {/* SECTION DES FONCTIONNALITÉS */}
      {/* ======================== */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Titre de section */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose SwitchMarket</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We help you make better choices for your beauty routine and the environment
            </p>
          </motion.div>

          {/* Trois cartes décrivant les fonctionnalités */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Première carte : Ethical Products */}
            <motion.div
              className="bg-emerald-50 rounded-2xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Ethical Products</h3>
              <p className="text-gray-600">
                Discover beauty products that align with your values and ethical standards
              </p>
            </motion.div>

            {/* Deuxième carte : Ingredient Transparency */}
            <motion.div
              className="bg-emerald-50 rounded-2xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Ingredient Transparency</h3>
              <p className="text-gray-600">
                Understand what's in your products with our detailed ingredient analysis
              </p>
            </motion.div>

            {/* Troisième carte : Better Choices */}
            <motion.div
              className="bg-emerald-50 rounded-2xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Better Choices</h3>
              <p className="text-gray-600">
                Make informed decisions for your skin health and environmental impact
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =================================================== */}
      {/* SECTION PRODUITS : AFFICHAGE DES PRODUITS */}
      {/* =================================================== */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* En-tête de section pour les produits */}
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <Badge className="mb-2 px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
                Featured Products
              </Badge>
              <div className="flex items-center">
                <Sparkles className="h-7 w-7 text-emerald-500 mr-3" />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Discover Products
                </h2>
              </div>
            </div>
            <div className="max-w-md">
              <p className="text-gray-600 text-lg">
                Explore high-scoring cosmetics based on real data and ethical standards.
              </p>
            </div>
          </motion.div>

          {/* Affichage des produits dans une grille avec animation */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            variants={containerVariants} // Utilisation des variantes du container définies plus haut
            initial="hidden"
            animate="show"
          >
            {isLoading
              ? // Si les données sont en cours de chargement, on affiche 6 composants Skeleton en guise de placeholder
              Array(6)
                .fill(0)
                .map((_, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Skeleton className="h-[180px] w-full rounded-xl" />
                  </motion.div>
                ))
              : // Sinon, on mappe le tableau "products" pour générer la liste des produits
              products.map((product, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }} // Légère translation vers le haut au survol
                >
                  <Link href={`/products/${product.id}`} className="block h-full">
                    {/* Composant ProductCard avec transmission de toutes les infos du produit */}
                    <ProductCard
                      name={product.name}
                      brand={product.brand}
                      score={product.score}
                      ingredients={product.ingredients}
                      additives={product.additives}
                    />
                  </Link>
                </motion.div>
              ))}
          </motion.div>

          {/* Bouton pour charger ou explorer plus de produits */}
          <div className="flex justify-center mt-10">
            <Button
              variant="outline"
              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 rounded-full px-6 group"
            >
              Explore more products
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* =================================================== */}
      {/* SECTION TEMOIGNAGES : DONNEES PSEUDO FAKE       */}
      {/* =================================================== */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-2 px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Our Community Says</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of conscious consumers making better beauty choices
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
              >
                <div className="flex items-center mb-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                    ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "SwitchMarket has completely changed how I shop for beauty products. Now I understand what I'm putting
                  on my skin and can make choices aligned with my values."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold mr-3">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Happy User {i}</p>
                    <p className="text-sm text-gray-500">Conscious Consumer</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================== */}
      {/* SECTION ADDITIFS : LIBRAIRIE D'INGRÉDIENTS */}
      {/* =================================================== */}
      <section className="py-16 px-4 md:px-8 bg-emerald-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <Badge className="mb-2 px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
                Ingredients Library
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Cosmetic Additives</h2>
            </div>
            <div className="max-w-md">
              <p className="text-gray-600 text-lg">
                Learn about common ingredients and additives in your beauty products.
              </p>
            </div>
          </motion.div>

          {/* Affichage des additifs sous forme de grille avec animation */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {isLoading
              ? // Si toujours en mode chargement, affiche des Skeletons en guise de placeholder
              Array(6)
                .fill(0)
                .map((_, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Skeleton className="h-[180px] w-full rounded-lg" />
                  </motion.div>
                ))
              : // Sinon, affiche les additifs récupérés transformés plus tôt
              additives.map((add, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={`/additives/${add.id}`} className="block h-full">
                          <IngredientCard
                            name={add.name}
                            description={add.description}
                            imageUrl={add.imageUrl}
                          />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{add.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </section>
      {/* Community Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Badge className="mb-4 px-3 py-1 bg-white/20 text-white hover:bg-white/30 transition-colors">
                    Join Our Community
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Be part of the ethical beauty movement
                  </h2>
                  <p className="text-white/90 text-lg mb-8 max-w-md">
                    Join thousands of conscious consumers making better choices for themselves and the planet.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 rounded-full px-8">
                      Create Account
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/50 hover:bg-white/10 rounded-full px-8"
                    >
                      Learn More
                    </Button>
                  </div>
                </motion.div>
              </div>
              <div className="hidden md:block relative">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=600')] bg-center bg-cover opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-emerald-500/90"></div>
                <div className="absolute bottom-12 left-12 flex items-center">
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 flex items-center">
                    <Users className="h-8 w-8 text-white mr-3" />
                    <div>
                      <p className="text-white font-bold text-xl">10,000+</p>
                      <p className="text-white/80 text-sm">Community Members</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
