import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NoResults({ query }) {
    return (
        <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
                We couldn't find any products matching "{query}". Try using different keywords or browse our categories.
            </p>
            <Link href="/">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Return to Home</Button>
            </Link>
        </div>
    )
}
