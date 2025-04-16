"use client"

import Barcode from "react-barcode"

export default function ProductImage({ imageUrl, OBFProductId, productName }) {
    return (
        <div className="w-full md:w-1/3 flex flex-col">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 p-4 flex items-center justify-center h-80">
                <img
                    src={imageUrl || "/placeholder.svg"}
                    alt={productName || "Product image"}
                    className="object-contain max-h-full max-w-full"
                />
            </div>

            {OBFProductId && (
                <div className="mt-4 flex flex-col items-center">
                    <p className="text-xs text-gray-500 mb-1">Code produit</p>
                    <Barcode
                        value={OBFProductId}
                        format="EAN13"
                        height={40}
                        width={1.5}
                        fontSize={10}
                        margin={0}
                        background="#ffffff"
                        lineColor="#333333"
                    />
                </div>
            )}
        </div>
    )
}