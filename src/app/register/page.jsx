"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  UserPlus,
  Mail,
  Lock,
  Calendar,
  User,
} from "lucide-react";
import { BASE_APIURL } from "@/config";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    birthdate: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_APIURL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account successfully created!");
        setTimeout(() => {
          router.push("/login");
        }, 600);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Server connection error");
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    {
      id: "firstname",
      label: "First name",
      type: "text",
      placeholder: "Your first name",
      icon: <User className="h-3.5 w-3.5 text-emerald-600" />,
      colSpan: "col-span-1",
    },
    {
      id: "lastname",
      label: "Last name",
      type: "text",
      placeholder: "Your last name",
      icon: <User className="h-3.5 w-3.5 text-emerald-600" />,
      colSpan: "col-span-1",
    },
    {
      id: "username",
      label: "Username",
      type: "text",
      placeholder: "Choose a username",
      icon: <UserPlus className="h-3.5 w-3.5 text-emerald-600" />,
      colSpan: "col-span-2",
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "Your email address",
      icon: <Mail className="h-3.5 w-3.5 text-emerald-600" />,
      colSpan: "col-span-2",
    },
    {
      id: "password",
      label: "Password",
      type: showPassword ? "text" : "password",
      placeholder: "Create a password",
      icon: <Lock className="h-3.5 w-3.5 text-emerald-600" />,
      colSpan: "col-span-2",
      hasToggle: true,
    },
    {
      id: "birthdate",
      label: "Date of birth",
      type: "date",
      icon: <Calendar className="h-3.5 w-3.5 text-emerald-600" />,
      colSpan: "col-span-2",
    },
  ];

  return (
    <main className="min-h-screen relative isolate overflow-hidden">
      {/* Hero Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "url('/sign-in_hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-black/50 -z-10" />

      <div className="min-h-screen flex items-center justify-center p-4 py-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          <div className="relative">
            <div className="bg-white border-2 border-black p-8 rounded-none transition-all duration-300">
              <div className="mb-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-3.5 bg-emerald-100 rounded-none">
                    <UserPlus className="h-7 w-7 text-emerald-600" />
                  </div>
                </div>
                <h1 className="text-3xl font-medium text-gray-900 mb-2 tracking-tight">
                  Create an account
                </h1>
                <p className="text-gray-500">Join our community</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                  {formFields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      className={`space-y-2 ${field.colSpan}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Label
                        htmlFor={field.id}
                        className="text-sm font-medium flex items-center gap-2 text-gray-700"
                      >
                        {field.icon}
                        <span>{field.label}</span>
                      </Label>
                      <div
                        className={`relative transition-all duration-300 ${
                          focusedField === field.id ? "scale-[1.01]" : ""
                        }`}
                      >
                        <Input
                          id={field.id}
                          name={field.id}
                          type={field.type}
                          value={form[field.id]}
                          onChange={handleChange}
                          onFocus={() => setFocusedField(field.id)}
                          onBlur={() => setFocusedField(null)}
                          required
                          placeholder={field.placeholder}
                          className={`h-12 rounded-none border-2 border-gray-200 focus:border-black focus:ring-black/5 transition-all duration-300 ${
                            field.hasToggle ? "pr-12" : ""
                          }`}
                        />
                        {field.hasToggle && (
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1.5"
                          >
                            {showPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
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
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Create account
                        <UserPlus className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>

              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center text-sm font-medium text-black hover:text-gray-700 transition-colors"
                  >
                    Sign in
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
