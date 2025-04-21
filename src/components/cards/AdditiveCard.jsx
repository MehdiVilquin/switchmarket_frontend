import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function AdditiveCard({
  shortName,
  name,
  function: functionName,
  note,
  allergy = false,
}) {
  return (
    <Card className="group relative h-full cursor-pointer overflow-hidden transition-all duration-300 bg-white border-2 border-gray-200 hover:border-black ">
      <CardContent className="p-8 flex flex-col h-full">
        {allergy && (
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-2.5 py-1 rounded-md text-sm font-medium">
              <AlertCircle className="h-4 w-4" />
              Allergène
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-4xl font-medium text-black tracking-tight">
              {shortName}
            </h3>
            <p className="text-xl text-[#3D3F3D]/70">{name}</p>
          </div>

          <p className="text-lg text-[#3D3F3D] line-clamp-1">{functionName}</p>

          {note && (
            <div className="text-base text-[#3D3F3D]/60 line-clamp-1">
              {note}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
