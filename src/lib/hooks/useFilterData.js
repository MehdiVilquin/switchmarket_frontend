"use client"
import { useState, useEffect, useRef } from "react"

/**
 * Incrémente un compteur dans une Map
 * @param {Map} map
 * @param {string} key
 */
const incrementMap = (map, key) => {
    if (!key) return
    map.set(key, (map.get(key) || 0) + 1)
}

/**
 * Génère un ID unique lisible
 * @param {string} prefix
 * @param {string} value
 * @param {number} index
 */
const generateId = (prefix, value, index) =>
    `${prefix}-${index}-${value.toLowerCase().replace(/\s+/g, "-")}`

/**
 * Hook personnalisé pour charger les données des filtres
 * @returns {{
 *   brands: Array,
 *   labels: Array,
 *   ingredients: Array,
 *   additives: Array,
 *   isLoading: boolean,
 *   error: string | null
 * }}
 */
export default function useFilterData() {
    const [brands, setBrands] = useState([])
    const [labels, setLabels] = useState([])
    const [ingredients, setIngredients] = useState([])
    const [additives, setAdditives] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const isMountedRef = useRef(true)

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        const abortController = new AbortController()
        const signal = abortController.signal

        const fetchFilterData = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const [productsRes, additivesRes] = await Promise.all([
                    fetch(`${API_URL}/products?limit=100`, { signal }),
                    fetch(`${API_URL}/additives`, { signal }),
                ])

                if (!productsRes.ok) throw new Error(`Erreur produits: ${productsRes.status}`)
                if (!additivesRes.ok) throw new Error(`Erreur additifs: ${additivesRes.status}`)

                const productsData = await productsRes.json()
                const additivesData = await additivesRes.json()

                if (!isMountedRef.current) return

                // === Marques / Labels / Ingrédients ===
                if (productsData?.products?.length) {
                    const brandsMap = new Map()
                    const labelsMap = new Map()
                    const ingredientsMap = new Map()

                    productsData.products.forEach((p) => {
                        if (p.brands) incrementMap(brandsMap, p.brands)

                        if (Array.isArray(p.labeltags)) {
                            p.labeltags.forEach((label) => incrementMap(labelsMap, label))
                        }

                        if (Array.isArray(p.ingredients)) {
                            p.ingredients.forEach((i) => incrementMap(ingredientsMap, i?.text))
                        }
                    })

                    setBrands(
                        Array.from(brandsMap).map(([name, count], i) => ({
                            id: generateId("brand", name, i),
                            name,
                            count,
                        }))
                    )

                    setLabels(
                        Array.from(labelsMap).map(([name, count], i) => ({
                            id: generateId("label", name, i),
                            name,
                            count,
                        }))
                    )

                    setIngredients(
                        Array.from(ingredientsMap)
                            .map(([name, count], i) => ({
                                id: generateId("ingredient", name, i),
                                name,
                                count,
                            }))
                            .sort((a, b) => b.count - a.count)
                            .slice(0, 30)
                    )
                }

                // === Additifs ===
                if (additivesData?.additives?.length) {
                    setAdditives(
                        additivesData.additives.map((a, i) => ({
                            id: generateId("additive", a.tag, i),
                            name: a.shortName,
                            fullName: a.name,
                            tag: a.tag,
                            count: 0, // Option : à calculer un jour
                        }))
                    )
                }
            } catch (err) {
                if (err.name !== "AbortError" && isMountedRef.current) {
                    console.error("Erreur filtres :", err)
                    setError(err.message)
                }
            } finally {
                if (isMountedRef.current) {
                    setIsLoading(false)
                }
            }
        }

        fetchFilterData()

        return () => {
            isMountedRef.current = false
            abortController.abort()
        }
    }, [])

    return { brands, labels, ingredients, additives, isLoading, error }
}
