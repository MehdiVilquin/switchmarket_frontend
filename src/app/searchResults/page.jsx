import SearchResultsPage from "@/components/sections/SearchResults/SearchResultsPage"
import { Suspense } from "react"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Chargement des résultats...</div>}>
      <SearchResultsPage />
    </Suspense>
  )
}
