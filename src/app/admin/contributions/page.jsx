"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export default function AdminContributionsPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [contributions, setContributions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [reviewNotes, setReviewNotes] = useState("")
  const [selectedContribution, setSelectedContribution] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Rediriger si non connecté
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Access denied. Please log in.")
      router.push("/login")
      return
    }

    // Vérifier si l'utilisateur est admin
    checkAdminStatus()
  }, [isAuthenticated, loading, router])

  // Vérifier si l'utilisateur est admin
  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Access denied. Please log in.")
        router.push("/login")
        return
      }

      const response = await fetch("http://localhost:3000/contributions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setIsAdmin(true)
        fetchAllContributions()
      } else {
        toast.error("Error checking admin rights")
        router.push("/")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Server connection error")
    }
  }

  // Charger toutes les contributions
  const fetchAllContributions = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:3000/contributions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setContributions(data.contributions)
      } else {
        toast.error("Error fetching contributions")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Server connection error")
    } finally {
      setIsLoading(false)
    }
  }

  // Ouvrir la modal de révision
  const openReviewModal = (contribution) => {
    setSelectedContribution(contribution)
    setReviewNotes("")
  }

  // Fermer la modal
  const closeReviewModal = () => {
    setSelectedContribution(null)
    setReviewNotes("")
  }

  // Approuver une contribution
  const approveContribution = async () => {
    if (!selectedContribution) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:3000/contributions/${selectedContribution._id}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes: reviewNotes }),
      })

      if (response.ok) {
        toast.success("Contribution successfully approved")
        closeReviewModal()
        fetchAllContributions()
      } else {
        const data = await response.json()
        toast.error(data.message || "Error approving contribution")
      }
    } catch (error) {
      console.error("Error approving contribution:", error)
      toast.error("Server connection error")
    }
  }

  // Rejeter une contribution
  const rejectContribution = async () => {
    if (!selectedContribution) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:3000/contributions/${selectedContribution._id}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes: reviewNotes }),
      })

      if (response.ok) {
        toast.success("Contribution successfully rejected")
        closeReviewModal()
        fetchAllContributions()
      } else {
        const data = await response.json()
        toast.error(data.message || "Error rejecting contribution")
      }
    } catch (error) {
      console.error("Error rejecting contribution:", error)
      toast.error("Server connection error")
    }
  }

  if (loading || !isAuthenticated || !isAdmin) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2 text-green-700">Contribution Administration</h1>
        <p className="text-gray-600 mb-4">Review and validate contributions submitted by users.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : contributions.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-lg">No contributions to review.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-green-50 text-green-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Product</th>
                  <th className="py-3 px-6 text-left">Brand</th>
                  <th className="py-3 px-6 text-left">Submitted by</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {contributions.map((contribution) => (
                  <tr key={contribution._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">{contribution.product_name}</td>
                    <td className="py-3 px-6 text-left">{contribution.brands}</td>
                    <td className="py-3 px-6 text-left">
                      {contribution.submittedBy?.username || "Unknown user"}
                    </td>
                    <td className="py-3 px-6 text-left">{new Date(contribution.submittedAt).toLocaleDateString()}</td>
                    <td className="py-3 px-6 text-left">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          contribution.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : contribution.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {contribution.status === "pending"
                          ? "Pending"
                          : contribution.status === "approved"
                            ? "Approved"
                            : "Rejected"}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      {contribution.status === "pending" ? (
                        <button
                          onClick={() => openReviewModal(contribution)}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs transition-colors duration-200"
                        >
                          Review
                        </button>
                      ) : (
                        <button
                          onClick={() => openReviewModal(contribution)}
                          className="text-blue-500 hover:text-blue-700 text-xs underline transition-colors duration-200"
                        >
                          View details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de révision */}
      {selectedContribution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-green-700">
              {selectedContribution.status === "pending" ? "Review Contribution" : "Contribution Details"}
            </h2>

            <div className="mb-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">{selectedContribution.product_name}</h3>
              <p className="text-gray-600">Brand: {selectedContribution.brands}</p>
              <p className="text-gray-600">
                Submitted by: {selectedContribution.submittedBy?.username || "Unknown user"}
              </p>
              <p className="text-gray-600">Date: {new Date(selectedContribution.submittedAt).toLocaleDateString()}</p>
              <p className="mt-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    selectedContribution.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : selectedContribution.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedContribution.status === "pending"
                    ? "Pending"
                    : selectedContribution.status === "approved"
                      ? "Approved"
                      : "Rejected"}
                </span>
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Ingredients:</h3>
              {selectedContribution.ingredients.length > 0 ? (
                <ul className="list-disc pl-5 bg-white p-3 rounded border">
                  {selectedContribution.ingredients.map((ingredient, index) => (
                    <li key={index}>
                      {ingredient.text} ({ingredient.percent}%)
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No ingredients specified</p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Labels:</h3>
              {selectedContribution.labeltags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedContribution.labeltags.map((label, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {label}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No labels specified</p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Additives:</h3>
              {selectedContribution.additives && selectedContribution.additives.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedContribution.additives.map((additive, index) => (
                    <div key={index} className="bg-orange-50 border border-orange-200 rounded p-2">
                      <div className="font-semibold text-orange-800">{additive.tag}</div>
                      {additive.additiveRef && (
                        <>
                          {additive.additiveRef.name?.en && (
                            <div className="text-sm">{additive.additiveRef.name.en}</div>
                          )}
                          {additive.additiveRef.fonction && (
                            <div className="text-xs text-gray-600">Function: {additive.additiveRef.fonction}</div>
                          )}
                          {additive.additiveRef.risk && (
                            <div className="text-xs text-gray-600">Risk: {additive.additiveRef.risk}</div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No additives specified</p>
              )}
            </div>

            {selectedContribution.status === "pending" && (
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="reviewNotes">
                  Comment (optional)
                </label>
                <textarea
                  id="reviewNotes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  placeholder="Add a comment on this contribution..."
                ></textarea>
              </div>
            )}

            {selectedContribution.reviewNotes && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Review comment:</h3>
                <div className="bg-gray-50 p-3 rounded border italic">"{selectedContribution.reviewNotes}"</div>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                onClick={closeReviewModal}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
              >
                {selectedContribution.status === "pending" ? "Cancel" : "Close"}
              </button>

              {selectedContribution.status === "pending" && (
                <>
                  <button
                    onClick={rejectContribution}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
                  >
                    Reject
                  </button>
                  <button
                    onClick={approveContribution}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
