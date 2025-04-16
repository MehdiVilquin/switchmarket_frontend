"use client"

import useHomeData from "@/lib/hooks/useHomeData"
import HeroSection from "@/components/sections/HeroSection"
import FeaturesSection from "@/components/sections/FeaturesSection"
import ProductSection from "@/components/sections/ProductSection"
import TestimonialsSection from "@/components/sections/TestimonialsSection"
import AdditivesSection from "@/components/sections/AdditivesSection"
import CommunitySection from "@/components/sections/CommunitySection"

export default function Home() {
  const { products, additives, isLoading } = useHomeData()

  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <ProductSection products={products} isLoading={isLoading} />
      <TestimonialsSection />
      <AdditivesSection additives={additives} isLoading={isLoading} />
      <CommunitySection />
    </main>
  )
}
