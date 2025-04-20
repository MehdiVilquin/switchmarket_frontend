// "use client"

// import { useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Loader2, ChevronLeft } from 'lucide-react'
// import { motion } from "framer-motion"
// import { useRouter } from "next/navigation"
// import { useAuth } from "../contexts/auth-context"
// import { ProfileCard } from "@/components/sections/profile/ProfileCard"

// export default function ProfilePage() {
//     const { user, loading, isAuthenticated } = useAuth()
//     const router = useRouter()

//     // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
//     useEffect(() => {
//         if (!loading && !isAuthenticated) {
//             router.push("/login")
//         }
//     }, [loading, isAuthenticated, router])

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <Loader2 className="w-8 h-8 animate-spin text-[#78E5A8]" />
//             </div>
//         )
//     }

//     if (!isAuthenticated) {
//         return null // Redirection gérée par useEffect
//     }

//     return (
//         <div className="max-w-3xl mx-auto mt-12 px-4 pb-12">
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//                 <div className="mb-6 flex items-center">
//                     <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.push("/")}>
//                         <ChevronLeft className="h-4 w-4 mr-1" />
//                         Retour
//                     </Button>
//                 </div>

//                 <ProfileCard />
//             </motion.div>
//         </div>
//     )
// }

"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, ChevronLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ProfileCard } from "@/components/sections/profile/ProfileCard"

export default function ProfilePage() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
        <p className="text-gray-500 animate-pulse">Loading your profile...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="mb-6 flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="mr-2 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm"
              onClick={() => router.push("/")}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>

          <ProfileCard />
        </motion.div>
      </div>
    </div>
  )
}
