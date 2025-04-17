"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 w-full px-10 py-4 flex justify-between items-center z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-[#78E5A8]"
      }`}
    >
      <Link href="/" className="text-xl font-black tracking-wide">
        SWITCH MARKET
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <Link
          href="/searchResults"
          className="text-black hover:text-emerald-700 transition-colors font-medium"
        >
          Search
        </Link>
        <Link
          href="/spotted"
          className="text-black hover:text-emerald-700 transition-colors font-medium"
        >
          Spotted
        </Link>
        <Link
          href="/shop"
          className="text-black hover:text-emerald-700 transition-colors font-medium"
        >
          Shop
        </Link>
        <Link
          href="/discover"
          className="text-black hover:text-emerald-700 transition-colors font-medium"
        >
          Discover
        </Link>
      </nav>

      <div className="hidden md:flex items-center gap-1">
        <Button
          variant="outline"
          className="font-bold text-sm px-3 py-1 h-8 border-[#DCDBE6]"
          asChild
        >
          <Link href="/login">Sign in</Link>
        </Button>
        <Button
          className="bg-black hover:bg-gray-800 text-white font-bold text-sm px-3 py-1 h-8"
          asChild
        >
          <Link href="/register">Login</Link>
        </Button>
      </div>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 top-[72px] bg-white z-40 p-6 md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex flex-col space-y-6">
              <Link
                href="/searchResults"
                className="text-black hover:text-emerald-700 text-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Search
              </Link>
              <Link
                href="/spotted"
                className="text-black hover:text-emerald-700 text-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Spotted
              </Link>
              <Link
                href="/shop"
                className="text-black hover:text-emerald-700 text-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/discover"
                className="text-black hover:text-emerald-700 text-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Discover
              </Link>

              <div className="pt-6 border-t border-gray-100 flex flex-col space-y-4">
                <Button
                  variant="outline"
                  className="w-full font-bold border-[#DCDBE6]"
                  asChild
                >
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button
                  className="w-full bg-black hover:bg-gray-800 text-white font-bold"
                  asChild
                >
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
