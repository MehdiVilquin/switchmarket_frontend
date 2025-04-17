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
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-green-400";
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
                className="text-xs bg-gray-100 text-gray-700"
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
                  )} text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md`}
                >
                  {displayScore}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-2">
              <div className="text-sm text-gray-500">{brands}</div>
              <h2 className="font-semibold text-gray-900 line-clamp-2">
                {name}
              </h2>

              {/* Composition Bars */}
              <div className="space-y-3 mt-2">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-700 font-medium">Natural</span>
                    <span className="text-gray-600">{naturalPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${naturalPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-red-700 font-medium">Chemical</span>
                    <span className="text-gray-600">{chemicalPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-red-500 h-1.5 rounded-full transition-all duration-300"
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
