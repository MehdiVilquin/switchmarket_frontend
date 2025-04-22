// "use client"

// import { Button } from "@/components/ui/button"
// import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { LogOut } from 'lucide-react'
// import { useAuth } from "@/app/contexts/auth-context"

// export function ProfileHeader() {
//     const { logout } = useAuth()

//     return (
//         <CardHeader className="bg-gradient-to-r from-[#78E5A8] to-[#5bc88a] pb-6 relative">
//             <div className="absolute right-4 top-4">
//                 <Button variant="outline" size="icon" onClick={logout} className="bg-white hover:bg-gray-100 text-black">
//                     <LogOut className="h-4 w-4" />
//                 </Button>
//             </div>
//             <CardTitle className="text-2xl font-bold text-black">Mon Profil</CardTitle>
//             <CardDescription className="text-black/70 font-medium">
//                 Consultez et gérez vos informations personnelles
//             </CardDescription>
//         </CardHeader>
//     )
// }

"use client"

import { Button } from "@/components/ui/button"
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { motion } from "framer-motion"

export function ProfileHeader() {
  const { logout } = useAuth()

  return (
    <CardHeader className="relative overflow-hidden p-8">
      {/* Arrière-plan avec dégradé amélioré */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

      {/* Formes décoratives subtiles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-1/3 translate-y-[-50%]"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full transform translate-x-[-30%] translate-y-[30%]"></div>

      {/* Contenu avec position relative pour apparaître au-dessus du fond */}
      <div className="relative">
        <div className="absolute right-0 top-0">
          <Button
            variant="outline"
            size="icon"
            onClick={logout}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <CardTitle className="text-2xl md:text-3xl font-bold text-white mb-2">My Profile</CardTitle>
          <CardDescription className="text-white/80 font-medium text-base">
            View and manage your personal information
          </CardDescription>
        </motion.div>
      </div>
    </CardHeader>
  )
}
