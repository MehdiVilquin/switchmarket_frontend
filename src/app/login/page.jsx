"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, User, Lock } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { BASE_APIURL } from "@/config";

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const router = useRouter();
  const { refreshUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_APIURL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Login successful!");
        localStorage.setItem("token", data.token);

        await refreshUser();

        //Redirection after context update
        router.push("/");
      } else {
        toast.error(data.message || "Login error");
      }
    } catch (error) {
      toast.error("Server connection error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative isolate overflow-hidden">
      {/* Hero Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "url('/discover_hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-black/50 -z-10" />

      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="relative">
            <div className="bg-white border-2 border-black p-8 rounded-none transition-all duration-300">
              <div className="mb-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-3.5 bg-emerald-100 rounded-none">
                    <LogIn className="h-7 w-7 text-emerald-600" />
                  </div>
                </div>
                <h1 className="text-3xl font-medium text-gray-900 mb-2 tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-gray-500">Sign in to your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label
                    htmlFor="usernameOrEmail"
                    className="text-sm font-medium flex items-center gap-2 text-gray-700"
                  >
                    <User className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Email or username</span>
                  </Label>
                  <div
                    className={`relative transition-all duration-300 ${
                      focusedField === "usernameOrEmail" ? "scale-[1.01]" : ""
                    }`}
                  >
                    <Input
                      id="usernameOrEmail"
                      value={usernameOrEmail}
                      onChange={(e) => setUsernameOrEmail(e.target.value)}
                      onFocus={() => setFocusedField("usernameOrEmail")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="h-12 pl-4 pr-4 rounded-none border-2 border-gray-200 focus:border-black focus:ring-black/5 transition-all duration-300"
                      placeholder="Enter your email or username"
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium flex items-center gap-2 text-gray-700"
                  >
                    <Lock className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Password</span>
                  </Label>
                  <div
                    className={`relative transition-all duration-300 ${
                      focusedField === "password" ? "scale-[1.01]" : ""
                    }`}
                  >
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="h-12 pl-4 pr-12 rounded-none border-2 border-gray-200 focus:border-black focus:ring-black/5 transition-all duration-300"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1.5"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-2"
                >
                  <Button
                    type="submit"
                    className={`w-full h-12 bg-black hover:bg-gray-900 text-white font-medium rounded-none transition-all duration-300 ${
                      isLoading ? "opacity-90 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Sign in
                        <LogIn className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>

              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      New to the platform?
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center text-sm font-medium text-black hover:text-gray-700 transition-colors"
                  >
                    Create an account
                    <svg
                      className="ml-1 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
