"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Eye, EyeOff, LogIn, User, Lock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const router = useRouter()
  const { refreshUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
      })

      const data = await res.json()
      if (res.ok) {
        toast.success("Connexion réussie !");
        localStorage.setItem("token", data.token);

        await refreshUser();

        //Redirection après mise à jour du contexte
        router.push("/");
      } else {
        toast.error(data.message || "Erreur de connexion");
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-600/10 rounded-full blur-3xl"></div>

          <div className="bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
            <div className="mb-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-emerald-100 rounded-full">
                  <LogIn className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Bienvenue</h1>
              <p className="text-gray-500">Connectez-vous à votre compte</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                className="space-y-1.5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Label htmlFor="usernameOrEmail" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Email ou nom d'utilisateur</span>
                </Label>
                <div
                  className={`relative transition-all duration-300 ${focusedField === "usernameOrEmail" ? "scale-[1.01]" : ""}`}
                >
                  <Input
                    id="usernameOrEmail"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    onFocus={() => setFocusedField("usernameOrEmail")}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="h-12 pl-4 pr-4 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300"
                    placeholder="Entrez votre email ou nom d'utilisateur"
                  />
                </div>
              </motion.div>

              <motion.div
                className="space-y-1.5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Mot de passe</span>
                </Label>
                <div
                  className={`relative transition-all duration-300 ${focusedField === "password" ? "scale-[1.01]" : ""}`}
                >
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="h-12 pl-4 pr-12 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300"
                    placeholder="Entrez votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-full hover:bg-gray-100"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Button
                  type="submit"
                  className="w-full cursor-pointer h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-1px]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <span>Connexion en cours...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      Se connecter
                      <LogIn className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Nouveau sur la plateforme ?</span>
                </div>
              </div>

              <div className="mt-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                >
                  Créer un compte
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
