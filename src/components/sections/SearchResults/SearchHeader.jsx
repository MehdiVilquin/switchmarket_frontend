"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { X, Search } from "lucide-react";

export default function SearchHeader() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }

    router.replace(`/searchResults?${params.toString()}`, { scroll: false });
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.replace(`/searchResults?${params.toString()}`, { scroll: false });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white py-6 px-4 md:px-8 border-b sticky top-0 z-10"
    >
      <div className="max-w-4xl mx-auto flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit..."
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            <X className="w-4 h-4 mr-1" />
            Vider
          </button>
        )}
        <button
          type="submit"
          className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
        >
          Rechercher
        </button>
      </div>
    </form>
  );
}
