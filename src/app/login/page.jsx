"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form Submitted");

    // Vérifier les valeurs des champs avant de faire la requête
    console.log("Username or Email:", usernameOrEmail);
    console.log("Password:", password);

    const res = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernameOrEmail, password }),
    });

    // Vérifier la réponse du serveur
    console.log("Response status:", res.status);

    const data = await res.json();
    console.log("Response data:", data);

    if (res.ok) {
      toast.success("Connexion réussie !");
      localStorage.setItem("token", data.token);
      router.push("/"); // Redirige vers la home après login
    } else {
      toast.error(data.message || "Erreur de connexion");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-bold text-center">Connexion</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Email ou nom d'utilisateur</Label>
          <Input
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Mot de passe</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Se connecter
        </Button>
      </form>
    </div>
  );
}
