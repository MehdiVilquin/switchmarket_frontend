"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { loginUser } from "@/lib/login";

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await loginUser({ usernameOrEmail, password });
      localStorage.setItem("token", token);
      toast.success("Login successful!");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <>
      <style jsx global>{`
        .pattern-background {
          background-color: #f8fafc;
          background-image: radial-gradient(#a8b9b0 1.8px, transparent 1.8px);
          background-size: 28px 28px;
        }
        .content-wrapper {
          min-height: calc(100vh - 100px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.5rem;
        }
        .text-overlay {
          background-color: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(2px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
      `}</style>

      <div className="relative">
        <div className="pattern-background content-wrapper"></div>

        <div className="absolute inset-0 flex items-center justify-center px-6 py-10">
          <div className="relative z-10 flex flex-col md:flex-row w-full max-w-7xl rounded-xl overflow-hidden shadow-xl border bg-white">
            {/* Mobile image */}
            <div
              className="md:hidden w-full flex items-end justify-center bg-cover bg-center relative h-56"
              style={{ backgroundImage: "url('/hero-background.jpg')" }}
            >
              <div className="text-overlay text-white p-6 rounded-xl max-w-xs text-center mb-4">
                <motion.h3
                  className="text-xl font-semibold mb-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Join the ethical beauty movement
                </motion.h3>
                <motion.p
                  className="text-xs text-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Sign in to explore your favorite products.
                </motion.p>
              </div>
            </div>

            {/* Form */}
            <div className="w-full md:w-1/2 p-6 md:p-10 bg-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-black text-center">
                Sign in
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="email">Username or email</Label>
                  <Input
                    id="email"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={remember}
                      onCheckedChange={(checked) => setRemember(!!checked)}
                    />
                    <label htmlFor="remember" className="text-gray-600 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <Link href="/forgot-password" className="text-green-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-neutral-800"
                >
                  Sign in
                </Button>
              </form>
            </div>

            {/* Desktop image */}
            <div
              className="hidden md:flex md:w-1/2 items-end justify-center bg-cover bg-center relative"
              style={{ backgroundImage: "url('/hero-background.jpg')" }}
            >
              <div className="text-overlay text-white p-10 rounded-xl max-w-md text-center mb-16">
                <motion.h3
                  className="text-2xl font-semibold mb-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Join the ethical beauty movement
                </motion.h3>
                <motion.p
                  className="text-sm text-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Sign in to explore, rate and track your favorite products.  
                  Make conscious choices for yourself and the planet.
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
