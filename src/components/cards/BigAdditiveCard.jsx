import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

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
  id,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card
      id={`additive-${id}`}
      className="group relative h-full cursor-pointer overflow-hidden transition-all duration-300 bg-white border-2 border-gray-200 hover:border-black"
    >
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-4xl font-medium text-black tracking-tight">
            {shortName}
          </h3>
          <p className="text-xl text-[#3D3F3D]/70">{name}</p>
        </div>

        {/* Main Content */}
        <div className="flex-grow space-y-6">
          {/* Allergy Badge */}
          <div>
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

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="Origin" value={origin} />
            <InfoItem label="Family" value={family} />
            <InfoItem label="Function" value={functionName} />
            <InfoItem
              label="Daily Intake (ADI)"
              value={adi ? `${adi} mg/kg/day` : null}
            />
            {note && <InfoItem label="Notes" value={note} fullWidth />}
          </div>
        </div>

        {/* Risk Level Dropdown */}
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="mt-6 pt-4 border-t border-gray-100"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full text-sm text-gray-500 hover:text-gray-700">
            <span>Description</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="text-sm text-gray-700 bg-gray-50 p-3">{risk}</div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

function InfoItem({ label, value, fullWidth = false }) {
  if (!value) return null;

  return (
    <div className={`${fullWidth ? "col-span-2" : ""} bg-gray-50  p-3`}>
      <label className="block text-sm font-medium text-gray-500 mb-1">
        {label}
      </label>
      <div className="text-gray-800 text-sm leading-relaxed break-words">
        {value}
      </div>
    </div>
  );
}
