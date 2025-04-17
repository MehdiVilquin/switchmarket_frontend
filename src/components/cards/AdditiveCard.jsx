import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export default function AdditiveCard({
  shortName,
  name,
  function: functionName,
  note,
}) {
  return (
    <Card className="bg-white hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start">
          <div className="space-y-3 flex-1">
            <div className="flex items-start justify-between group">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {shortName}
                </h2>
                <p className="text-lg text-gray-600">{name}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-full text-gray-500 transform group-hover:translate-x-1 transition-transform">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700">
                {functionName}
              </p>
            </div>

            {note && (
              <div className="text-sm text-gray-600 italic leading-relaxed">
                {note}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
