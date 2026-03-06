"use client"

import { useActiveBrands } from "@/hooks/useBrands"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function BrandsSection() {
  const { data: brands, isLoading } = useActiveBrands()

  // Show only first 8 brands on the landing page
  const displayBrands = brands?.slice(0, 8) || []

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Shop by Brand</h2>
            <p className="text-gray-600 mt-2">Trusted manufacturers of quality solar products</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-32 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!brands || brands.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Shop by Brand</h2>
          <p className="text-gray-600 mt-2">Trusted manufacturers of quality solar products</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {displayBrands.map((brand) => (
            <Link
              key={brand._id}
              href={`/products?brand=${brand._id}`}
              className="group bg-gray-50 hover:bg-gray-100 rounded-xl p-6 transition-all duration-300 border border-gray-200 hover:border-primary hover:shadow-lg flex flex-col items-center justify-center"
            >
              {brand.logo ? (
                <div className="relative w-full h-20 mb-3">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-20 mb-3 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-400 group-hover:text-primary transition-colors">
                    {brand.name.charAt(0)}
                  </span>
                </div>
              )}
              <h3 className="font-semibold text-gray-900 text-center group-hover:text-primary transition-colors">
                {brand.name}
              </h3>
              {brand.productCount !== undefined && (
                <p className="text-sm text-gray-500 mt-1">
                  {brand.productCount} {brand.productCount === 1 ? 'product' : 'products'}
                </p>
              )}
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/brands">
            <Button size="lg" variant="outline" className="group">
              View All Brands
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
