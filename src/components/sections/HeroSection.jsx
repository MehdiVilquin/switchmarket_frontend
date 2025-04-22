"use client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      router.push(`/searchResults?q=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section className="relative py-12 sm:py-16 md:pt-16 md:pb-24 px-4 md:px-8 min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/hero-background.jpg')",
          backgroundPosition: "50% 50%",
          backgroundSize: "cover",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-300 text-white-800 hover:bg-emerald-200 transition-colors">
            Ethical Beauty Choices
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[80px] font-medium text-white leading-tight tracking-tight md:leading-[1.35] -tracking-[0.02em] mb-2 sm:mb-4 whitespace-nowrap">
            Beauty begins with truth
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-[24px] font-regular text-white tracking-tight md:leading-[1.35] -tracking-[0.02em] mb-6 sm:mb-8">
            Better understand your beauty products to make informed choices
          </h2>

          <motion.form
            onSubmit={handleSearch}
            className="max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto bg-white rounded-[20px] shadow-lg overflow-hidden border border-[#DCDBE6] mb-4 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-2 sm:p-2.5">
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center gap-2 sm:gap-2.5 px-2 sm:px-2.5 py-2 sm:py-2.5 w-full">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-[#9997B4] stroke-[1.5]" />
                  <Input
                    className="border-none flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#9997B4] text-sm sm:text-base font-normal p-0"
                    placeholder="Find a product and get its scoring"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch(e);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}
