"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    return (
        <header className="w-full border-b p-4 flex justify-between items-center bg-background text-foreground">
            <Link href="/" className="text-lg font-semibold">SwitchMarket</Link>

            <nav className="flex gap-4">
                <Button variant="ghost" asChild>
                    <Link href="/login">Se connecter</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/register">S'inscrire</Link>
                </Button>
            </nav>
        </header>
    );
}
