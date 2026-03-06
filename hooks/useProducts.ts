// File: /hooks/useProducts.ts

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
    getProductBySlug,
} from "@/components/services/api";
import { Product, CreateProductData, UpdateProductData, BulkDeleteProductsData } from "@/components/types/product";
import { useAuthStore } from "@/components/store/authStore";

// export const useProducts = ({ limit = 12 }: { limit?: number } = {}) => {
//   return useInfiniteQuery<Product[], Error>({
//     queryKey: ['products', limit],
    
//     queryFn: ({ pageParam }) => getAllProducts({ pageParam: pageParam as number, limit }),
    
//     initialPageParam: 1, 
    
//     getNextPageParam: (lastPage, allPages) => {
//       if (lastPage.length < limit) {
//         return undefined;
//       }
//       return allPages.length + 1;
//     },
//   });
// };

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation<Product, Error, CreateProductData>({
    mutationFn: (newProduct) => createProduct(token!, newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation<Product, Error, { id: string; data: UpdateProductData }>({
    mutationFn: (variables) => updateProduct(token!, variables.id, variables.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (productId) => deleteProduct(token!, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useBulkDeleteProducts = () => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();

    return useMutation<{ message: string, count: number }, Error, BulkDeleteProductsData>({
        mutationFn: (data) => bulkDeleteProducts(token!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });
};


export const useProduct = (slug: string) => {
  return useQuery<Product, Error>({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  });
};

interface ProductFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    inStock?: boolean;
    sort?: string;
    limit?: number;
}

export const useProducts = (filters: ProductFilters) => {
  const { limit = 12, ...restFilters } = filters;
  
  // Clean up filters before sending to API
  const cleanFilters = Object.entries(restFilters).reduce((acc, [key, value]) => {
    // Skip "all" values and empty strings
    if (value && value !== "all" && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
  
  return useInfiniteQuery<Product[], Error>({
    queryKey: ['products', cleanFilters],
    
    queryFn: ({ pageParam }) => getAllProducts({ pageParam, limit, ...cleanFilters }),
    
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) {
        return undefined;
      }
      return allPages.length + 1;
    },
  });
};