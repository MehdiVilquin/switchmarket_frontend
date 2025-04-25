"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const { isAuthenticated, logout, user, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 w-full px-6 py-4 flex justify-between items-center z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-[#78E5A8]"
      }`}
    >
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="font-semibold text-2xl hover:text-emerald-700 transition-colors"
        >
          SkinEthic
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <Link
          href="/searchResults"
          className="text-black hover:text-emerald-700 transition-colors font-medium relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-emerald-700 after:transition-all"
        >
          Search
        </Link>

        <Link
          href="/discover"
          className="text-black hover:text-emerald-700 transition-colors font-medium relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-emerald-700 after:transition-all"
        >
          Discover
        </Link>
        {isAuthenticated ? (
          <Link
            href="/contributions"
            className="text-black hover:text-emerald-700 transition-colors font-medium relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-emerald-700 after:transition-all"
          >
            Community
          </Link>
        ) : (
          <Link
            href="/contribute"
            className="text-black hover:text-emerald-700 transition-colors font-medium relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-emerald-700 after:transition-all"
          >
            Join the community
          </Link>
        )}
      </nav>

      <div className="hidden md:flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <Button
              variant="ghost"
              className="font-medium text-sm px-3 py-1 h-8 flex items-center gap-1 hover:bg-emerald-50 transition-colors"
              asChild
            >
              <Link href="/profile">
                <User className="h-4 w-4 mr-1" />
                <span className="truncate max-w-[100px]">
                  {user?.username || user?.firstname}
                </span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer font-bold text-sm px-3 py-1 h-8 border-[#DCDBE6] hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              className="font-bold text-sm px-3 py-1 h-8 border-[#DCDBE6] hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
              asChild
            >
              <Link href="/login">Sign in</Link>
            </Button>
            <Button
              className="bg-black hover:bg-emerald-700 text-white font-bold text-sm px-3 py-1 h-8 transition-colors"
              asChild
            >
              <Link href="/register">Sign up</Link>
            </Button>
          </>
        )}
        {isAdmin() && (
          <Link
            href="/admin"
            className="ml-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors font-medium"
          >
            Admin
          </Link>
        )}
      </div>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden hover:bg-black/10 transition-colors"
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
            className="fixed inset-0 top-[72px] bg-white z-40 shadow-lg md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex flex-col space-y-6 p-6">
              <Link
                href="/searchResults"
                className="text-black hover:text-emerald-700 text-lg font-medium p-2 -mx-2 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Search
              </Link>
              <Link
                href="/discover"
                className="text-black hover:text-emerald-700 text-lg font-medium p-2 -mx-2 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Discover
              </Link>
              {isAuthenticated ? (
                <Link
                  href="/contributions"
                  className="text-black hover:text-emerald-700 text-lg font-medium p-2 -mx-2 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Community
                </Link>
              ) : (
                <Link
                  href="/contribute"
                  className="text-black hover:text-emerald-700 text-lg font-medium p-2 -mx-2 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join community
                </Link>
              )}
              <div className="pt-6 border-t">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center text-black hover:text-emerald-700 text-lg font-medium mb-4 p-2 -mx-2 rounded-md hover:bg-gray-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5 mr-2" />
                      {user?.username || user?.firstname}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center text-black hover:text-emerald-700 text-lg font-medium p-2 -mx-2 rounded-md hover:bg-gray-50 transition-colors w-full text-left"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </button>

                    {isAdmin() && (
                      <Link
                        href="/admin"
                        className="flex items-center mt-4 text-amber-700 bg-amber-50 hover:bg-amber-100 text-lg font-medium p-2 rounded-md transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block text-black hover:text-emerald-700 text-lg font-medium mb-4 p-2 -mx-2 rounded-md hover:bg-gray-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      className="block text-white bg-black hover:bg-emerald-700 text-lg font-medium mb-4 p-2 -mx-2 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
