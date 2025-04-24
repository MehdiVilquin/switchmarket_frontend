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
  const { id } = use(paramsPromise); // id is the id of the product;
  const { product, imageUrl, isLoading, error } = useProductDetails(id); // product is the product data, imageUrl is the image url, isLoading is a boolean that is true if the product is loading, error is the error message

  if (error) return <ProductError message={error} />;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pb-16">
        <ProductHeader productName="..." />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="group relative overflow-hidden bg-white border-2 border-gray-200 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-1">
                <Skeleton className="aspect-square rounded-lg" />
              </div>
              <div className="md:col-span-2">
                <div className="flex flex-col gap-6">
                  <div>
                    <Skeleton className="h-7 w-1/2 mb-2" />
                    <Skeleton className="h-8 w-3/4" />
                  </div>

                  <div className="flex gap-3">
                    <Skeleton className="h-[52px] w-32 rounded-full" />
                    <Skeleton className="h-[52px] w-32 rounded-full" />
                    <Skeleton className="h-[52px] w-32 rounded-full" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-8 w-32 rounded-full" />
                    <Skeleton className="h-8 w-28 rounded-full" />
                  </div>

                  <Skeleton className="h-6 w-48" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-8">
            <div>
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-[52px] w-40 rounded-full" />
                <Skeleton className="h-[52px] w-48 rounded-full" />
                <Skeleton className="h-[52px] w-44 rounded-full" />
              </div>
            </div>

            <div>
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="border-2 border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <Skeleton className="h-1.5 w-full" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <ProductError message="Product not found." />;
  }

  return (
    <main className="min-h-screen bg-white pb-16">
      <ProductHeader productName={product.product_name} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-12"
        >
          <div className="border-2 border-gray-200 hover:border-black transition-colors rounded-xl bg-white overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 p-8">
              <div className="md:col-span-1">
                <ProductImage
                  imageUrl={imageUrl}
                  OBFProductId={product.OBFProductId}
                  productName={product.product_name}
                />
              </div>
              <div className="md:col-span-2 flex flex-col">
                <div className="mb-8">
                  <div className="text-lg font-medium text-gray-600 mb-2">
                    {product.brands || "Unknown Brand"}
                  </div>
                  <h1 className="text-4xl font-semibold text-gray-900 leading-tight tracking-tight">
                    {product.product_name || "Unnamed Product"}
                  </h1>
                </div>
                <div>
                  <ProductDetails product={product} imageUrl={imageUrl} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <ProductEffects
              effects={product.effects}
              ingredients={product.ingredients}
            />

            <ProductIngredients ingredients={product.ingredients} />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
