// "use client"

// import { motion } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { User, Mail, Calendar, Edit } from 'lucide-react'

// export function ProfileView({ user, onEdit, formatDate }) {
//     return (
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
//             <div className="grid gap-6">
//                 <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
//                     <User className="w-5 h-5 text-[#78E5A8]" />
//                     <div>
//                         <p className="text-sm text-gray-500 font-medium">Nom d'utilisateur</p>
//                         <p className="font-semibold">{user.username}</p>
//                     </div>
//                 </div>

//                 <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
//                     <Mail className="w-5 h-5 text-[#78E5A8]" />
//                     <div>
//                         <p className="text-sm text-gray-500 font-medium">Email</p>
//                         <p className="font-semibold">{user.email}</p>
//                     </div>
//                 </div>

//                 <div className="grid sm:grid-cols-2 gap-4">
//                     <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
//                         <div>
//                             <p className="text-sm text-gray-500 font-medium">Prénom</p>
//                             <p className="font-semibold">{user.firstname}</p>
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
//                         <div>
//                             <p className="text-sm text-gray-500 font-medium">Nom</p>
//                             <p className="font-semibold">{user.lastname}</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
//                     <Calendar className="w-5 h-5 text-[#78E5A8]" />
//                     <div>
//                         <p className="text-sm text-gray-500 font-medium">Date de naissance</p>
//                         <p className="font-semibold">{formatDate(user.birthdate)}</p>
//                     </div>
//                 </div>
//             </div>

//             <div className="pt-4 flex justify-center">
//                 <Button onClick={onEdit} className="bg-[#78E5A8] hover:bg-[#5bc88a] text-black w-full max-w-xs">
//                     <Edit className="mr-2 h-4 w-4" />
//                     Modifier le profil
//                 </Button>
//             </div>
//         </motion.div>
//     )
// }

"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { User, Mail, Calendar, Edit, ChevronRight } from "lucide-react"

export function ProfileView({ user, onEdit, formatDate }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 p-1">
      <motion.div variants={itemVariants} className="grid gap-6">
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100 shadow-sm"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-600">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 font-medium">Username</p>
            <p className="font-semibold text-gray-800">{user.username}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100 shadow-sm"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-600">
            <Mail className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 font-medium">Email</p>
            <p className="font-semibold text-gray-800">{user.email}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100 shadow-sm"
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
          >
            <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">First name</p>
              <p className="font-semibold text-gray-800">{user.firstname}</p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100 shadow-sm"
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
          >
            <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Last name</p>
              <p className="font-semibold text-gray-800">{user.lastname}</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100 shadow-sm"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 font-medium">Birthdate</p>
            <p className="font-semibold text-gray-800">{formatDate(user.birthdate)}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} className="pt-6 flex justify-center">
        <Button
          onClick={onEdit}
          className="relative overflow-hidden group bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition-all duration-300 w-full max-w-xs"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left"></span>
          <span className="relative flex items-center justify-center">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </span>
        </Button>
      </motion.div>
    </motion.div>
  )
}
