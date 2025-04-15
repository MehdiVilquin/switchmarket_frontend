"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight, Plus, Loader2, Search, Sparkles } from "lucide-react"
import IngredientCard from "@/components/IngredientCard"
import ProductCard from "@/components/ProductCard"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Home() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [products, setProducts] = useState([])
  const [featuredIngredients, setFeaturedIngredients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  // Load products and ingredients on page load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)

      try {
        // Load products with a timeout to prevent infinite loading on error
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), 5000))

        const fetchPromise = fetch(`${API_URL}/products`)

        // Race between fetch and timeout
        const response = await Promise.race([fetchPromise, timeoutPromise])
        const productsData = await response.json()

        if (productsData.result && productsData.products) {
          // Process all products
          const processedProducts = productsData.products.map((product) => ({
            id: product._id,
            name: product.product_name,
            brand: product.brands,
            score: product.completion_score,
            ingredients: product.ingredients || [],
            additives: product.additives || [],
            labeltags: product.labeltags || [],
          }))

          setProducts(processedProducts)

          // Extract ingredients from products to display random ones
          const allIngredients = []
          const processedIngredients = new Set() // To avoid duplicates

          productsData.products.forEach((product) => {
            if (product.ingredients && product.ingredients.length > 0) {
              product.ingredients.forEach((ingredient) => {
                if (ingredient.text && !processedIngredients.has(ingredient.text.toLowerCase())) {
                  processedIngredients.add(ingredient.text.toLowerCase())
                  allIngredients.push({
                    id: ingredient.text.toLowerCase().replace(/\s+/g, "-"),
                    name: ingredient.text,
                    description: "Common cosmetic ingredient",
                    imageUrl: `/placeholder.svg?height=100&width=100&text=${encodeURIComponent(
                      ingredient.text.charAt(0),
                    )}`,
                  })
                }
              })
            }
          })

          // Get random ingredients
          const randomIngredients = getRandomItems(allIngredients, 4)
          setFeaturedIngredients(randomIngredients)
        } else {
          // If no data, set some fallback data
          setFallbackData()
        }
      } catch (error) {
        console.error("Error loading data:", error)
        // Set fallback data in case of error
        setFallbackData()
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Set fallback data in case of API error
  const setFallbackData = () => {
    setProducts([
      {
        id: "1",
        name: "Hydrating Face Cream",
        brand: "NatureCare",
        score: "85.0",
        ingredients: [
          { text: "Aqua", percent: 70 },
          { text: "Glycerin", percent: 15 },
          { text: "Aloe Vera", percent: 10 },
        ],
        additives: [],
      },
      {
        id: "2",
        name: "Vitamin C Serum",
        brand: "PureSkin",
        score: "92.0",
        ingredients: [
          { text: "Aqua", percent: 60 },
          { text: "Ascorbic Acid", percent: 20 },
          { text: "Tocopherol", percent: 10 },
          { text: "Ferulic Acid", percent: 5 },
        ],
        additives: [],
      },
      {
        id: "3",
        name: "Gentle Cleansing Foam",
        brand: "EcoBeauty",
        score: "78.0",
        ingredients: [
          { text: "Aqua", percent: 65 },
          { text: "Sodium Laureth Sulfate", percent: 10 },
        ],
        additives: [{ tag: "en:e330" }],
      },
      {
        id: "4",
        name: "Overnight Repair Mask",
        brand: "DermaSoothe",
        score: "88.0",
        ingredients: [
          { text: "Aqua", percent: 55 },
          { text: "Glycerin", percent: 15 },
          { text: "Niacinamide", percent: 10 },
          { text: "Hyaluronic Acid", percent: 5 },
          { text: "Ceramides", percent: 5 },
        ],
        additives: [],
      },
      {
        id: "5",
        name: "SPF 50 Sunscreen",
        brand: "SunShield",
        score: "95.0",
        ingredients: [
          { text: "Aqua", percent: 50 },
          { text: "Zinc Oxide", percent: 20 },
          { text: "Titanium Dioxide", percent: 15 },
        ],
        additives: [{ tag: "en:e171" }],
      },
      {
        id: "6",
        name: "Brightening Eye Cream",
        brand: "LuxeGlow",
        score: "82.0",
        ingredients: [
          { text: "Aqua", percent: 60 },
          { text: "Caffeine", percent: 10 },
          { text: "Niacinamide", percent: 5 },
          { text: "Vitamin E", percent: 5 },
        ],
        additives: [],
      },
    ])

    setFeaturedIngredients([
      {
        id: "hyaluronic-acid",
        name: "Hyaluronic Acid",
        description: "Hydrating ingredient",
        imageUrl: "/placeholder.svg?height=100&width=100&text=H",
      },
      {
        id: "niacinamide",
        name: "Niacinamide",
        description: "Brightening ingredient",
        imageUrl: "/placeholder.svg?height=100&width=100&text=N",
      },
      {
        id: "retinol",
        name: "Retinol",
        description: "Anti-aging ingredient",
        imageUrl: "/placeholder.svg?height=100&width=100&text=R",
      },
      {
        id: "vitamin-c",
        name: "Vitamin C",
        description: "Antioxidant ingredient",
        imageUrl: "/placeholder.svg?height=100&width=100&text=V",
      },
    ])
  }

  // Helper function to get random items from array
  const getRandomItems = (array, count) => {
    if (!array.length) return []
    const shuffled = [...array].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(count, shuffled.length))
  }

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!searchQuery.trim()) return

    setIsSearching(true)

    try {
      // Redirect to search results page with query parameter
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    } catch (error) {
      console.error("Error during search:", error)
    } finally {
      setIsSearching(false)
    }
  }

  // Filter products based on active tab
  const getFilteredProducts = () => {
    switch (activeTab) {
      case "detailed":
        return products.filter((p) => p.ingredients?.length > 5 || p.additives?.length > 0)
      case "minimal":
        return products.filter((p) => p.ingredients?.length <= 5)
      case "all":
      default:
        return products
    }
  }

  const filteredProducts = getFilteredProducts()

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#e6f4f1] to-[#f0f9f7] text-foreground">
      {/* Hero Section */}
      <section className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
        <motion.div
          className="max-w-2xl mx-auto text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 tracking-tight">Beauty begins with truth</h1>
          <p className="text-gray-600 text-lg">Better understand your beauty products to make informed choices.</p>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center p-4">
            <Search className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
            <Input
              className="border-none flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
              placeholder="Find a product and get its scoring"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              disabled={isSearching}
              className="text-gray-500 hover:text-gray-700"
            >
              {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
          </div>
          <div className="border-t px-4 py-2 flex items-center text-sm text-gray-500 bg-gray-50">
            <Plus className="h-4 w-4 mr-2" />
            <span>Filters</span>
          </div>
        </motion.form>
      </section>

      {/* Ingredients Section */}
      <section className="py-16 px-6 md:px-10 max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">What your cosmetics really contain</h2>
          </div>
          <div>
            <p className="text-gray-600">Discover the ingredients in your products and what they mean for your skin.</p>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {isLoading
            ? // Skeleton loaders while loading
            Array(4)
              .fill(0)
              .map((_, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <div className="bg-white rounded-lg p-4 shadow-sm h-[200px]">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                    <div className="bg-gray-100 p-4 rounded-md flex items-center justify-center">
                      <Skeleton className="h-16 w-16 rounded-md" />
                    </div>
                  </div>
                </motion.div>
              ))
            : featuredIngredients.map((ingredient, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link href={`/ingredients/${ingredient.id}`} className="block h-full">
                  <IngredientCard
                    name={ingredient.name}
                    description={ingredient.description}
                    imageUrl={ingredient.imageUrl}
                  />
                </Link>
              </motion.div>
            ))}
        </motion.div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-6 md:px-10 max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center">
            <Sparkles className="h-8 w-8 text-emerald-500 mr-3" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Discover products</h2>
          </div>
          <div>
            <p className="text-gray-600">
              Explore cosmetics with varying levels of ingredient information to help you make informed choices.
            </p>
          </div>
        </motion.div>

        <div className="mt-8">
          <div className="mt-8">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {renderProductCards(
                products
                  .filter((p) => parseFloat(p.score) > 75)
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 6),
                isLoading
              )}
            </motion.div>
          </div>

        </div>
      </section>
    </main>
  )
}

// Helper function to render product cards
function renderProductCards(products, isLoading) {
  if (isLoading) {
    return Array(6)
      .fill(0)
      .map((_, index) => (
        <motion.div key={index} variants={itemVariants}>
          <div className="bg-white rounded-lg p-4 shadow-sm h-[150px]">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-20 mt-2" />
              </div>
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </div>
        </motion.div>
      ))
  }

  if (products.length === 0) {
    return (
      <div className="col-span-full text-center py-10">
        <p className="text-gray-500">No products found matching your criteria.</p>
      </div>
    )
  }

  return products.map((product, index) => (
    <motion.div key={index} variants={itemVariants}>
      <Link href={`/products/${product.id}`} className="block h-full">
        <ProductCard
          name={product.name}
          brand={product.brand}
          score={product.score}
          ingredients={product.ingredients}
          additives={product.additives}
        />
      </Link>
    </motion.div>
  ))
}
