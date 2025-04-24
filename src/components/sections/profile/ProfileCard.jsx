"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { ProfileHeader } from "./ProfileHeader"
import { ProfileView } from "./ProfileView"
import { ProfileEditForm } from "./ProfileEditForm"
import { BASE_APIURL } from "@/config"

export function ProfileCard() {
    const { user, refreshUser } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        username: user?.username || "",
        email: user?.email || "",
        firstname: user?.firstname || "",
        lastname: user?.lastname || "",
        birthdate: user?.birthdate ? new Date(user.birthdate).toISOString().split("T")[0] : "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    // Fonction pour formater la date de naissance
    const formatDate = (dateString) => {
        if (!dateString) return "Not specified"
        const date = new Date(dateString)
        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleEditToggle = () => {
        setIsEditing(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
        // Réinitialiser le formulaire
        setFormData({
            username: user?.username || "",
            email: user?.email || "",
            firstname: user?.firstname || "",
            lastname: user?.lastname || "",
            birthdate: user?.birthdate ? new Date(user.birthdate).toISOString().split("T")[0] : "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Vérification des mots de passe si l'utilisateur souhaite le changer
        if (formData.newPassword) {
            if (!formData.currentPassword) {
                toast.error("Please enter your current password")
                return
            }

            if (formData.newPassword !== formData.confirmPassword) {
                toast.error("New passwords do not match")
                return
            }
        }

        setLoading(true)

        try {
            const token = localStorage.getItem("token")

            // Préparer les données à envoyer
            const dataToSend = {
                username: formData.username,
                email: formData.email,
                firstname: formData.firstname,
                lastname: formData.lastname,
                birthdate: formData.birthdate,
            }

            // Ajouter les mots de passe seulement s'ils sont fournis
            if (formData.currentPassword && formData.newPassword) {
                dataToSend.currentPassword = formData.currentPassword
                dataToSend.newPassword = formData.newPassword
            }

            const response = await fetch(`${BASE_APIURL}/users/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(dataToSend),
            })

            const data = await response.json()

            if (response.ok) {
                toast.success("Profile updated successfully")
                setIsEditing(false)
                // Rafraîchir les données utilisateur
                refreshUser()
            } else {
                toast.error(data.message || "Error updating profile")
            }
        } catch (error) {
            toast.error("Server connection error")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="shadow-lg border-none overflow-hidden">
            <ProfileHeader />
            <CardContent className="pt-6">
                {isEditing ? (
                    <ProfileEditForm
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        handleCancel={handleCancel}
                        loading={loading}
                    />
                ) : (
                    <ProfileView user={user} onEdit={handleEditToggle} formatDate={formatDate} />
                )}
            </CardContent>
        </Card>
    )
}
