import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function ProductCard({
  name,
  brands,
  score,
  naturalPercentage,
  chemicalPercentage,
  labeltags = [],
  image = "/placeholder.png",
}) {
  // Calculate health score color
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

              {/* Composition Bars */}
              <div className="space-y-4 mt-2">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-[#3D3F3D]">
                      Natural
                    </span>
                    <span className="text-base text-[#3D3F3D]">
                      {naturalPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${naturalPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-[#3D3F3D]">
                      Chemical
                    </span>
                    <span className="text-base text-[#3D3F3D]">
                      {chemicalPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${chemicalPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
