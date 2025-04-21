import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { Leaf, Beaker, Pen } from "lucide-react";

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
    <Card className="group relative h-full cursor-pointer overflow-hidden transition-all duration-300 bg-white border-2 border-gray-200 hover:border-black">
      <div className="flex flex-col p-4">
        {/* Main Content */}
        <CardContent className="flex flex-col gap-6 p-0">
          {/* Image Container */}
          <div className="relative flex justify-center">
            <div className="relative h-48 w-48 group-hover:scale-105 transition-transform duration-300">
              <Image
                src={image}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
                priority={false}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-2">
            <div className="text-lg font-medium text-gray-600">{brands}</div>
            <h2 className="text-2xl font-semibold text-gray-900 leading-tight tracking-tight line-clamp-2">
              {name}
            </h2>
          </div>

          {/* Score Circles */}
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex h-[52px] items-center justify-center rounded-full border-2 border-gray-200 bg-white px-4">
                    <div className="flex items-center gap-2">
                      <Pen className="h-5 w-5" />
                      <span className="text-lg">{displayScore}%</span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Completion score</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <div className="flex h-[52px] items-center justify-center rounded-full border-2 border-gray-200 bg-white px-4">
                    <div className="flex items-center gap-2">
                      <Beaker className="h-5 w-5" />
                      <span className="text-lg">{chemicalPercentage}%</span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chemical ingredients</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <div className="flex h-[52px] items-center justify-center rounded-full border-2 border-gray-200 bg-white px-4">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-5 w-5" />
                      <span className="text-lg">{natural}%</span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Natural ingredients</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Tags Section */}
          {labeltags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {labeltags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-sm bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Ingredients Info */}
          {/* <div className="flex gap-2">
            <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
              <span className="text-base font-medium text-gray-900">20</span>
              <span className="text-sm text-gray-600">ingredients</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
              <span className="text-base font-medium text-gray-900">2</span>
              <span className="text-sm text-gray-600">additives</span>
            </div>
          </div> */}
        </CardContent>
      </div>
    </Card>
  );
}
