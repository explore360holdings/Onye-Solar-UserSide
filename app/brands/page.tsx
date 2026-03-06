"use client"

import { useActiveBrands } from "@/hooks/useBrands"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function BrandsPage() {
  const { data: brands, isLoading, error } = useActiveBrands()

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error loading brands</h1>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Brands</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore products from the world's leading solar equipment manufacturers
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : brands && brands.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                href={`/products?brand=${brand._id}`}
                className="group bg-white hover:bg-gray-50 rounded-xl p-8 transition-all duration-300 border border-gray-200 hover:border-primary hover:shadow-xl flex flex-col items-center justify-center"
              >
                {brand.logo ? (
                  <div className="relative w-full h-24 mb-4">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full h-24 mb-4 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-300 group-hover:text-primary transition-colors">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                )}
                
                <h3 className="font-bold text-lg text-gray-900 text-center group-hover:text-primary transition-colors mb-2">
                  {brand.name}
                </h3>
                
                {brand.description && (
                  <p className="text-sm text-gray-600 text-center line-clamp-2 mb-3">
                    {brand.description}
                  </p>
                )}
                
                {brand.productCount !== undefined && (
                  <p className="text-sm font-medium text-primary">
                    {brand.productCount} {brand.productCount === 1 ? 'Product' : 'Products'}
                  </p>
                )}
                
                {brand.country && (
                  <p className="text-xs text-gray-500 mt-2">
                    {brand.country}
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Brands Available</h2>
            <p className="text-gray-600">Check back later for brand listings.</p>
          </div>
        )}
      </div>
    </div>
  )
}
