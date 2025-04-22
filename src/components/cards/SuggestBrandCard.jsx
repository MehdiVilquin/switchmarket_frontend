import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Building2, Users, Leaf } from "lucide-react";

export default function SuggestBrandCard() {
  return (
    <Card className="group relative h-full cursor-pointer overflow-hidden transition-all duration-300 bg-black border-2 border-gray-800 ">
      <div className="flex flex-col p-4">
        <CardContent className="flex flex-col gap-6 p-0">
          {/* Icon Container */}
          <div className="relative flex justify-center">
            <div className="relative group-hover:scale-105 transition-transform duration-300 "></div>
          </div>

          {/* Content Info */}
          <div className="flex flex-col gap-2">
            <div className="text-lg font-medium text-emerald-400">
              Contribute
            </div>
            <h2 className="text-2xl font-semibold text-white leading-tight tracking-tight line-clamp-2">
              Suggest an Ethical Brand
            </h2>
            <p className="text-base text-gray-300">
              Know an ethical brand that should be on our platform? Help us grow
              our database.
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-gray-300">
              <Leaf className="h-5 w-5 text-emerald-400" />
              <span className="text-sm">
                Share brands with sustainable practices
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Leaf className="h-5 w-5 text-emerald-400" />
              <span className="text-sm">
                Highlight companies with ethical labor policies
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Leaf className="h-5 w-5 text-emerald-400" />
              <span className="text-sm">
                Introduce local businesses with positive impact
              </span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
