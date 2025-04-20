// "use client"

// import { motion } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Save, X, Loader2 } from 'lucide-react'

// export function ProfileEditForm({ formData, handleInputChange, handleSubmit, handleCancel, loading }) {
//     return (
//         <motion.form
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.3 }}
//             onSubmit={handleSubmit}
//             className="space-y-4"
//         >
//             <div className="grid gap-4 sm:grid-cols-2">
//                 <div className="space-y-2">
//                     <Label htmlFor="username" className="font-medium">
//                         Nom d'utilisateur
//                     </Label>
//                     <Input
//                         id="username"
//                         name="username"
//                         value={formData.username}
//                         onChange={handleInputChange}
//                         required
//                         className="border-gray-300 focus:border-[#78E5A8] focus:ring-[#78E5A8]"
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <Label htmlFor="email" className="font-medium">
//                         Email
//                     </Label>
//                     <Input
//                         id="email"
//                         name="email"
//                         type="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         required
//                         className="border-gray-300 focus:border-[#78E5A8] focus:ring-[#78E5A8]"
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <Label htmlFor="firstname" className="font-medium">
//                         Prénom
//                     </Label>
//                     <Input
//                         id="firstname"
//                         name="firstname"
//                         value={formData.firstname}
//                         onChange={handleInputChange}
//                         required
//                         className="border-gray-300 focus:border-[#78E5A8] focus:ring-[#78E5A8]"
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <Label htmlFor="lastname" className="font-medium">
//                         Nom
//                     </Label>
//                     <Input
//                         id="lastname"
//                         name="lastname"
//                         value={formData.lastname}
//                         onChange={handleInputChange}
//                         required
//                         className="border-gray-300 focus:border-[#78E5A8] focus:ring-[#78E5A8]"
//                     />
//                 </div>
//                 <div className="space-y-2 sm:col-span-2">
//                     <Label htmlFor="birthdate" className="font-medium">
//                         Date de naissance
//                     </Label>
//                     <Input
//                         id="birthdate"
//                         name="birthdate"
//                         type="date"
//                         value={formData.birthdate}
//                         onChange={handleInputChange}
//                         required
//                         className="border-gray-300 focus:border-[#78E5A8] focus:ring-[#78E5A8]"
//                     />
//                 </div>
//             </div>

//             <div className="pt-6 border-t mt-6">
//                 <h3 className="text-lg font-semibold mb-4">Changer de mot de passe</h3>
//                 <div className="grid gap-4 sm:grid-cols-2">
//                     <div className="space-y-2 sm:col-span-2">
//                         <Label htmlFor="currentPassword" className="font-medium">
//                             Mot de passe actuel
//                         </Label>
//                         <Input
//                             id="currentPassword"
//                             name="currentPassword"
//                             type="password"
//                             value={formData.currentPassword}
//                             onChange={handleInputChange}
//                             className="border-gray-300 focus:border-[#78E5A8] focus:ring-[#78E5A8]"
//                         />
//                     </div>
//                     <div className="space-y-2">
//                         <Label htmlFor="newPassword" className="font-medium">
//                             Nouveau mot de passe
//                         </Label>
//                         <Input
//                             id="newPassword"
//                             name="newPassword"
//                             type="password"
//                             value={formData.newPassword}
//                             onChange={handleInputChange}
//                             className="border-gray-300 focus:border-[#78E5A8] focus:ring-[#78E5A8]"
//                         />
//                     </div>
//                     <div className="space-y-2">
//                         <Label htmlFor="confirmPassword" className="font-medium">
//                             Confirmer le mot de passe
//                         </Label>
//                         <Input
//                             id="confirmPassword"
//                             name="confirmPassword"
//                             type="password"
//                             value={formData.confirmPassword}
//                             onChange={handleInputChange}
//                             className="border-gray-300 focus:border-[#78E5A8] focus:ring-[#78E5A8]"
//                         />
//                     </div>
//                 </div>
//             </div>

//             <div className="flex justify-end gap-2 pt-6">
//                 <Button type="button" variant="outline" onClick={handleCancel} className="border-gray-300 hover:bg-gray-100">
//                     <X className="mr-2 h-4 w-4" />
//                     Annuler
//                 </Button>
//                 <Button type="submit" disabled={loading} className="bg-[#78E5A8] hover:bg-[#5bc88a] text-black">
//                     {loading ? (
//                         <>
//                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                             Enregistrement...
//                         </>
//                     ) : (
//                         <>
//                             <Save className="mr-2 h-4 w-4" />
//                             Enregistrer
//                         </>
//                     )}
//                 </Button>
//             </div>
//         </motion.form>
//     )
// }

"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, X, Loader2, Eye, EyeOff, User, Mail, Calendar, Lock } from "lucide-react"
import { useState } from "react"

export function ProfileEditForm({ formData, handleInputChange, handleSubmit, handleCancel, loading }) {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  }

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  return (
    <motion.form
      initial="hidden"
      animate="show"
      variants={containerVariants}
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Personal info block */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-emerald-600" />
          Personal Information
        </h3>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center gap-2 font-medium text-gray-700">
              <User className="h-4 w-4 text-emerald-600" />
              Username
            </Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 font-medium text-gray-700">
              <Mail className="h-4 w-4 text-emerald-600" />
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="firstname" className="flex items-center gap-2 font-medium text-gray-700">
              <User className="h-4 w-4 text-emerald-600" />
              First name
            </Label>
            <Input
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              required
              className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastname" className="flex items-center gap-2 font-medium text-gray-700">
              <User className="h-4 w-4 text-emerald-600" />
              Last name
            </Label>
            <Input
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              required
              className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="birthdate" className="flex items-center gap-2 font-medium text-gray-700">
              <Calendar className="h-4 w-4 text-emerald-600" />
              Birthdate
            </Label>
            <Input
              id="birthdate"
              name="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleInputChange}
              required
              className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
            />
          </div>
        </div>
      </motion.div>

      {/* Password block */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Lock className="h-5 w-5 text-emerald-600" />
          Change Password
        </h3>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="currentPassword" className="font-medium text-gray-700">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showPassword.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="font-medium text-gray-700">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showPassword.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleInputChange}
                className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-medium text-gray-700">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.div variants={itemVariants} className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className="border-gray-300 hover:bg-gray-50 text-gray-700"
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </motion.div>
    </motion.form>
  )
}
