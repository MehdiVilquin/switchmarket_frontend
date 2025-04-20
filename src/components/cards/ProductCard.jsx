import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Leaf, Beaker } from "lucide-react";


export default function ProductCard({
  name,
  brands,
  score,
  chemicalPercentage = 0,
  labeltags = [],
  image = "/placeholder.png",
}) {
  const getScoreColor = (score) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-emerald-400";
    if (score >= 40) return "bg-yellow-400";
    if (score >= 20) return "bg-orange-400";
    return "bg-red-500";
  };

  const formattedScore =
    typeof score === "string" ? Number.parseInt(score, 10) : score;
  const displayScore = isNaN(formattedScore) ? 0 : formattedScore;

  const natural = 100 - chemicalPercentage;

  return (
    <Card className="group h-full cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 bg-white rounded-lg border border-gray-100">
      <div className="relative flex flex-col pt-4">
        {/* Tags Section */}
        {labeltags.length > 0 && (
          <div className="flex items-start gap-2 px-4 pb-2">
            {labeltags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-sm bg-gray-100 text-[#3D3F3D] px-3 py-1 rounded-full"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Main Content */}
        <CardContent className="p-4 pt-0">
          <div className="flex flex-col gap-4">
            {/* Image Container */}
            <div className="relative w-full h-40">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-32 h-32 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain"
                    priority={false}
                  />
                </div>
                <div
                  className={`absolute top-0 right-0 ${getScoreColor(
                    displayScore
                  )} text-white text-sm font-medium px-3 py-1 rounded-full`}
                >
                  {displayScore}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-3">
              <div className="text-base text-[#3D3F3D]">{brands}</div>
              <h2 className="text-2xl font-medium text-black leading-tight tracking-tight line-clamp-2">
                {name}
              </h2>

              {/* Unified Composition Bar */}
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <Leaf className="w-4 h-4" /> Natural
                  </span>
                  <span className="flex items-center gap-1 text-amber-600">
                    <Beaker className="w-4 h-4" /> Chemical
                  </span>
                </div>

                <div className="flex h-2.5 rounded-full overflow-hidden bg-gray-100">
                  <div
                    className="bg-emerald-400"
                    style={{ width: `${natural}%` }}
                  />
                  <div
                    className="bg-amber-400"
                    style={{ width: `${chemicalPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{natural}%</span>
                  <span>{chemicalPercentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
