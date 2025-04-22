"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

export default function ContributionForm({ onSubmit, initialData = null }) {
  // État du formulaire
  const [formData, setFormData] = useState({
    product_name: "",
    brands: "",
    ingredients: [{ text: "", percent: 100 }],
    labeltags: [],
    additives: [],
  })

  // État pour les labels et additifs disponibles
  const [availableLabels, setAvailableLabels] = useState({})
  const [labelCategories, setLabelCategories] = useState({})
  const [searchAdditive, setSearchAdditive] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(true)
  const [searchTimeout, setSearchTimeout] = useState(null)

  // Initialiser le formulaire avec les données existantes si disponibles
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
    fetchLabels()
  }, [initialData])

  // Récupérer les labels disponibles
  const fetchLabels = async () => {
    try {
      setFormLoading(true)
      const response = await fetch("http://localhost:3000/labels")
      if (response.ok) {
        const data = await response.json()
        setAvailableLabels(data.labels)
        setLabelCategories(data.categories)
      }
    } catch (error) {
      console.error("Error fetching labels:", error)
      toast.error("Error fetching labels")
    } finally {
      setFormLoading(false)
    }
  }

  // Fonction de recherche d'additifs avec debounce
  const searchAdditives = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([])
      return
    }

    try {
      console.log("Searching for additives:", query)
      setIsLoading(true)

      const response = await fetch(`http://localhost:3000/additives/tag/${query}`)
      console.log("Response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Search results:", data)

        if (data.result && Array.isArray(data.additives)) {
          setSearchResults(data.additives)
        } else {
          console.error("Unexpected response format:", data)
          setSearchResults([])
        }
      } else {
        console.error("Error searching for additives:", response.statusText)
        setSearchResults([])
      }
    } catch (error) {
      console.error("Exception searching for additives:", error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Gérer les changements dans la recherche d'additifs avec debounce
  const handleAdditiveSearch = (e) => {
    const query = e.target.value
    setSearchAdditive(query)

    // Annuler le timeout précédent
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // Définir un nouveau timeout pour la recherche
    if (query.length >= 2) {
      const timeout = setTimeout(() => {
        searchAdditives(query)
      }, 500) // Attendre 500ms avant de lancer la recherche

      setSearchTimeout(timeout)
    } else {
      setSearchResults([])
    }
  }

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Gérer les changements d'ingrédients
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients]
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: field === "percent" ? Number(value) : value,
    }
    setFormData((prev) => ({
      ...prev,
      ingredients: newIngredients,
    }))
  }

  // Ajouter un ingrédient
  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { text: "", percent: 0 }],
    }))
  }

  // Supprimer un ingrédient
  const removeIngredient = (index) => {
    const newIngredients = [...formData.ingredients]
    newIngredients.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      ingredients: newIngredients,
    }))
  }

  // Gérer les changements de labels
  const handleLabelChange = (labelId) => {
    setFormData((prev) => {
      const newLabels = prev.labeltags.includes(labelId)
        ? prev.labeltags.filter((id) => id !== labelId)
        : [...prev.labeltags, labelId]
      return {
        ...prev,
        labeltags: newLabels,
      }
    })
  }

  // Ajouter un additif
  const addAdditive = (additive) => {
    const additiveExists = formData.additives.some((a) => a.tag === additive.tag)

    if (additiveExists) {
      toast.info(`Additive ${additive.tag} is already in the list`)
      return
    }

    const newAdditive = {
      tag: additive.tag,
      shortName: additive.shortName || additive.name?.en || additive.tag,
      additiveRef: additive._id,
    }

    setFormData((prev) => ({
      ...prev,
      additives: [...prev.additives, newAdditive],
    }))

    toast.success(`Additive ${additive.tag} added`)
  }

  // Supprimer un additif
  const removeAdditive = (index) => {
    const newAdditives = [...formData.additives]
    newAdditives.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      additives: newAdditives,
    }))
  }

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.product_name || !formData.brands) {
      toast.error("Product name and brand are required")
      return
    }

    // Filtrer les ingrédients vides avant de soumettre
    const filteredData = {
      ...formData,
      ingredients: formData.ingredients.filter((ingredient) => ingredient.text.trim() !== ""),
    }

    // Vérifier s'il reste des ingrédients après filtrage
    if (filteredData.ingredients.length === 0) {
      // Si tous les ingrédients sont vides, ajouter un tableau vide
      filteredData.ingredients = []
    }

    onSubmit(filteredData)
  }

  if (formLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 text-green-700 border-b pb-2">General Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="product_name">
              Product name *
            </label>
            <input
              type="text"
              id="product_name"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="brands">
              Brand *
            </label>
            <input
              type="text"
              id="brands"
              name="brands"
              value={formData.brands}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 text-green-700 border-b pb-2">Ingredients</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={ingredient.text}
                onChange={(e) => handleIngredientChange(index, "text", e.target.value)}
                placeholder="Ingredient name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              />
              <input
                type="number"
                value={ingredient.percent}
                onChange={(e) => handleIngredientChange(index, "percent", e.target.value)}
                placeholder="%"
                min="0"
                max="100"
                className="shadow appearance-none border rounded w-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
          >
            Add ingredient
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 text-green-700 border-b pb-2">Additives</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-700 font-bold" htmlFor="additive-search">
                Search for an additive
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                id="additive-search"
                value={searchAdditive}
                onChange={handleAdditiveSearch}
                placeholder="e.g. E100, E200..."
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {searchAdditive.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchAdditive("")
                    setSearchResults([])
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              )}
              {isLoading && (
                <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-500"></div>
                </div>
              )}
            </div>

            {searchAdditive.length >= 2 && (
              <div className="mt-1 text-xs text-gray-500">
                {isLoading
                  ? "Searching..."
                  : searchResults.length > 0
                    ? `${searchResults.length} additive(s) found`
                    : "No additives found"}
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="mt-2 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((additive) => (
                  <div
                    key={additive._id}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                    onClick={() => addAdditive(additive)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-green-700">{additive.tag}</span>
                        {additive.name?.en && <span className="ml-2 text-gray-600">{additive.name.en}</span>}
                      </div>
                      <button
                        type="button"
                        className="bg-green-100 hover:bg-green-200 text-green-800 text-xs py-1 px-2 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          addAdditive(additive)
                        }}
                      >
                        Add
                      </button>
                    </div>
                    {additive.fonction && <p className="text-xs text-gray-500 mt-1">Function: {additive.fonction}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {formData.additives.length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">Selected additives ({formData.additives.length}):</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {formData.additives.map((additive, index) => (
                  <div key={index} className="bg-white border rounded-lg p-2 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-green-700">{additive.tag}</span>
                      {additive.shortName && additive.shortName !== additive.tag && (
                        <span className="ml-2 text-sm text-gray-600">{additive.shortName}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAdditive(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full h-6 w-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 text-green-700 border-b pb-2">Labels</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(labelCategories).map((category) => (
              <div key={category} className="mb-4">
                <h3 className="font-semibold mb-2">{category}</h3>
                <div className="space-y-2">
                  {labelCategories[category].map((labelId) => (
                    <div key={labelId} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`label-${labelId}`}
                        checked={formData.labeltags.includes(labelId)}
                        onChange={() => handleLabelChange(labelId)}
                        className="mr-2"
                      />
                      <label htmlFor={`label-${labelId}`}>{availableLabels[labelId]?.canonical || labelId}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:scale-105"
        >
          Submit product
        </button>
      </div>
    </form>
  )
}
