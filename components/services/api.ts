// File: /components/services/api.ts

import {
  LoginData, LoginResponse, RegisterData, RegisterResponse, VerifyEmailData,
  VerifyEmailResponse, ForgotPasswordData, ForgotPasswordResponse, ResetPasswordData,
  ResetPasswordResponse, UpdateProfileData, User, UserAddress, Order, PaymentMethod,
} from '@/components/types/auth';
import {
  Product, CreateProductData, UpdateProductData, BulkDeleteProductsData,
} from '@/components/types/product';
import { CreateOrderPayload, CheckoutPayload } from '@/hooks/useCheckout';
import { useAuthStore } from '@/components/store/authStore';
import {Brand} from '@/components/types/brands'
// import { Product } from '@/components/types/product'

const BASE_URL = 'https://solarbackend-3sf6.onrender.com/api';

const apiFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An API error occurred');
  }
  return response;
};

export const loginUser = async (credentials: LoginData): Promise<LoginResponse> => {
  const response = await apiFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const responseData = await response.json();
  return {
    token: responseData.token,
    user: {
      _id: responseData._id,
      name: responseData.name,
      email: responseData.email,
      role: responseData.role,
    }
  };
};

export const registerUser = async (credentials: RegisterData): Promise<RegisterResponse> => {
    const response = await apiFetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    const responseData = await response.json();
    return {
        message: responseData.message,
        user: {
            _id: responseData._id,
            name: responseData.name,
            email: responseData.email,
        }
    };
};

