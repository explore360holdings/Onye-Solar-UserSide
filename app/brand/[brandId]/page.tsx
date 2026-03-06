// File: /app/brand/[brandId]/page.tsx
"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useBrand, useProductsByBrand } from "@/hooks/useBrands";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Loader2 } from "lucide-react";

export default function BrandDetailPage({ params }: { params: { brandId: string } }) {
  const { brandId } = params;

  // Fetch the specific brand's details
  const { data: brand, isLoading: isLoadingBrand, isError: isBrandError } = useBrand(brandId);
  
  // Fetch the products for this brand with pagination
  const { 
    data: productsData, 
    isLoading: isLoadingProducts, 
    isError: isProductsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductsByBrand(brandId);

  // Flatten the paginated product data into a single array
  const products = useMemo(() => productsData?.pages.flatMap(page => page.products) || [], [productsData]);

  // Handle loading states
  if (isLoadingBrand) {
    return (
        <div className="min-h-screen pt-20 bg-white text-center py-16">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-lg text-gray-600">Loading Brand Details...</p>
        </div>
    );
  }

  // Handle error states
  if (isBrandError || isProductsError) {
    return <div className="text-center text-red-500 p-8 pt-24">Error: Could not load brand information.</div>;
  }

  if (!brand) {
    return <div className="text-center p-8 pt-24">Brand not found.</div>;
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Brand Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center gap-8">
            <div className="relative h-24 w-48 flex-shrink-0">
                <Image
                    src={brand.logo || "/placeholder.svg"}
                    alt={`${brand.name} logo`}
                    fill
                    className="object-contain"
                />
            </div>
            <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{brand.name}</h1>
                <p className="mt-2 text-lg text-gray-600">{brand.description}</p>
            </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-6">Products from {brand.name}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingProducts && products.length === 0 ? (
                Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            ) : products.length > 0 ? (
                products.map(product => <ProductCard key={product._id} product={product} />)
            ) : (
                <p className="col-span-full text-center text-gray-500">No products found for this brand.</p>
            )}
        </div>

        {/* Load More Button */}
        <div className="mt-12 text-center">
          {hasNextPage && (
            <Button
              size="lg"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...</>) : ('Load More')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}