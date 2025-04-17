import { ArrowRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PromoBanner() {
    return (
        <div className="bg-gradient-to-r from-pink-200 to-pink-100 rounded-xl overflow-hidden shadow-md mb-8 relative">
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0 md:mr-6 z-10">
                    <h3 className="text-gray-800 text-xl md:text-2xl font-bold mb-2">Rejoignez le mouvement Switch Market</h3>
                    <p className="text-gray-700 mb-4 max-w-md">
                        Rejoignez des milliers de consommateurs conscients qui font de meilleurs choix pour eux-mêmes et pour la
                        planète.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button className="bg-purple-500 hover:bg-purple-600 text-white border-none">Rejoindre le mouvement</Button>
                        <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                            En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="hidden md:block relative h-32 w-32">
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10">
                        <Info className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute top-4 left-4 w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full"></div>
                    <div className="absolute top-0 left-0 w-32 h-32 flex items-center justify-center">
                        <div className="text-gray-800 text-center">
                            <div className="text-3xl font-bold">HC</div>
                            <div className="text-xs">CH₃</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute top-0 right-0 h-full w-1/3 bg-[url('/placeholder.svg')] opacity-10"></div>
        </div>
    )
}
