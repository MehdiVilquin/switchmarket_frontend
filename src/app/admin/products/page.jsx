"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { BASE_APIURL } from "@/config"
import {
    Search,
    RefreshCw,
    Edit,
    Trash,
    ChevronLeft,
    ChevronRight,
    X,
    Plus,
    Tag,
    ShoppingBag,
    AlertTriangle,
} from "lucide-react"
import Link from "next/link"

export default function AdminProductsPage() {
    const { isAuthenticated, loading, isAdmin } = useAuth()
    const router = useRouter()

    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        pages: 0,
    })
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [labels, setLabels] = useState({})
    const [additives, setAdditives] = useState([])
    const [editMode, setEditMode] = useState(false)
    const [editedProduct, setEditedProduct] = useState(null)

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                toast.error("Access denied. Please log in.")
                router.push("/login")
                return
            }

            if (!isAdmin()) {
                toast.error("Access denied. Admin only.")
                router.push("/")
                return
            }

            fetchProducts()
            fetchLabels()
            fetchAdditives()
        }
    }, [isAuthenticated, loading, isAdmin, router])

    // Fetch all products with pagination
    const fetchProducts = async (page = 1, searchQuery = "") => {
        try {
            setIsRefreshing(true)
            const token = localStorage.getItem("token")
            let url = `${BASE_APIURL}/products?page=${page}&limit=10`

            if (searchQuery) {
                url += `&all=${encodeURIComponent(searchQuery)}`
            }

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                if (data.result) {
                    setProducts(data.products)
                    setPagination(data.pagination)
                } else {
                    toast.error("Error fetching products")
                }
            } else {
                toast.error("Error fetching products")
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Server connection error")
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }

    // Fetch labels
    const fetchLabels = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${BASE_APIURL}/labels`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                if (data.result) {
                    setLabels(data.labels)
                }
            }
        } catch (error) {
            console.error("Error fetching labels:", error)
        }
    }

    // Fetch additives
    const fetchAdditives = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${BASE_APIURL}/additives`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                if (data.result) {
                    setAdditives(data.additives)
                }
            }
        } catch (error) {
            console.error("Error fetching additives:", error)
        }
    }

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault()
        fetchProducts(1, searchTerm)
    }

    // Handle pagination
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.pages) {
            fetchProducts(newPage, searchTerm)
        }
    }

    // Delete product
    const deleteProduct = async (productId) => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${BASE_APIURL}/products/${productId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await response.json()

            if (response.ok && data.result) {
                toast.success("Product deleted successfully")
                setConfirmDelete(null)
                fetchProducts(pagination.page, searchTerm)
            } else {
                toast.error(data.message || "Error deleting product")
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Server connection error")
        }
    }

    // View product details
    const viewProductDetails = async (productId) => {
        try {
            setIsLoading(true)
            const token = localStorage.getItem("token")
            const response = await fetch(`${BASE_APIURL}/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                if (data.result) {
                    setSelectedProduct(data.product)
                } else {
                    toast.error("Error fetching product details")
                }
            } else {
                toast.error("Error fetching product details")
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Server connection error")
        } finally {
            setIsLoading(false)
        }
    }

    // Edit product
    const startEditProduct = (product) => {
        setEditedProduct({
            ...product,
            ingredients: [...product.ingredients],
            labeltags: [...product.labeltags],
            additives: [...product.additives],
        })
        setEditMode(true)
    }

    // Update product
    const updateProduct = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${BASE_APIURL}/products/${editedProduct._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editedProduct),
            })

            const data = await response.json()

            if (response.ok && data.result) {
                toast.success("Product updated successfully")
                setEditMode(false)
                setEditedProduct(null)
                fetchProducts(pagination.page, searchTerm)
                if (selectedProduct && selectedProduct._id === editedProduct._id) {
                    setSelectedProduct(data.product)
                }
            } else {
                toast.error(data.message || "Error updating product")
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Server connection error")
        }
    }

    // Handle ingredient changes
    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = [...editedProduct.ingredients]
        updatedIngredients[index] = {
            ...updatedIngredients[index],
            [field]: field === "percent" ? Number.parseFloat(value) : value,
        }
        setEditedProduct({
            ...editedProduct,
            ingredients: updatedIngredients,
        })
    }

    // Add new ingredient
    const addIngredient = () => {
        setEditedProduct({
            ...editedProduct,
            ingredients: [...editedProduct.ingredients, { text: "", percent: 0 }],
        })
    }

    // Remove ingredient
    const removeIngredient = (index) => {
        const updatedIngredients = [...editedProduct.ingredients]
        updatedIngredients.splice(index, 1)
        setEditedProduct({
            ...editedProduct,
            ingredients: updatedIngredients,
        })
    }

    // Handle label changes
    const handleLabelChange = (e) => {
        const options = e.target.options
        const selectedLabels = []
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedLabels.push(options[i].value)
            }
        }
        setEditedProduct({
            ...editedProduct,
            labeltags: selectedLabels,
        })
    }

    if (loading || isLoading) {
        return (
            <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
                        <p className="text-gray-600">Manage and edit products in the database</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => fetchProducts(pagination.page, searchTerm)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
                            disabled={isRefreshing}
                        >
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 p-2.5"
                        placeholder="Search by product name, brand, ingredient..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="absolute right-2.5 bottom-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm px-4 py-1"
                    >
                        Search
                    </button>
                </form>

                {products.length === 0 ? (
                    <div className="text-center py-8">
                        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-gray-500 text-lg">No products found</p>
                        <p className="text-gray-400">Try adjusting your search criteria</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="bg-emerald-50 text-emerald-700 uppercase text-xs leading-normal">
                                        <th className="py-3 px-6 text-left">Product Name</th>
                                        <th className="py-3 px-6 text-left">Brand</th>
                                        <th className="py-3 px-6 text-center">Ingredients</th>
                                        <th className="py-3 px-6 text-center">Labels</th>
                                        <th className="py-3 px-6 text-center">Chemical %</th>
                                        <th className="py-3 px-6 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 text-sm">
                                    {products.map((product) => (
                                        <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-6 text-left font-medium">{product.product_name}</td>
                                            <td className="py-3 px-6 text-left">{product.brands}</td>
                                            <td className="py-3 px-6 text-center">{product.ingredients?.length || 0}</td>
                                            <td className="py-3 px-6 text-center">
                                                <div className="flex flex-wrap justify-center gap-1">
                                                    {product.labeltags?.slice(0, 2).map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                                                            title={labels[tag]?.canonical || tag}
                                                        >
                                                            {labels[tag]?.canonical || tag}
                                                        </span>
                                                    ))}
                                                    {product.labeltags?.length > 2 && (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                                            +{product.labeltags.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${product.chemicalPercentage > 50
                                                        ? "bg-red-100 text-red-800"
                                                        : product.chemicalPercentage > 25
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-green-100 text-green-800"
                                                        }`}
                                                >
                                                    {product.chemicalPercentage}%
                                                </span>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <div className="flex justify-center items-center gap-2">
                                                    <button
                                                        onClick={() => viewProductDetails(product._id)}
                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                        title="View Details"
                                                    >
                                                        <Search className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => startEditProduct(product)}
                                                        className="text-emerald-600 hover:text-emerald-900 p-1"
                                                        title="Edit Product"
                                                    >
                                                        <Edit className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDelete(product._id)}
                                                        className="text-red-600 hover:text-red-900 p-1"
                                                        title="Delete Product"
                                                    >
                                                        <Trash className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between items-center mt-6">
                            <div className="text-sm text-gray-500">
                                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className={`p-2 rounded-lg ${pagination.page === 1
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                        }`}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                    // Calculate page numbers to show (centered around current page)
                                    let pageNum
                                    if (pagination.pages <= 5) {
                                        pageNum = i + 1
                                    } else if (pagination.page <= 3) {
                                        pageNum = i + 1
                                    } else if (pagination.page >= pagination.pages - 2) {
                                        pageNum = pagination.pages - 4 + i
                                    } else {
                                        pageNum = pagination.page - 2 + i
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-10 h-10 rounded-lg ${pagination.page === pageNum
                                                ? "bg-emerald-500 text-white"
                                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    )
                                })}
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.pages}
                                    className={`p-2 rounded-lg ${pagination.page === pagination.pages
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                        }`}
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Product Details Modal */}
            {selectedProduct && !editMode && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold text-emerald-700">{selectedProduct.product_name}</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => startEditProduct(selectedProduct)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm transition-colors"
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </button>
                                <button onClick={() => setSelectedProduct(null)} className="text-gray-500 hover:text-gray-700">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-700 mb-2">Product Information</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="mb-2">
                                            <span className="font-medium">Brand:</span> {selectedProduct.brands}
                                        </p>
                                        <p className="mb-2">
                                            <span className="font-medium">OBF Product ID:</span> {selectedProduct.OBFProductId}
                                        </p>
                                        <p>
                                            <span className="font-medium">Chemical Percentage:</span>{" "}
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${selectedProduct.chemicalPercentage > 50
                                                    ? "bg-red-100 text-red-800"
                                                    : selectedProduct.chemicalPercentage > 25
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-green-100 text-green-800"
                                                    }`}
                                            >
                                                {selectedProduct.chemicalPercentage}%
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-700 mb-2">Ingredients</h3>
                                    {selectedProduct.ingredients && selectedProduct.ingredients.length > 0 ? (
                                        <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                                            <table className="min-w-full">
                                                <thead>
                                                    <tr className="text-left text-xs text-gray-500">
                                                        <th className="pb-2">Ingredient</th>
                                                        <th className="pb-2">Percentage</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedProduct.ingredients.map((ingredient, index) => (
                                                        <tr key={index} className="border-t border-gray-200">
                                                            <td className="py-2">{ingredient.text}</td>
                                                            <td className="py-2">{ingredient.percent}%</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">No ingredients listed</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-700 mb-2">Labels</h3>
                                    {selectedProduct.labeltags && selectedProduct.labeltags.length > 0 ? (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex flex-wrap gap-2">
                                                {selectedProduct.labeltags.map((tag, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-1"
                                                    >
                                                        <Tag className="h-3.5 w-3.5" />
                                                        {labels[tag]?.canonical || tag}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">No labels assigned</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-700 mb-2">Additives</h3>
                                    {selectedProduct.additives && selectedProduct.additives.length > 0 ? (
                                        <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                                            {selectedProduct.additives.map((additive, index) => (
                                                <div key={index} className="mb-3 last:mb-0 border-b border-gray-200 pb-3 last:border-0">
                                                    <div className="font-medium text-emerald-700">{additive.tag}</div>
                                                    <div className="text-sm text-gray-600">{additive.shortName}</div>
                                                    {additive.additiveRef && (
                                                        <div className="mt-1 text-xs text-gray-500">
                                                            {additive.additiveRef.name?.fr && <div>{additive.additiveRef.name.fr}</div>}
                                                            {additive.additiveRef.risk && (
                                                                <div className="flex items-center gap-1 mt-1">
                                                                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                                                                    Risk: {additive.additiveRef.risk}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">No additives listed</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {editMode && editedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold text-emerald-700">Edit Product</h2>
                            <button
                                onClick={() => {
                                    setEditMode(false)
                                    setEditedProduct(null)
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2" htmlFor="product_name">
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        id="product_name"
                                        value={editedProduct.product_name}
                                        onChange={(e) => setEditedProduct({ ...editedProduct, product_name: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2" htmlFor="brands">
                                        Brand
                                    </label>
                                    <input
                                        type="text"
                                        id="brands"
                                        value={editedProduct.brands}
                                        onChange={(e) => setEditedProduct({ ...editedProduct, brands: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2" htmlFor="chemicalPercentage">
                                        Chemical Percentage
                                    </label>
                                    <input
                                        type="number"
                                        id="chemicalPercentage"
                                        min="0"
                                        max="100"
                                        value={editedProduct.chemicalPercentage}
                                        onChange={(e) =>
                                            setEditedProduct({ ...editedProduct, chemicalPercentage: Number.parseFloat(e.target.value) })
                                        }
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2" htmlFor="labels">
                                        Labels
                                    </label>
                                    <select
                                        id="labels"
                                        multiple
                                        value={editedProduct.labeltags}
                                        onChange={handleLabelChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 h-40"
                                    >
                                        {Object.entries(labels).map(([id, label]) => (
                                            <option key={id} value={id}>
                                                {label.canonical}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple labels</p>
                                </div>
                            </div>

                            <div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2">Ingredients</label>
                                    <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                                        {editedProduct.ingredients.map((ingredient, index) => (
                                            <div key={index} className="flex items-center gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={ingredient.text}
                                                    onChange={(e) => handleIngredientChange(index, "text", e.target.value)}
                                                    placeholder="Ingredient name"
                                                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                                />
                                                <input
                                                    type="number"
                                                    value={ingredient.percent}
                                                    onChange={(e) => handleIngredientChange(index, "percent", e.target.value)}
                                                    placeholder="Percentage"
                                                    min="0"
                                                    max="100"
                                                    className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeIngredient(index)}
                                                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addIngredient}
                                            className="mt-2 w-full p-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 flex items-center justify-center gap-1"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Ingredient
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setEditMode(false)
                                    setEditedProduct(null)
                                }}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateProduct}
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Deletion</h2>
                        <p className="mb-6 text-gray-600">
                            Are you sure you want to delete this product? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteProduct(confirmDelete)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
