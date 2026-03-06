// File: /components/types/product.ts

// This type represents a Product object received from your API
export interface Product {
  _id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
  features?: string[];
  slug?: string;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  wattage?: number;
  inStock?: boolean;
  specifications?: Record<string, string>;
  dimensions?: { length: string; width: string; height: string; };
  weight?: string;
}

export interface CreateProductData {
  name: string;
  brand: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: FileList;
  features?: string[];
}

export interface UpdateProductData extends Partial<Omit<CreateProductData, 'images'>> {
  images?: FileList;
}

export interface BulkDeleteProductsData {
  ids: string[];
}

// // File: /components/types/product.ts

// // This type represents a Product object received from your API
// export interface Product {
//   _id: string;
//   name: string;
//   brand: string; // <-- ADDED THIS REQUIRED FIELD
//   description: string;
//   price: number;
//   category: string;
//   stock: number;
//   images: string[];
//   createdAt: string;
//   updatedAt: string;
// }

// // --- FIX: This type is for the data needed to CREATE a new product ---
// export interface CreateProductData {
//   name: string;
//   brand: string; // <-- ADDED THIS REQUIRED FIELD
//   description: string;
//   price: number;
//   category: string;
//   stock: number;
//   images: FileList;
// }

// // This type is for the data needed to UPDATE a product
// export interface UpdateProductData extends Partial<Omit<CreateProductData, 'images'>> {
//   images?: FileList;
// }

// // This type is for bulk deleting products
// export interface BulkDeleteProductsData {
//   ids: string[];
// }

// // // File: /components/types/product.ts

// // // This is the new, authoritative Product type that matches your component
// // export interface Product {
// //   _id: string; // The database ID
// //   slug: string; // A URL-friendly version of the name
// //   name: string;
// //   description: string;
// //   price: number;
// //   originalPrice?: number; // Optional original price for showing discounts
// //   discount?: number; // Optional discount percentage
// //   category: string;
// //   stock: number;
// //   images: string[];
// //   featured?: boolean;
// //   rating: number; // Average rating
// //   reviews: number; // Number of reviews
// //   wattage?: number; // Optional power output
// //   inStock: boolean; // Derived from stock
// //   features?: string[];
// //   specifications?: Record<string, string>; // e.g., { "Voltage": "48V", "Cell Type": "Monocrystalline" }
// //   dimensions?: {
// //     length: string;
// //     width: string;
// //     height: string;
// //   };
// //   weight?: string;
// //   createdAt: string;
// //   updatedAt: string;
// // }

// // // These types remain the same but are here for completeness
// // export interface CreateProductData extends Omit<Product, '_id' | 'slug' | 'images' | 'inStock' | 'createdAt' | 'updatedAt'> {
// //   images: FileList;
// // }

// // export interface UpdateProductData extends Partial<Omit<CreateProductData, 'images'>> {
// //   images?: FileList;
// // }

// // export interface BulkDeleteProductsData {
// //   ids: string[];
// // }

// // // export interface Product {
// // //     _id: string;
// // //     slug: string;
// // //     name: string;
// // //     description: string;
// // //     price: number;
// // //     originalPrice?: number;
// // //     discount?: number;
// // //     category: string;
// // //     stock: number;
// // //     images: string[];
// // //     rating: number;
// // //     reviews: number;
// // //     wattage?: number;
// // //     inStock: boolean;
// // //     createdAt: string;
// // //     updatedAt: string;
// // //     status?: "active" | "inactive";
// // //     featured?: boolean;

// // // }

// // // export interface CreateProductData extends Omit<Product, '_id' | 'images' | 'createdAt' | 'updatedAt'> {
// // //     images: FileList;
// // // }

// // // export interface UpdateProductData extends Partial<Omit<CreateProductData, 'images'>> {
// // //     images?: FileList;
// // // }

// // // export interface BulkDeleteProductsData {
// // //     ids: string[];
// // // }