import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export default function AdditiveCard({
  shortName,
  name,
  function: functionName,
  note,
}) {
  return (
    <Card className="group bg-white hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 rounded-xl overflow-hidden">
      <CardContent className="p-6 flex flex-col h-full relative">
        <div className="absolute top-4 right-4 bg-black/5 p-2 rounded-full text-black/70 transform group-hover:translate-x-1 transition-transform">
          <ChevronRight className="h-4 w-4" />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-medium text-black mb-1 tracking-tight">
              {shortName}
            </h2>
            <p className="text-[#3D3F3D] text-base">{name}</p>
          </div>

          <div className="bg-emerald-50 rounded-lg px-3 py-2">
            <p className="text-sm font-medium text-emerald-800">
              {functionName}
            </p>
          </div>

          {note && (
            <div className="text-sm text-[#3D3F3D]/80 leading-relaxed">
              {note}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
