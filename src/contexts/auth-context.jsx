"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Création du contexte d'authentification
const AuthContext = createContext(undefined)

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
    }
    return context
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    // Fonction pour vérifier si l'utilisateur est connecté
    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem("token")

            if (!token) {
                setUser(null)
                setLoading(false)
                return
            }

            const response = await fetch("http://localhost:3000/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const userData = await response.json()
                setUser(userData)
            } else {
                // Token invalide ou expiré
                localStorage.removeItem("token")
                setUser(null)
            }
        } catch (error) {
            console.error("Erreur lors de la vérification de l'authentification:", error)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    // Fonction de connexion
    const login = async (credentials) => {
        try {
            setLoading(true)
            const res = await fetch("http://localhost:3000/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            })

            const data = await res.json()

            if (res.ok) {
                localStorage.setItem("token", data.token)
                await checkAuthStatus() // Récupérer les informations utilisateur
                toast.success("Connexion réussie !")
                return { success: true }
            } else {
                toast.error(data.message || "Erreur lors de la connexion")
                return { success: false, error: data.message }
            }
        } catch (error) {
            toast.error("Erreur de connexion au serveur")
            return { success: false, error: "Erreur de connexion au serveur" }
        } finally {
            setLoading(false)
        }
    }

    // Fonction de déconnexion
    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
        toast.success("Déconnexion réussie")
        router.push("/")
    }

    // Vérifier l'état d'authentification au chargement
    useEffect(() => {
        checkAuthStatus()
    }, [])

    // Valeur du contexte
    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser: checkAuthStatus,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
