"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <Card className="max-w-md w-full shadow-xl">
        <CardContent className="p-6 flex flex-col gap-6 items-center text-center">
          <h1 className="text-3xl font-bold">Bienvenue sur SwitchMarket</h1>
          <p className="text-muted-foreground text-sm">
            Comparez facilement les produits cosmétiques selon leurs ingrédients et additifs.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
