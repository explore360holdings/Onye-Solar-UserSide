"use client";

import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/components/types/product';
import { ProductCard, ProductCardSkeleton } from './ProductCard';

// This function shuffles an array randomly.
// It's a standard algorithm called the Fisher-Yates shuffle.
const shuffleArray = (array: Product[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export function FeaturedProducts() {
  const [featured, setFeatured] = useState<Product[]>([]);
  
  const { data: productsData, isLoading, isError } = useProducts({ limit: 20 });

  const products = productsData?.pages.flatMap(page => page) || [];

  useEffect(() => {
    if (products.length > 0 && featured.length === 0) {
      const shuffled = shuffleArray(products);
      const selected = shuffled.slice(0, 4);
      setFeatured(selected);
    }
  }, [products, featured.length]); 

  if (isLoading || featured.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return null; 
  }

  console.log( "Featured:",featured)

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard 
            key={product._id}
             product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}