// File: /hooks/useBrands.ts

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { 
    getBrands as fetchBrands,
    getBrandById,
    getActiveBrands,
        getProductsByBrand,  
} from "@/components/services/api";
import { Brand } from "@/components/types/brands";
import { Product } from '@/components/types/product'


export const useBrandsPaginated = (page = 1, limit = 10) => {
  return useQuery<{ brands: Brand[], pagination: any }, Error>({
    queryKey: ["brands", { page, limit }], // Query key includes page and limit for caching
    queryFn: () => fetchBrands(page, limit),
  });
};


export const useBrand = (brandId: string) => {
  return useQuery<Brand, Error>({
    queryKey: ["brand", brandId],
    queryFn: () => getBrandById(brandId),
    enabled: !!brandId, // The query will not run until a brandId is available
  });
};

/**
 * Hook to fetch a simple list of all active brands.
 * Perfect for populating filter sidebars or dropdowns.
 */
export const useActiveBrands = () => {
  return useQuery<Brand[], Error>({
    queryKey: ["activeBrands"],
    queryFn: getActiveBrands,
    // It's good practice to set a longer staleTime for data that doesn't change often
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useProductsByBrand = (brandId: string, limit = 12) => {
  return useInfiniteQuery<{ products: Product[], pagination: any }, Error>({
    // The queryKey includes the brandId to make it unique
    queryKey: ["productsByBrand", brandId],
    
    // The queryFn passes the pageParam to our API function
    queryFn: ({ pageParam = 1 }) => getProductsByBrand(brandId, pageParam as number, limit),
    
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Use the pagination data from your backend to determine if there's a next page
      const { currentPage, totalPages } = lastPage.pagination;
      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined; // No more pages
    },
    enabled: !!brandId, // Only run if a brandId is provided
  });
};


// // File: /hooks/useBrands.ts

// import { useQuery } from "@tanstack/react-query";
// import { getActiveBrands } from "@/components/services/api";
// import { Brand } from "@/components/types/brands";

// // This hook fetches the list of active brands for use in filter sidebars, etc.
// export const useBrands = () => {
//   // --- FIX: Correct the syntax for useQuery v5 ---
//   return useQuery({
//     // The queryKey is an array that uniquely identifies this query
//     queryKey: ["activeBrands"], 
    
//     // The queryFn is the async function that will fetch the data
//     queryFn: getActiveBrands,
    
//     // Optional: Cache the data for 1 hour since brands don't change often
//     staleTime: 1000 * 60 * 60, 
//   });
// };

// // // File: /hooks/useBrands.ts

// // import { useQuery } from "@tanstack/react-query";
// // import { getActiveBrands } from "@/components/services/api";
// // import { Brand } from "@/components/types/brand";

// // // This hook fetches the list of active brands for use in filter sidebars, etc.
// // export const useBrands = () => {
// //   return useQuery<Brand[], Error>({
// //     queryKey: ["activeBrands"], // A unique key for caching this data
// //     queryFn: getActiveBrands,
// //     staleTime: 1000 * 60 * 60, // Cache for 1 hour, as brands don't change often
// //   });
// // };