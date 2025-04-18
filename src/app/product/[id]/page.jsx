"use client";

import { use } from "react";
import { motion } from "framer-motion";
import useProductDetails from "@/lib/hooks/useProductDetails";

import ProductHeader from "@/components/sections/Product/ProductHeader";
import ProductImage from "@/components/sections/Product/ProductImage";
import ProductDetails from "@/components/sections/Product/ProductDetails";
import ProductIngredients from "@/components/sections/Product/ProductIngredients";
import ProductEffects from "@/components/sections/Product/ProductEffects";
import ProductError from "@/components/sections/Product/ProductError";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductPage({ params: paramsPromise }) {
  // params: paramsPromise is a prop that is passed to the ProductPage component
  const { id } = use(paramsPromise); // id is the id of the product
  const { product, imageUrl, isLoading, error } = useProductDetails(id); // product is the product data, imageUrl is the image url, isLoading is a boolean that is true if the product is loading, error is the error message

  if (error) return <ProductError message={error} />;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16">
        <ProductHeader productName="..." />
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="h-80 w-full md:w-1/3 rounded-xl" />
            <div className="w-full md:w-2/3 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
              <Skeleton className="h-32 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          </div>
          <Skeleton className="h-8 w-40" />
          <div className="space-y-3">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 flex-1 mx-2" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <ProductError message="Product not found." />;
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <ProductHeader productName={product.product_name} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-8">
            <ProductImage
              imageUrl={imageUrl}
              OBFProductId={product.OBFProductId}
              productName={product.product_name}
            />
            <ProductDetails product={product} imageUrl={imageUrl} />
          </div>
          <ProductEffects effects={product.effects} />
          <ProductIngredients ingredients={product.ingredients} />
        </motion.div>
      </div>
    </main>
  );
}
