"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Filter } from "lucide-react";
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
    <section className="relative pt-16 pb-24 px-4 md:px-8 h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/hero-background.jpg')",
          backgroundPosition: "50% 50%",
          backgroundSize: "cover",
          opacity: "0.8",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 px-3 py-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
            Ethical Beauty Choices
          </Badge>
          <h1 className="text-5xl md:text-[80px] font-medium text-black h-32 leading-tight tracking-tight md:leading-[1.35] -tracking-[0.02em] whitespace-nowrap">
            Beauty begins with truth
          </h1>

          <motion.form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto bg-white rounded-[20px] shadow-lg overflow-hidden border border-[#DCDBE6] mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-2.5">
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center gap-2.5 px-2.5 py-2.5 w-full">
                  <Search className="h-5 w-5 text-[#9997B4] stroke-[1.5]" />
                  <Input
                    className="border-none flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#9997B4] text-base font-normal p-0"
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
                <div className="flex justify-between items-end w-full">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-[#747288] border-[#DCDBE6] font-regular text-sm h-8 gap-2"
                    onClick={() => {
                      // TODO: Implement filters functionality
                      console.log("Filters clicked");
                    }}
                  >
                    <Filter className="h-4 w-4 text-[#9997B4] stroke-[1.5]" />
                    Filters
                  </Button>
                  <div className="flex justify-end items-center gap-3">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isSearching}
                      className="bg-white hover:bg-gray-50 border border-[#ECECEF] rounded-full h-10 w-10 p-2.5 transition-colors hover:border-[#9997B4]"
                      aria-label="Search"
                    >
                      {isSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin text-[#9997B4]" />
                      ) : (
                        <Search className="h-4 w-4 text-[#9997B4] stroke-[1.5]" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.form>

          {/* <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Understand what's in your beauty products and make informed choices
            for your skin and the planet.
          </p> */}
        </motion.div>
      </div>
    </section>
  );
}
