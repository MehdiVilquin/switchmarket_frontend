"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function CommunitySection() {
  const { isAuthenticated } = useAuth()

  return (
    <section className="py-16 px-4 md:px-8 bg-[#FBF9F7]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge
                variant="outline"
                className="bg-white/90 text-gray-800 rounded-full px-4 py-1 text-sm border-gray-200"
              >
                Community
              </Badge>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mb-6 leading-[1.2]">
              Join our community of conscious consumers
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Connect with like-minded individuals who share your passion for sustainable and ethical beauty products.
              Share experiences, discover new products, and make informed choices together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-black hover:bg-gray-900 text-white rounded-lg px-8 h-12 text-base"
                asChild
              >
                <Link href={isAuthenticated ? "/profile" : "/register"}>Join Community</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-8 h-12 text-base"
                asChild
              >
                <Link href="/learn-more">Learn More</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden aspect-[4/3]"
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url('/community-image.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
