"use client";

import { Button } from "@/components/ui/button";
import { Share2, Info, Leaf, Beaker } from "lucide-react";

export default function ProductDetails({ product }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product?.product_name,
          text: `Check out this product: ${product?.product_name}`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const chemical = product.chemicalPercentage || 0;
  const natural = 100 - chemical;

  return (
    <div>
      <div className="mb-6">
        <div className="mb-4">
          <div className="flex justify-between text-xl mb-1">
            <span className="flex items-center text-emerald-600">
              <Leaf className="h-4 w-4 mr-1" /> Natural
            </span>
            <span className="flex items-center text-amber-600">
              <Beaker className="h-4 w-4 mr-1" /> Chemical
            </span>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
            <div
              className="bg-emerald-400"
              style={{ width: `${natural}%` }}
            ></div>
            <div
              className="bg-amber-400"
              style={{ width: `${chemical}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xl mt-1 text-gray-500">
            <span>{natural}%</span>
            <span>{chemical}%</span>
          </div>
        </div>
      </div>

      {product.OBFProductId && (
        <div className="mb-5 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <a
            href={`https://world.openbeautyfacts.org/product/${product.OBFProductId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-800 transition-colors inline-flex items-center"
          >
            View on OpenBeautyFacts <Info className="w-4 h-4 ml-1" />
          </a>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" /> Share
        </Button>
      </div>
    </div>
  );
}
