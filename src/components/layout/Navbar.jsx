"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await fetch("http://localhost:3000/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setIsLoggedIn(true);
            setUsername(userData.username || userData.firstname);
          } else {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("Error checking login status:", error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
    window.addEventListener("login-success", checkLoginStatus);
    return () => window.removeEventListener("login-success", checkLoginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Successfully logged out");
    router.push("/");
    setMobileMenuOpen(false);
  };

  return (
    <header
    className={`sticky top-0 w-full px-10 py-2 flex justify-between items-center z-50 transition-all duration-300 ${
      isScrolled ? "bg-white shadow-sm" : "bg-[#78E5A8]"
    }`}
  >
  
  <Link href="/" className="relative w-[120px] h-[120px] -mb-10 z-50 block">
  <img
    src="/logoswitch.png"
    alt="Switch Market Logo"
    className="w-full h-full object-contain rounded-xl border border-[#3c6e47] shadow-lg bg-[#e6f5e5] hover:scale-105 transition-transform"
  />
</Link>






      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <Link href="/searchResults" className="text-black hover:text-emerald-700 transition-colors font-medium">
          Search
        </Link>
        <Link href="/spotted" className="text-black hover:text-emerald-700 transition-colors font-medium">
          Spotted
        </Link>
        <Link href="/shop" className="text-black hover:text-emerald-700 transition-colors font-medium">
          Shop
        </Link>
        <Link href="/discover" className="text-black hover:text-emerald-700 transition-colors font-medium">
          Discover
        </Link>
      </nav>

      <div className="hidden md:flex items-center gap-1">
        {isLoggedIn ? (
          <>
            <Button variant="ghost" className="font-medium text-sm px-3 py-1 h-8 flex items-center gap-1" asChild>
              <Link href="/profile">
                <User className="h-4 w-4 mr-1" />
                {username}
              </Link>
            </Button>
            <Button
              variant="outline"
              className="font-bold text-sm px-3 py-1 h-8 border-[#DCDBE6]"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" className="font-bold text-sm px-3 py-1 h-8 border-[#DCDBE6]" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button className="bg-black hover:bg-gray-800 text-white font-bold text-sm px-3 py-1 h-8" asChild>
              <Link href="/register">Sign up</Link>
            </Button>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
              <Link href="/searchResults" className="text-black hover:text-emerald-700 text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                Search
              </Link>
              <Link href="/spotted" className="text-black hover:text-emerald-700 text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                Spotted
              </Link>
              <Link href="/shop" className="text-black hover:text-emerald-700 text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                Shop
              </Link>
              <Link href="/discover" className="text-black hover:text-emerald-700 text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                Discover
              </Link>

              {isLoggedIn && (
                <Link href="/profile" className="text-black hover:text-emerald-700 text-lg font-medium flex items-center" onClick={() => setMobileMenuOpen(false)}>
                  <User className="h-5 w-5 mr-2" />
                  My Profile
                </Link>
              )}

              <div className="pt-6 border-t border-gray-100 flex flex-col space-y-4">
                {isLoggedIn ? (
                  <Button className="w-full bg-black hover:bg-gray-800 text-white font-bold" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="w-full font-bold border-[#DCDBE6]" asChild>
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        Sign in
                      </Link>
                    </Button>
                    <Button className="w-full bg-black hover:bg-gray-800 text-white font-bold" asChild>
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        Sign up
                      </Link>
                    </Button>
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
