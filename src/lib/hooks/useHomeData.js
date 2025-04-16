import { useEffect, useState } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function useHomeData() {
    const [products, setProducts] = useState([])
    const [additives, setAdditives] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            try {
                const [productsRes, additivesRes] = await Promise.all([
                    fetch(`${API_URL}/products/random/6`),
                    fetch(`${API_URL}/additives/random/6`)
                ])
                const productsData = await productsRes.json()
                const additivesData = await additivesRes.json()

                if (productsData.result && productsData.products) {
                    const processedProducts = productsData.products.map((p) => ({
                        id: p._id,
                        name: p.product_name,
                        brand: p.brands,
                        score: p.completion_score,
                        ingredients: p.ingredients || [],
                        additives: p.additives || [],
                        labeltags: p.labeltags || [],
                    }))
                    setProducts(processedProducts)
                }

                if (additivesData.result && additivesData.additives) {
                    const processedAdditives = additivesData.additives.map((a) => ({
                        id: a._id,
                        name: a.name?.en || a.shortName || "Unknown",
                        description: a.description?.en || "No description available",
                        imageUrl: `/placeholder.svg?height=100&width=100&text=${encodeURIComponent(a.shortName || "A")}`,
                    }))
                    setAdditives(processedAdditives)
                }
            } catch (error) {
                console.error("Error loading data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [])

    return { products, additives, isLoading }
}
