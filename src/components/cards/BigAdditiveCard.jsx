import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info } from "lucide-react";

export default function BigAdditiveCard({
  shortName,
  name,
  origin,
  risk,
  function: functionName,
  family,
  adi,
  possibleAllergy,
  note,
}) {
  return (
    <Card className="bg-white hover:shadow-xl transition-all duration-300 border border-gray-100">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{shortName}</h2>
            <p className="text-lg text-gray-600 mt-2">{name}</p>
          </div>
        </div>

        {/* Main Info Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <InfoItem label="Origin" value={origin} />
            {note && <InfoItem label="Notes" value={note} />}
            <InfoItem
              label="Daily Intake (ADI)"
              value={adi ? `${adi} mg/kg/day` : null}
            />
            <InfoItem label="Function" value={functionName} />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="mb-2">
              <Badge
                variant="outline"
                className={`${
                  possibleAllergy === "Yes"
                    ? "border-red-200 text-red-700 bg-red-50"
                    : "border-emerald-200 text-emerald-700 bg-emerald-50"
                } px-3 py-1`}
              >
                {possibleAllergy === "Yes" ? (
                  <AlertTriangle className="w-4 h-4 mr-1" />
                ) : (
                  <Info className="w-4 h-4 mr-1" />
                )}
                Allergy: {possibleAllergy}
              </Badge>
            </div>
            <InfoItem label="Family" value={family} />
            <InfoItem label="Risk Level" value={risk} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoItem({ label, value, fullWidth = false }) {
  if (!value) return null;

  return (
    <div className={`${fullWidth ? "col-span-2" : ""}`}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-gray-800 mt-1">{value}</p>
    </div>
  );
}
