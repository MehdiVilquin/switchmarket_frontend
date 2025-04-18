"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import ContributionForm from "@/components/sections/Contributions/contribution-form"

export default function ContributionPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [contributions, setContributions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(true)

  // Rediriger si non connecté
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Vous devez être connecté pour accéder à cette page")
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  // Charger les contributions de l'utilisateur
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserContributions()
    }
  }, [isAuthenticated])

  // Récupérer les contributions de l'utilisateur
  const fetchUserContributions = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:3000/contributions/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setContributions(data.contributions)
      } else {
        toast.error("Erreur lors de la récupération des contributions")
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur de connexion au serveur")
    } finally {
      setIsLoading(false)
    }
  }

  // Soumettre le formulaire
  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:3000/contributions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Produit soumis avec succès")
        // Rafraîchir la liste des contributions
        fetchUserContributions()
        // Masquer le formulaire après soumission réussie
        setShowForm(false)
      } else {
        toast.error(data.message || "Erreur lors de la soumission du produit")
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur de connexion au serveur")
    }
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2 text-green-700">Proposer un produit</h1>
        <p className="text-gray-600 mb-4">
          Contribuez à notre base de données en proposant de nouveaux produits. Votre contribution sera examinée par
          notre équipe avant d'être publiée.
        </p>

        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
          >
            {showForm ? "Masquer le formulaire" : "Proposer un produit"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-8">
          <ContributionForm onSubmit={handleSubmit} />
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-green-700 border-b pb-2">Mes contributions</h2>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : contributions.length === 0 ? (
          <p className="text-center py-8 text-gray-500">Vous n'avez pas encore soumis de produits.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contributions.map((contribution) => (
              <div
                key={contribution._id}
                className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-4">
                  <h3 className="font-bold text-lg text-green-700">{contribution.product_name}</h3>
                  <p className="text-gray-600">{contribution.brands}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {contribution.additives && contribution.additives.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {contribution.additives.slice(0, 3).map((additive, idx) => (
                          <span key={idx} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                            {additive.tag}
                          </span>
                        ))}
                        {contribution.additives.length > 3 && (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                            +{contribution.additives.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {contribution.labeltags && contribution.labeltags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {contribution.labeltags.slice(0, 3).map((label, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {label}
                          </span>
                        ))}
                        {contribution.labeltags.length > 3 && (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                            +{contribution.labeltags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs ${
                          contribution.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : contribution.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {contribution.status === "pending"
                          ? "En attente"
                          : contribution.status === "approved"
                            ? "Approuvé"
                            : "Rejeté"}
                      </span>
                      <p className="text-xs text-gray-500">{new Date(contribution.submittedAt).toLocaleDateString()}</p>
                    </div>

                    {contribution.reviewNotes && (
                      <p className="text-sm mt-2 italic text-gray-600 bg-gray-50 p-2 rounded">
                        "{contribution.reviewNotes}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
