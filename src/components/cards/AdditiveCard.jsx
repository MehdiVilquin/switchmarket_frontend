import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export default function AdditiveCard({
  shortName,
  name,
  function: functionName,
  note,
}) {
  return (
    <Card className="bg-white hover:shadow-lg transition-all duration-300 h-full border border-gray-100 overflow-hidden group">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-800 group-hover:text-emerald-600 transition-colors">
                {shortName}
              </h3>
              <div className="bg-emerald-50 p-1 rounded-full text-emerald-500 transform group-hover:translate-x-1 transition-transform">
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
            <p className="text-sm text-gray-700">{name}</p>
            <p className="text-xs text-emerald-600 font-medium">
              {functionName}
            </p>
            <p className="text-xs text-gray-500 italic">{note}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
