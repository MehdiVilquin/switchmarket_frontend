"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function ProductEffects({ effects }) {
  if (!effects || effects.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Effects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {effects.map((effect, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-800">
                {effect.name || "Effect"}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {effect.description || "No description available"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
