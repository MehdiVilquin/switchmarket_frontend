import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from 'lucide-react'
import Image from "next/image"

export default function IngredientCard({ name, description, imageUrl }) {
    // Generate a background color based on the ingredient name
    const generateColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        // Generate pastel colors
        const h = Math.abs(hash) % 360;
        return `hsl(${h}, 70%, 90%)`;
    }

    const bgColor = generateColor(name);

    return (
        <Card className="bg-white hover:shadow-lg transition-all duration-300 h-full border border-gray-100 overflow-hidden group">
            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-medium text-gray-800 group-hover:text-emerald-600 transition-colors">{name}</h3>
                        <p className="text-xs text-gray-500">{description}</p>
                    </div>
                    <div className="bg-emerald-50 p-1 rounded-full text-emerald-500 transform group-hover:translate-x-1 transition-transform">
                        <ChevronRight className="h-4 w-4" />
                    </div>
                </div>
                <div
                    className="rounded-md flex items-center justify-center p-4 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: bgColor }}
                >
                    <Image
                        src={imageUrl || "/placeholder.png"}
                        alt={name}
                        width={80}
                        height={80}
                        className="opacity-80"
                    />
                </div>
            </CardContent>
        </Card>
    )
}
