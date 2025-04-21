"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Eye, EyeOff, UserPlus, Mail, Lock, Calendar, User } from "lucide-react"

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    birthdate: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const router = useRouter()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Compte créé avec succès !")
        setTimeout(() => {
          router.push("/login")
        }, 600)
      } else {
        toast.error(data.message || "Échec de l'inscription")
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur")
    } finally {
      setIsLoading(false)
    }
  }

  const formFields = [
    {
      id: "firstname",
      label: "Prénom",
      type: "text",
      placeholder: "Votre prénom",
      icon: <User className="h-3.5 w-3.5 text-emerald-600" />,
      colSpan: "col-span-1",
    },
    {
      id: "lastname",
      label: "Nom",
      type: "text",
      placeholder: "Votre nom",
      icon: <User className="h-3.5 w-3.5 text-emerald-600" />,
      colSpan: "col-span-1",
    },
    {
      id: "username",
      label: "Nom d'utilisateur",
      type: "text",
      placeholder: "Choisissez un nom d'utilisateur",
      icon: <UserPlus className="h-3.5 w-3.5 text-emerald-600" />,
      colSpan: "col-span-2",
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "Votre adresse email",
      icon: <Mail className="h-3.5 w-3.5 text-emerald-600" />,
      colSpan: "col-span-2",
    },
    {
      id: "password",
      label: "Mot de passe",
      type: showPassword ? "text" : "password",
      placeholder: "Créez un mot de passe",
      icon: <Lock className="h-3.5 w-3.5 text-emerald-600" />,
      colSpan: "col-span-2",
      hasToggle: true,
    },
    {
      id: "birthdate",
      label: "Date de naissance",
      type: "date",
      icon: <Calendar className="h-3.5 w-3.5 text-emerald-600" />,
      colSpan: "col-span-2",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gray-50 flex items-center justify-center p-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-600/10 rounded-full blur-3xl"></div>

          <div className="bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
            <div className="mb-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-emerald-100 rounded-full">
                  <UserPlus className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Créer un compte</h1>
              <p className="text-gray-500">Rejoignez notre communauté</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                {formFields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    className={`space-y-1.5 ${field.colSpan}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Label htmlFor={field.id} className="text-sm font-medium flex items-center gap-2">
                      {field.icon}
                      <span>{field.label}</span>
                    </Label>
                    <div
                      className={`relative transition-all duration-300 ${focusedField === field.id ? "scale-[1.01]" : ""}`}
                    >
                      <Input
                        id={field.id}
                        name={field.id}
                        type={field.type}
                        value={form[field.id]}
                        onChange={handleChange}
                        onFocus={() => setFocusedField(field.id)}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder={field.placeholder}
                        className={`rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300 ${field.hasToggle ? "pr-12" : ""}`}
                      />
                      {field.hasToggle && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-full hover:bg-gray-100"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-2"
              >
                <Button
                  type="submit"
                  className="w-full cursor-pointer h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-1px]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <span>Création en cours...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      Créer un compte
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Déjà inscrit ?</span>
                </div>
              </div>

              <div className="mt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                >
                  Se connecter
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
