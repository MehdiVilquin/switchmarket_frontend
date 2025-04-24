"use client";

import Barcode from "react-barcode";

export default function ProductImage({ imageUrl, OBFProductId, productName }) {
  return (
    <div className="w-full">
      <div className="bg-white border-2 border-gray-200 rounded-lg p-8 flex items-center justify-center aspect-square">
        <img
          src={imageUrl || "/placeholder.png"}
          alt={productName || "Product image"}
          className="object-contain w-full h-full"
        />
      </div>

      {OBFProductId && (
        <div className="mt-6 flex flex-col items-center">
          <p className="text-sm text-gray-500 mb-2">Product code</p>
          <Barcode
            value={OBFProductId}
            format="EAN13"
            height={40}
            width={1.5}
            fontSize={12}
            margin={0}
            background="#ffffff"
            lineColor="#333333"
          />
        </div>
      )}
    </div>
  );
}