export const verifyEmail = async (data: VerifyEmailData): Promise<VerifyEmailResponse> => {
  const response = await apiFetch('/auth/verify-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const resendVerificationEmail = async (email: string): Promise<{ message: string }> => {
  const response = await apiFetch('/auth/resend-verification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return response.json();
};

export const forgotPassword = async (data: ForgotPasswordData): Promise<ForgotPasswordResponse> => {
  const response = await apiFetch('/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const resetPassword = async (data: ResetPasswordData): Promise<ResetPasswordResponse> => {
  const response = await apiFetch('/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getProfile = async (token: string): Promise<User> => {
  const response = await apiFetch('/auth/profile', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

export const updateProfile = async (token: string, updateData: UpdateProfileData): Promise<User> => {
  const response = await apiFetch('/auth/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(updateData),
  });
  return response.json();
};

export const changePassword = async (token: string, data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
  const response = await apiFetch('/auth/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getMyOrders = async (token: string): Promise<Order[]> => {
    const response = await apiFetch('/orders/myorders', {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
};

export const getOrderById = async (token: string, orderId: string): Promise<any> => {
    const response = await apiFetch(`/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
};

export const getUserAddresses = async (token: string): Promise<UserAddress[]> => {
  const response = await apiFetch('/users/addresses', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

export const addAddress = async (token: string, addressData: Omit<UserAddress, '_id' | 'isDefault'>): Promise<UserAddress> => {
  const response = await apiFetch('/users/addresses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(addressData),
  });
  return response.json();
};

export const updateAddress = async (token: string, address: UserAddress): Promise<UserAddress> => {
  const response = await apiFetch(`/users/addresses/${address._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(address),
  });
  return response.json();
};

export const deleteAddress = async (token: string, id: string): Promise<{ message: string }> => {
  await apiFetch(`/users/addresses/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return { message: 'Address deleted successfully.' };
};

export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error("You must be logged in to create an order.");
    
    const response = await apiFetch('/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
    });
    return response.json();
};


// --- Payment Functions ---

export const getPaymentMethods = async (token: string): Promise<PaymentMethod[]> => {
  console.warn("getPaymentMethods is not implemented on the backend yet.");
  return [];
};

export const addPaymentMethod = async (token: string, data: Omit<PaymentMethod, 'id' | 'isDefault'>): Promise<PaymentMethod> => {
  throw new Error("addPaymentMethod is not implemented yet.");
};

export const updatePaymentMethod = async (token: string, data: PaymentMethod): Promise<PaymentMethod> => {
  throw new Error("updatePaymentMethod is not implemented yet.");
};

export const deletePaymentMethod = async (token: string, id: string): Promise<{ message: string }> => {
  throw new Error("deletePaymentMethod is not implemented yet.");
};

export const createPaystackCheckoutSession = async (orderId: string): Promise<{ authorization_url: string }> => {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error("Authentication token is missing.");

    // --- FIX: Send the callback_url in the body to your backend ---
    const payload = {
        orderId,
        callback_url: process.env.NEXT_PUBLIC_PAYSTACK_CALLBACK_URL 
    };

    const response = await apiFetch('/paystack/init', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
    });
    
    return response.json();
}

// export const createPaystackCheckoutSession = async (orderId: string): Promise<{ authorization_url: string }> => {
//     const token = useAuthStore.getState().token;
//     if (!token) throw new Error("Authentication token is missing.");

//     const response = await apiFetch('/paystack/init', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ orderId }),
//     });
    
//     return response.json();
// }

export const getProductBySlug = async (slug: string): Promise<Product> => {
  const response = await apiFetch(`/products/${slug}`);
  return response.json();
};

export const getAllProducts = async (options: { 
  pageParam?: number | unknown, 
  limit?: number,
  category?: string,
  minPrice?: number,
  maxPrice?: number,
  brand?: string,
  inStock?: boolean,
  sort?: string
}): Promise<Product[]> => {
  const { pageParam = 1, limit = 12, ...filters } = options;
  const url = new URL(`${BASE_URL}/products`);
  url.searchParams.set('page', String(pageParam as number));
  url.searchParams.set('limit', String(limit));
  
  Object.entries(filters).forEach(([key, value]) => {
      // Handle different value types properly
      if (value !== undefined && value !== null && value !== '' && value !== 'all') {
          // For boolean values, only add if true
          if (typeof value === 'boolean') {
              if (value) {
                  url.searchParams.set(key, 'true');
              }
          } else {
              url.searchParams.set(key, String(value));
          }
      }
  });

  console.log('🔍 Fetching products with filters:', url.toString());

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error:', errorData);
      throw new Error(errorData.message || 'Failed to fetch products');
    }
    
    const data = await response.json();
    console.log('📦 Raw API response:', data);
    
    // Backend returns { products: [...], totalPages, currentPage, total }
    // We need to return just the products array
    const products = data.products || data;
    console.log('✅ Products received:', products.length, 'items', products);
    return products;
  } catch (error) {
    console.error('💥 Fetch error:', error);
    throw error;
  }
};

export const createProduct = async (token: string, data: CreateProductData): Promise<Product> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
      if (key === 'images') {
          Array.from(value as FileList).forEach(file => {
              formData.append('images', file);
          });
      } else {
          formData.append(key, String(value));
      }
  });
  
  const response = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
  });

  if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create product');
  }
  return response.json();
};

export const updateProduct = async (token: string, id: string, data: UpdateProductData): Promise<Product> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'images' && value) {
            Array.from(value as FileList).forEach(file => {
                formData.append('images', file);
            });
        } else if (value !== undefined) {
            formData.append(key, String(value));
        }
    });

    const response = await fetch(`${BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
    }
    return response.json();
};

export const deleteProduct = async (token: string, id: string): Promise<{ message: string }> => {
    await apiFetch(`/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return { message: "Product deleted successfully." };
};

export const bulkDeleteProducts = async (token: string, data: BulkDeleteProductsData): Promise<{ message: string, count: number }> => {
    const response = await apiFetch('/products/bulk-delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const getBrands = async (page = 1, limit = 10): Promise<{ brands: Brand[], pagination: any }> => {
    const response = await apiFetch(`/brands?page=${page}&limit=${limit}`);
    return response.json();
};

// export const getAllBrands = async (): Promise<Brand[]> => {
//     // This calls your backend endpoint for brands
//     const response = await apiFetch('/brands');
//     return response.json();
// };

export const getBrandById = async (id: string): Promise<Brand> => {
    const response = await apiFetch(`/brands/${id}`);
    return response.json();
};

export const getActiveBrands = async (): Promise<Brand[]> => {
    const response = await apiFetch('/brands/active');
    return response.json();
};

export const getProductsByBrand = async (brandId: string, page = 1, limit = 12): Promise<{ products: Product[], pagination: any }> => {
    const response = await apiFetch(`/brands/${brandId}/products?page=${page}&limit=${limit}`);
    return response.json();
};

export const sendContactMessage = async (data: {
    fullName: string;
    email: string;
    subject: string;
    message: string;
}): Promise<{ message: string }> => {
    const response = await apiFetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.json();
};

// import {
//   LoginData,
//   LoginResponse,
//   RegisterData,
//   RegisterResponse,
//   VerifyEmailData,
//   VerifyEmailResponse,
//   ForgotPasswordData,
//   ForgotPasswordResponse,
//   ResetPasswordData,
//   ResetPasswordResponse,
//   UpdateProfileData,
//   User,
//   UserAddress,
//   Order,
//   PaymentMethod,
// } from '@/components/types/auth';

// import {
//   Product,
//   CreateProductData,
//   UpdateProductData,
//   BulkDeleteProductsData,
// } from '@/components/types/product';

// import { CartItem, CheckoutPayload } from '@/hooks/useCheckout';
// import { useAuthStore } from '@/components/store/authStore';

// const BASE_URL = 'https://solarbackend-3sf6.onrender.com/api';

// const apiFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
//   const response = await fetch(`${BASE_URL}${endpoint}`, options);
//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || 'An API error occurred');
//   }
//   return response;
// };

// export const loginUser = async (credentials: LoginData): Promise<LoginResponse> => {
//   const response = await apiFetch('/auth/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(credentials),
//   });
//   const responseData = await response.json();
//   return {
//     token: responseData.token,
//     user: {
//       _id: responseData._id,
//       name: responseData.name,
//       email: responseData.email,
//       role: responseData.role,
//     }
//   };
// };

// export const registerUser = async (credentials: RegisterData): Promise<RegisterResponse> => {
//     const response = await apiFetch('/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(credentials),
//     });
//     const responseData = await response.json();
//     return {
//         message: responseData.message,
//         user: {
//             _id: responseData._id,
//             name: responseData.name,
//             email: responseData.email,
//         }
//     };
// };

// export const verifyEmail = async (data: VerifyEmailData): Promise<VerifyEmailResponse> => {
//   const response = await apiFetch('/auth/verify-email', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   return response.json();
// };

// export const forgotPassword = async (data: ForgotPasswordData): Promise<ForgotPasswordResponse> => {
//   const response = await apiFetch('/auth/forgot-password', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   return response.json();
// };

// export const resetPassword = async (data: ResetPasswordData): Promise<ResetPasswordResponse> => {
//   const response = await apiFetch('/auth/reset-password', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   return response.json();
// };

// export const getProfile = async (token: string): Promise<User> => {
//   const response = await apiFetch('/auth/profile', {
//     headers: { 'Authorization': `Bearer ${token}` },
//   });
//   return response.json();
// };

// export const updateProfile = async (token: string, updateData: UpdateProfileData): Promise<User> => {
//   const response = await apiFetch('/auth/profile', {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//     body: JSON.stringify(updateData),
//   });
//   return response.json();
// };

// export const changePassword = async (token: string, data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
//   const response = await apiFetch('/auth/change-password', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//     body: JSON.stringify(data),
//   });
//   return response.json();
// };

// export const getMyOrders = async (token: string): Promise<Order[]> => {
//     const response = await apiFetch('/orders/myorders', {
//         headers: { 'Authorization': `Bearer ${token}` },
//     });
//     return response.json();
// };

// export const getUserAddresses = async (token: string): Promise<UserAddress[]> => {
//   const response = await apiFetch('/users/addresses', {
//     headers: { 'Authorization': `Bearer ${token}` },
//   });
//   return response.json();
// };

// export const addAddress = async (token: string, addressData: Omit<UserAddress, '_id' | 'isDefault'>): Promise<UserAddress> => {
//   const response = await apiFetch('/users/addresses', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//     body: JSON.stringify(addressData),
//   });
//   return response.json();
// };

// export const updateAddress = async (token: string, address: UserAddress): Promise<UserAddress> => {
//   const response = await apiFetch(`/users/addresses/${address._id}`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//     body: JSON.stringify(address),
//   });
//   return response.json();
// };

// export const deleteAddress = async (token: string, id: string): Promise<{ message: string }> => {
//   await apiFetch(`/users/addresses/${id}`, {
//     method: 'DELETE',
//     headers: { 'Authorization': `Bearer ${token}` },
//   });
//   return { message: 'Address deleted successfully.' };
// };

// export const getPaymentMethods = async (token: string): Promise<PaymentMethod[]> => {
//   console.warn("getPaymentMethods is not implemented on the backend yet.");
//   return [];
// };

// interface CreateOrderPayload {
//     orderItems: { product: string; qty: number; price: number }[];
//     totalAmount: number;
//     paymentMethod: string;
//     shippingAddress: { address: string; city: string; state: string; zipCode: string; country: string; };
//     billingAddress: { address: string; city: string; state: string; zipCode: string; country: string; };
// }

// export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
//     const token = useAuthStore.getState().token;
//     if (!token) throw new Error("You must be logged in to create an order.");
    
//     const response = await apiFetch('/orders', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(payload),
//     });
//     return response.json();
// };


// export const createPaystackCheckoutSession = async (orderId: string): Promise<{ authorization_url: string }> => {
//     const token = useAuthStore.getState().token;
//     if (!token) throw new Error("Authentication token is missing.");

//     const response = await apiFetch('/paystack/init', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ orderId }),
//     });
    
//     return response.json();
// }


// // export const createPaystackCheckoutSession = async (payload: CheckoutPayload): Promise<{ authorization_url: string }> => {
// //   const response = await apiFetch('/paystack/init', {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json',
// //     },
// //     body: JSON.stringify(payload),
// //   });

// //   if (!response.ok) {
// //     const errorData = await response.json();
// //     throw new Error(errorData.error || 'Failed to create checkout session.');
// //   }
  
// //   return response.json();
// // }



// // export const createPaystackCheckoutSession = async (payload: CheckoutPayload): Promise<{ authorization_url: string }> => {
// //   const response = await fetch('/paystack/init', {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json',
// //     },
// //     body: JSON.stringify(payload),
// //   });

// //   if (!response.ok) {
// //     const errorData = await response.json();
// //     throw new Error(errorData.error || 'Failed to create checkout session.');
// //   }
  
// //   return response.json();
// // }

// // export const createPaystackCheckoutSession = async (payload: CheckoutPayload): Promise<{ authorization_url: string }> => {
// //   const response = await apiFetch('/payment/paystack', {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json',
// //     },
// //     body: JSON.stringify(payload),
// //   });
  
// //   // The backend should return a JSON object with the Paystack URL
// //   // e.g., { "authorization_url": "https://checkout.paystack.com/..." }
// //   return response.json();
// // };

// export const addPaymentMethod = async (token: string, data: Omit<PaymentMethod, 'id' | 'isDefault'>): Promise<PaymentMethod> => {
//   throw new Error("addPaymentMethod is not implemented yet.");
// };

// export const updatePaymentMethod = async (token: string, data: PaymentMethod): Promise<PaymentMethod> => {
//   throw new Error("updatePaymentMethod is not implemented yet.");
// };

// export const deletePaymentMethod = async (token: string, id: string): Promise<{ message: string }> => {
//   throw new Error("deletePaymentMethod is not implemented yet.");
// };


// export const getProductBySlug = async (slug: string): Promise<Product> => {
//   const response = await apiFetch(`/products/${slug}`);
//   return response.json();
// };

// export const getAllProducts = async ({ 
//   pageParam = 1, 
//   limit = 12,
//   category,
//   minPrice,
//   maxPrice,
//   brand,
//   wattage,
//   inStock,
//   sort
// }: { 
//   pageParam?: number | unknown, 
//   limit?: number,
//   category?: string,
//   minPrice?: number,
//   maxPrice?: number,
//   brand?: string,
//   wattage?: string,
//   inStock?: boolean,
//   sort?: string
// }): Promise<Product[]> => {
//   // Construct a URL with all the query parameters
//   const url = new URL(`${BASE_URL}/products`);
//   url.searchParams.set('page', String(pageParam as number));
//   url.searchParams.set('limit', String(limit));
  
//   // Add filters to the URL only if they have a value
//   if (category && category !== 'all') url.searchParams.set('category', category);
//   if (minPrice) url.searchParams.set('minPrice', String(minPrice));
//   if (maxPrice && maxPrice < 10000) url.searchParams.set('maxPrice', String(maxPrice));
//   if (brand) url.searchParams.set('brand', brand);
//   if (wattage && wattage !== 'all') url.searchParams.set('wattage', wattage);
//   if (inStock) url.searchParams.set('inStock', 'true');
//   if (sort && sort !== 'featured') url.searchParams.set('sort', sort);

//   const response = await fetch(url.toString());
//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || 'Failed to fetch products');
//   }
//   return response.json();
// };

// // export const getAllProducts = async ({ pageParam = 1, limit = 12 }): Promise<Product[]> => {
// //   const url = new URL(`${BASE_URL}/products`);
// //   url.searchParams.set('page', String(pageParam));
// //   url.searchParams.set('limit', String(limit));

// //   const response = await fetch(url.toString());
// //   if (!response.ok) {
// //     const errorData = await response.json();
// //     throw new Error(errorData.message || 'Failed to fetch products');
// //   }
// //   return response.json();
// // };

// export const createProduct = async (token: string, data: CreateProductData): Promise<Product> => {
//   const formData = new FormData();
//   Object.entries(data).forEach(([key, value]) => {
//       if (key === 'images') {
//           Array.from(value as FileList).forEach(file => {
//               formData.append('images', file);
//           });
//       } else {
//           formData.append(key, String(value));
//       }
//   });
  
//   const response = await fetch(`${BASE_URL}/products`, {
//       method: 'POST',
//       headers: { 'Authorization': `Bearer ${token}` },
//       body: formData,
//   });

//   if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to create product');
//   }
//   return response.json();
// };

// export const updateProduct = async (token: string, id: string, data: UpdateProductData): Promise<Product> => {
//     const formData = new FormData();
//     Object.entries(data).forEach(([key, value]) => {
//         if (key === 'images' && value) {
//             Array.from(value as FileList).forEach(file => {
//                 formData.append('images', file);
//             });
//         } else if (value !== undefined) {
//             formData.append(key, String(value));
//         }
//     });

//     const response = await fetch(`${BASE_URL}/products/${id}`, {
//         method: 'PUT',
//         headers: { 'Authorization': `Bearer ${token}` },
//         body: formData,
//     });
//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to update product');
//     }
//     return response.json();
// };

// export const deleteProduct = async (token: string, id: string): Promise<{ message: string }> => {
//     await apiFetch(`/products/${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` },
//     });
//     return { message: "Product deleted successfully." };
// };

// export const bulkDeleteProducts = async (token: string, data: BulkDeleteProductsData): Promise<{ message: string, count: number }> => {
//     const response = await apiFetch('/products/bulk-delete', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(data),
//     });
//     return response.json();
// };

// export interface CreateOrderPayload {
//     orderItems: { product: string; qty: number; price: number }[];
//     totalAmount: number;
//     paymentMethod: string;
//     shippingAddress: { street: string; city: string; state:string; postalCode: string; country: string; };
//     billingAddress: { street: string; city: string; state: string; postalCode: string; country: string; };
// }

// // // File: /components/services/api.ts
// // // This is the complete, unified API service file for your application.

// // import {
// //   LoginData,
// //   LoginResponse,
// //   RegisterData,
// //   RegisterResponse,
// //   VerifyEmailData,
// //   VerifyEmailResponse,
// //   ForgotPasswordData,
// //   ForgotPasswordResponse,
// //   ResetPasswordData,
// //   ResetPasswordResponse,
// //   UpdateProfileData,
// //   User,
// //   UserAddress,
// //   Order,
// //   PaymentMethod,
// // } from '@/components/types/auth';

// // // --- NEW: Import Product types ---
// // import {
// //   Product,
// //   CreateProductData,
// //   UpdateProductData,
// //   BulkDeleteProductsData,
// // } from '@/components/types/product';


// // const BASE_URL = 'https://solarbackend-3sf6.onrender.com/api';

// // const apiFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
// //   const response = await fetch(`${BASE_URL}${endpoint}`, options);
// //   if (!response.ok) {
// //     const errorData = await response.json();
// //     throw new Error(errorData.message || 'An API error occurred');
// //   }
// //   return response;
// // };

// // // --- Authentication & Profile Endpoints ---

// // export const loginUser = async (credentials: LoginData): Promise<LoginResponse> => {
// //   const response = await apiFetch('/auth/login', {
// //     method: 'POST',
// //     headers: { 'Content-Type': 'application/json' },
// //     body: JSON.stringify(credentials),
// //   });
// //   const responseData = await response.json();
// //   return {
// //     token: responseData.token,
// //     user: {
// //       _id: responseData._id,
// //       name: responseData.name,
// //       email: responseData.email,
// //       role: responseData.role,
// //     }
// //   };
// // };

// // export const registerUser = async (credentials: RegisterData): Promise<RegisterResponse> => {
// //     const response = await apiFetch('/auth/register', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(credentials),
// //     });
// //     const responseData = await response.json();
// //     return {
// //         message: responseData.message,
// //         user: {
// //             _id: responseData._id,
// //             name: responseData.name,
// //             email: responseData.email,
// //         }
// //     };
// // };

// // export const verifyEmail = async (data: VerifyEmailData): Promise<VerifyEmailResponse> => {
// //   const response = await apiFetch('/auth/verify-email', {
// //     method: 'POST',
// //     headers: { 'Content-Type': 'application/json' },
// //     body: JSON.stringify(data),
// //   });
// //   return response.json();
// // };

// // export const forgotPassword = async (data: ForgotPasswordData): Promise<ForgotPasswordResponse> => {
// //   const response = await apiFetch('/auth/forgot-password', {
// //     method: 'POST',
// //     headers: { 'Content-Type': 'application/json' },
// //     body: JSON.stringify(data),
// //   });
// //   return response.json();
// // };

// // export const resetPassword = async (data: ResetPasswordData): Promise<ResetPasswordResponse> => {
// //   const response = await apiFetch('/auth/reset-password', {
// //     method: 'POST',
// //     headers: { 'Content-Type': 'application/json' },
// //     body: JSON.stringify(data),
// //   });
// //   return response.json();
// // };

// // export const getProfile = async (token: string): Promise<User> => {
// //   const response = await apiFetch('/auth/profile', {
// //     headers: { 'Authorization': `Bearer ${token}` },
// //   });
// //   return response.json();
// // };

// // export const updateProfile = async (token: string, updateData: UpdateProfileData): Promise<User> => {
// //   const response = await apiFetch('/auth/profile', {
// //     method: 'PUT',
// //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
// //     body: JSON.stringify(updateData),
// //   });
// //   return response.json();
// // };

// // export const changePassword = async (token: string, data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
// //   const response = await apiFetch('/auth/change-password', {
// //     method: 'POST',
// //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
// //     body: JSON.stringify(data),
// //   });
// //   return response.json();
// // };

// // // --- Order Functions ---
// // export const getMyOrders = async (token: string): Promise<Order[]> => {
// //     const response = await apiFetch('/orders/myorders', {
// //         headers: { 'Authorization': `Bearer ${token}` },
// //     });
// //     return response.json();
// // };

// // // --- Address Functions ---
// // export const getUserAddresses = async (token: string): Promise<UserAddress[]> => {
// //   const response = await apiFetch('/users/addresses', {
// //     headers: { 'Authorization': `Bearer ${token}` },
// //   });
// //   return response.json();
// // };

// // export const addAddress = async (token: string, addressData: Omit<UserAddress, '_id' | 'isDefault'>): Promise<UserAddress> => {
// //   const response = await apiFetch('/users/addresses', {
// //     method: 'POST',
// //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
// //     body: JSON.stringify(addressData),
// //   });
// //   return response.json();
// // };

// // export const updateAddress = async (token: string, address: UserAddress): Promise<UserAddress> => {
// //   const response = await apiFetch(`/users/addresses/${address._id}`, {
// //     method: 'PUT',
// //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
// //     body: JSON.stringify(address),
// //   });
// //   return response.json();
// // };

// // export const deleteAddress = async (token: string, id: string): Promise<{ message: string }> => {
// //   await apiFetch(`/users/addresses/${id}`, {
// //     method: 'DELETE',
// //     headers: { 'Authorization': `Bearer ${token}` },
// //   });
// //   return { message: 'Address deleted successfully.' };
// // };

// // // --- Payment Method Functions (Placeholders) ---
// // export const getPaymentMethods = async (token: string): Promise<PaymentMethod[]> => {
// //   console.warn("getPaymentMethods is not implemented on the backend yet.");
// //   return [];
// // };

// // export const addPaymentMethod = async (token: string, data: Omit<PaymentMethod, 'id' | 'isDefault'>): Promise<PaymentMethod> => {
// //   throw new Error("addPaymentMethod is not implemented yet.");
// // };

// // export const updatePaymentMethod = async (token: string, data: PaymentMethod): Promise<PaymentMethod> => {
// //   throw new Error("updatePaymentMethod is not implemented yet.");
// // };

// // export const deletePaymentMethod = async (token: string, id: string): Promise<{ message: string }> => {
// //   throw new Error("deletePaymentMethod is not implemented yet.");
// // };

// // // --- NEW: Product Endpoints ---

// // export const getAllProducts = async (): Promise<Product[]> => {
// //   const response = await apiFetch('/products');
// //   return response.json();
// // };

// // export const createProduct = async (token: string, data: CreateProductData): Promise<Product> => {
// //   const formData = new FormData();
// //   Object.entries(data).forEach(([key, value]) => {
// //       if (key === 'images') {
// //           Array.from(value as FileList).forEach(file => {
// //               formData.append('images', file);
// //           });
// //       } else {
// //           formData.append(key, String(value));
// //       }
// //   });
  
// //   // Note: We use the native fetch here because our apiFetch helper isn't designed for FormData responses.
// //   const response = await fetch(`${BASE_URL}/products`, {
// //       method: 'POST',
// //       headers: { 'Authorization': `Bearer ${token}` },
// //       body: formData,
// //   });

// //   if (!response.ok) {
// //       const errorData = await response.json();
// //       throw new Error(errorData.message || 'Failed to create product');
// //   }
// //   return response.json();
// // };

// // export const updateProduct = async (token: string, id: string, data: UpdateProductData): Promise<Product> => {
// //     const formData = new FormData();
// //     Object.entries(data).forEach(([key, value]) => {
// //         if (key === 'images' && value) {
// //             Array.from(value as FileList).forEach(file => {
// //                 formData.append('images', file);
// //             });
// //         } else if (value !== undefined) {
// //             formData.append(key, String(value));
// //         }
// //     });

// //     const response = await fetch(`${BASE_URL}/products/${id}`, {
// //         method: 'PUT',
// //         headers: { 'Authorization': `Bearer ${token}` },
// //         body: formData,
// //     });
// //     if (!response.ok) {
// //         const errorData = await response.json();
// //         throw new Error(errorData.message || 'Failed to update product');
// //     }
// //     return response.json();
// // };

// // export const deleteProduct = async (token: string, id: string): Promise<{ message: string }> => {
// //     await apiFetch(`/products/${id}`, {
// //         method: 'DELETE',
// //         headers: { 'Authorization': `Bearer ${token}` },
// //     });
// //     return { message: "Product deleted successfully." };
// // };

// // export const bulkDeleteProducts = async (token: string, data: BulkDeleteProductsData): Promise<{ message: string, count: number }> => {
// //     const response = await apiFetch('/products/bulk-delete', {
// //         method: 'POST',
// //         headers: {
// //             'Content-Type': 'application/json',
// //             'Authorization': `Bearer ${token}`,
// //         },
// //         body: JSON.stringify(data),
// //     });
// //     return response.json();
// // };

// // // import {
// // //   LoginData,
// // //   LoginResponse,
// // //   RegisterData,
// // //   RegisterResponse,
// // //   VerifyEmailData,
// // //   VerifyEmailResponse,
// // //   ForgotPasswordData,
// // //   ForgotPasswordResponse,
// // //   ResetPasswordData,
// // //   ResetPasswordResponse,
// // //   UpdateProfileData,
// // //   User,
// // //   UserAddress,
// // //   Order,
// // //   PaymentMethod,
// // // } from '@/components/types/auth';

// // // const BASE_URL = 'https://solarbackend-3sf6.onrender.com/api';

// // // const apiFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
// // //   const response = await fetch(`${BASE_URL}${endpoint}`, options);
// // //   if (!response.ok) {
// // //     const errorData = await response.json();
// // //     throw new Error(errorData.message || 'An API error occurred');
// // //   }
// // //   return response;
// // // };


// // // export const loginUser = async (credentials: LoginData): Promise<LoginResponse> => {
// // //   const response = await apiFetch('/auth/login', {
// // //     method: 'POST',
// // //     headers: { 'Content-Type': 'application/json' },
// // //     body: JSON.stringify(credentials),
// // //   });
// // //   const responseData = await response.json();
// // //   return {
// // //     token: responseData.token,
// // //     user: {
// // //       _id: responseData._id,
// // //       name: responseData.name,
// // //       email: responseData.email,
// // //       role: responseData.role,
// // //     }
// // //   };
// // // };

// // // export const registerUser = async (credentials: RegisterData): Promise<RegisterResponse> => {
// // //     const response = await apiFetch('/auth/register', {
// // //         method: 'POST',
// // //         headers: { 'Content-Type': 'application/json' },
// // //         body: JSON.stringify(credentials),
// // //     });
// // //     const responseData = await response.json();
// // //     return {
// // //         message: responseData.message,
// // //         user: {
// // //             _id: responseData._id,
// // //             name: responseData.name,
// // //             email: responseData.email,
// // //         }
// // //     };
// // // };

// // // export const verifyEmail = async (data: VerifyEmailData): Promise<VerifyEmailResponse> => {
// // //   const response = await apiFetch('/auth/verify-email', {
// // //     method: 'POST',
// // //     headers: { 'Content-Type': 'application/json' },
// // //     body: JSON.stringify(data),
// // //   });
// // //   return response.json();
// // // };

// // // export const forgotPassword = async (data: ForgotPasswordData): Promise<ForgotPasswordResponse> => {
// // //   const response = await apiFetch('/auth/forgot-password', {
// // //     method: 'POST',
// // //     headers: { 'Content-Type': 'application/json' },
// // //     body: JSON.stringify(data),
// // //   });
// // //   return response.json();
// // // };

// // // export const resetPassword = async (data: ResetPasswordData): Promise<ResetPasswordResponse> => {
// // //   const response = await apiFetch('/auth/reset-password', {
// // //     method: 'POST',
// // //     headers: { 'Content-Type': 'application/json' },
// // //     body: JSON.stringify(data),
// // //   });
// // //   return response.json();
// // // };

// // // export const getProfile = async (token: string): Promise<User> => {
// // //   const response = await apiFetch('/auth/profile', {
// // //     headers: { 'Authorization': `Bearer ${token}` },
// // //   });
// // //   return response.json(); // Now we are explicitly parsing the JSON
// // // };

// // // export const updateProfile = async (token: string, updateData: UpdateProfileData): Promise<User> => {
// // //   const response = await apiFetch('/auth/profile', {
// // //     method: 'PUT',
// // //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
// // //     body: JSON.stringify(updateData),
// // //   });
// // //   return response.json();
// // // };

// // // export const changePassword = async (token: string, data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
// // //   const response = await apiFetch('/auth/change-password', {
// // //     method: 'POST',
// // //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
// // //     body: JSON.stringify(data),
// // //   });
// // //   return response.json();
// // // };

// // // // --- Order Functions ---
// // // export const getMyOrders = async (token: string): Promise<Order[]> => {
// // //     const response = await apiFetch('/orders/myorders', {
// // //         headers: { 'Authorization': `Bearer ${token}` },
// // //     });
// // //     return response.json();
// // // };

// // // // --- Address Functions ---
// // // export const getUserAddresses = async (token: string): Promise<UserAddress[]> => {
// // //   const response = await apiFetch('/users/addresses', {
// // //     headers: { 'Authorization': `Bearer ${token}` },
// // //   });
// // //   return response.json();
// // // };

// // // export const addAddress = async (token: string, addressData: Omit<UserAddress, '_id' | 'isDefault'>): Promise<UserAddress> => {
// // //   const response = await apiFetch('/users/addresses', {
// // //     method: 'POST',
// // //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
// // //     body: JSON.stringify(addressData),
// // //   });
// // //   return response.json();
// // // };

// // // export const updateAddress = async (token: string, address: UserAddress): Promise<UserAddress> => {
// // //   const response = await apiFetch(`/users/addresses/${address._id}`, {
// // //     method: 'PUT',
// // //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
// // //     body: JSON.stringify(address),
// // //   });
// // //   return response.json();
// // // };

// // // export const deleteAddress = async (token: string, id: string): Promise<{ message: string }> => {
// // //   // DELETE requests often return no body, so we don't try to parse JSON
// // //   await apiFetch(`/users/addresses/${id}`, {
// // //     method: 'DELETE',
// // //     headers: { 'Authorization': `Bearer ${token}` },
// // //   });
// // //   return { message: 'Address deleted successfully.' };
// // // };

// // // // --- Payment Method Functions (Placeholders) ---
// // // export const getPaymentMethods = async (token: string): Promise<PaymentMethod[]> => {
// // //   console.warn("getPaymentMethods is not implemented on the backend yet.");
// // //   return [];
// // // };

// // // export const addPaymentMethod = async (token: string, data: Omit<PaymentMethod, 'id' | 'isDefault'>): Promise<PaymentMethod> => {
// // //   throw new Error("addPaymentMethod is not implemented yet.");
// // // };

// // // export const updatePaymentMethod = async (token: string, data: PaymentMethod): Promise<PaymentMethod> => {
// // //   throw new Error("updatePaymentMethod is not implemented yet.");
// // // };

// // // export const deletePaymentMethod = async (token: string, id: string): Promise<{ message: string }> => {
// // //   throw new Error("deletePaymentMethod is not implemented yet.");
// // // };