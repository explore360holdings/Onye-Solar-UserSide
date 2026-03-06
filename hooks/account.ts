// File: /hooks/account.ts

import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryResult,
    UseMutationResult,
} from "@tanstack/react-query";

import {
    getProfile, updateProfile, changePassword, getMyOrders, getOrderById,
    getUserAddresses, addAddress, updateAddress, deleteAddress,
    getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod,
} from '@/components/services/api';

import {
    User, UpdateProfileData, Order, OrderDetails, UserAddress, PaymentMethod
} from '@/components/types/auth';

import { useAuthStore } from '@/components/store/authStore';
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

// This is the final, correct version of this file.
// The key fix is adding the explicit generic types `<User, Error>` to every
// `useQuery` call. This solves the TypeScript inference issue.

export const useUser = (): UseQueryResult<User, Error> => {
    const { token, logout } = useAuthStore();
    const { toast } = useToast();

    // FIX: Explicitly add the generic types <User, Error> to the useQuery call.
    const queryResult = useQuery<User, Error>({
        queryKey: ["user", token],
        queryFn: () => getProfile(token!),
        enabled: !!token,
    });

    useEffect(() => {
        if (queryResult.isError) {
            toast({
                title: "Authentication Error",
                description: "Your session has expired. Please log in again.",
                variant: "destructive"
            });
            logout();
        }
    }, [queryResult.isError, toast, logout]);

    return queryResult;
};

export const useUpdateProfile = (): UseMutationResult<User, Error, UpdateProfileData> => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();
    return useMutation({
        mutationFn: (data: UpdateProfileData) => updateProfile(token!, data),
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(["user", token], updatedUser);
        },
    });
};

export const useChangePassword = (): UseMutationResult<{ message: string }, Error, { currentPassword: string; newPassword: string }> => {
    const { token } = useAuthStore();
    return useMutation({
        mutationFn: (data) => changePassword(token!, data),
    });
};

export const useOrders = (): UseQueryResult<Order[], Error> => {
    const { token } = useAuthStore();
    // FIX: Explicitly add the generic types to the useQuery call.
    return useQuery<Order[], Error>({
        queryKey: ["orders", token],
        queryFn: () => getMyOrders(token!),
        enabled: !!token,
    });
};

export const useOrderDetails = (orderId: string | null): UseQueryResult<OrderDetails, Error> => {
    const { token } = useAuthStore();
    return useQuery<OrderDetails, Error>({
        queryKey: ["order", orderId, token],
        queryFn: () => getOrderById(token!, orderId!),
        enabled: !!token && !!orderId,
    });
};

export const useAddresses = (): UseQueryResult<UserAddress[], Error> => {
    const { token } = useAuthStore();
    // FIX: Explicitly add the generic types to the useQuery call.
    return useQuery<UserAddress[], Error>({
        queryKey: ["addresses", token],
        queryFn: () => getUserAddresses(token!),
        enabled: !!token,
    });
};

export const useAddAddress = (): UseMutationResult<UserAddress, Error, Omit<UserAddress, '_id' | 'isDefault'>> => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();
    return useMutation({
        mutationFn: (data) => addAddress(token!, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
    });
};

export const useUpdateAddress = (): UseMutationResult<UserAddress, Error, UserAddress> => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();
    return useMutation({
        mutationFn: (data) => updateAddress(token!, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
    });
};

export const useDeleteAddress = (): UseMutationResult<{ message: string }, Error, string> => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();
    return useMutation({
        mutationFn: (id) => deleteAddress(token!, id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
    });
};

export const usePaymentMethods = (): UseQueryResult<PaymentMethod[], Error> => {
    const { token } = useAuthStore();
    // FIX: Explicitly add the generic types to the useQuery call.
    return useQuery<PaymentMethod[], Error>({
        queryKey: ["paymentMethods", token],
        queryFn: () => getPaymentMethods(token!),
        enabled: !!token,
    });
};

export const useAddPaymentMethod = (): UseMutationResult<PaymentMethod, Error, Omit<PaymentMethod, 'id' | 'isDefault'>> => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();
    return useMutation({
        mutationFn: (data) => addPaymentMethod(token!, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
    });
};

export const useUpdatePaymentMethod = (): UseMutationResult<PaymentMethod, Error, PaymentMethod> => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();
    return useMutation({
        mutationFn: (data) => updatePaymentMethod(token!, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
    });
};

export const useDeletePaymentMethod = (): UseMutationResult<{ message: string }, Error, string> => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();
    return useMutation({
        mutationFn: (id) => deletePaymentMethod(token!, id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
    });
};

// // File: /hooks/account.ts

// import {
//     useQuery,
//     useMutation,
//     useQueryClient,
//     UseQueryResult,
//     UseMutationResult,
// } from "@tanstack/react-query";

// import {
//     getProfile, updateProfile, changePassword, getMyOrders,
//     getUserAddresses, addAddress, updateAddress, deleteAddress,
//     getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod,
// } from '@/components/services/api';

// // Import all types from the single source of truth: auth.ts
// import {
//     User, UpdateProfileData, Order, UserAddress, PaymentMethod
// } from '@/components/types/auth';

// import { useAuthStore } from '@/components/store/authStore';
// import { useToast } from "@/hooks/use-toast";
// import { useEffect } from "react";

// // ---
// // This is the fully corrected and type-safe version of your hooks file.
// // It connects to your REAL API by passing the authentication token to every call.
// // It also includes explicit return types (e.g., UseQueryResult) to fix the errors
// // in your components.
// // ---

// export const useUser = (): UseQueryResult<User, Error> => {
//     const { token, logout } = useAuthStore();
//     const { toast } = useToast();

//     const queryResult = useQuery({
//         // The queryKey includes the token so it re-fetches if the user logs in/out
//         queryKey: ["user", token],
//         // The queryFn now correctly calls the real API with the token
//         queryFn: () => getProfile(token!),
//         // The query will not run until the token is available
//         enabled: !!token,
//     });

//     useEffect(() => {
//         if (queryResult.isError) {
//             toast({
//                 title: "Authentication Error",
//                 description: "Your session has expired. Please log in again.",
//                 variant: "destructive"
//             });
//             logout();
//         }
//     }, [queryResult.isError, toast, logout]);

//     return queryResult;
// };

// export const useUpdateProfile = (): UseMutationResult<User, Error, UpdateProfileData> => {
//     const queryClient = useQueryClient();
//     const { token } = useAuthStore();
//     return useMutation({
//         // The mutationFn passes the token along with the form data
//         mutationFn: (data: UpdateProfileData) => updateProfile(token!, data),
//         onSuccess: (updatedUser) => {
//             // Update the user query cache with the new data
//             queryClient.setQueryData(["user", token], updatedUser);
//         },
//     });
// };

// export const useChangePassword = (): UseMutationResult<{ message: string }, Error, { currentPassword: string; newPassword: string }> => {
//     const { token } = useAuthStore();
//     return useMutation({
//         mutationFn: (data) => changePassword(token!, data),
//     });
// };

// export const useOrders = (): UseQueryResult<Order[], Error> => {
//     const { token } = useAuthStore();
//     return useQuery({
//         queryKey: ["orders", token],
//         queryFn: () => getMyOrders(token!),
//         enabled: !!token,
//     });
// };

// export const useAddresses = (): UseQueryResult<UserAddress[], Error> => {
//     const { token } = useAuthStore();
//     return useQuery({
//         queryKey: ["addresses", token],
//         queryFn: () => getUserAddresses(token!),
//         enabled: !!token,
//     });
// };

// export const useAddAddress = (): UseMutationResult<UserAddress, Error, Omit<UserAddress, '_id' | 'isDefault'>> => {
//     const queryClient = useQueryClient();
//     const { token } = useAuthStore();
//     return useMutation({
//         mutationFn: (data) => addAddress(token!, data),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
//     });
// };

// export const useUpdateAddress = (): UseMutationResult<UserAddress, Error, UserAddress> => {
//     const queryClient = useQueryClient();
//     const { token } = useAuthStore();
//     return useMutation({
//         mutationFn: (data) => updateAddress(token!, data),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
//     });
// };

// export const useDeleteAddress = (): UseMutationResult<{ message: string }, Error, string> => {
//     const queryClient = useQueryClient();
//     const { token } = useAuthStore();
//     return useMutation({
//         mutationFn: (id) => deleteAddress(token!, id),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
//     });
// };

// export const usePaymentMethods = (): UseQueryResult<PaymentMethod[], Error> => {
//     const { token } = useAuthStore();
//     return useQuery({
//         queryKey: ["paymentMethods", token],
//         queryFn: () => getPaymentMethods(token!),
//         enabled: !!token,
//     });
// };

// export const useAddPaymentMethod = (): UseMutationResult<PaymentMethod, Error, Omit<PaymentMethod, 'id' | 'isDefault'>> => {
//     const queryClient = useQueryClient();
//     const { token } = useAuthStore();
//     return useMutation({
//         mutationFn: (data) => addPaymentMethod(token!, data),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
//     });
// };

// export const useUpdatePaymentMethod = (): UseMutationResult<PaymentMethod, Error, PaymentMethod> => {
//     const queryClient = useQueryClient();
//     const { token } = useAuthStore();
//     return useMutation({
//         mutationFn: (data) => updatePaymentMethod(token!, data),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
//     });
// };

// export const useDeletePaymentMethod = (): UseMutationResult<{ message: string }, Error, string> => {
//     const queryClient = useQueryClient();
//     const { token } = useAuthStore();
//     return useMutation({
//         mutationFn: (id) => deletePaymentMethod(token!, id),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
//     });
// };

// // File: hooks/account.ts

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//     updateProfile, changePassword, getMyOrders,
//     getUserAddresses, addAddress, updateAddress, deleteAddress,
//     getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod,
//     Order, Address, PaymentMethod
// } from '@/components/services/api';

// // Correctly import the User type from the unified types file.
// import { User } from '@/components/types/user';
// import { getProfile as getProfileFromApi } from "@/components/services/api"; // Renamed import to avoid conflict
// import { useAuthStore } from '@/components/store/authStore';
// import { useToast } from "@/hooks/use-toast";
// import { useEffect } from "react";

// // Note: Your auth-api's getProfile might differ from the mock api's getProfile.
// // This implementation now uses the mock getProfile.
// export const useUser = () => {
//     const { token, logout } = useAuthStore();
//     const { toast } = useToast();

//     const queryResult = useQuery<User, Error>({
//         queryKey: ["user", token],
//         // The mock `getProfile` doesn't need a token.
//         queryFn: getProfileFromApi,
//         enabled: !!token,
//     });

//     useEffect(() => {
//         if (queryResult.isError) {
//             toast({
//                 title: "Authentication Error",
//                 description: "Your session has expired. Please log in again.",
//                 variant: "destructive"
//             });
//             logout();
//         }
//     }, [queryResult.isError, toast, logout]);

//     return queryResult;
// };

// export const useUpdateProfile = () => {
//     const queryClient = useQueryClient();
//     return useMutation<User, Error, Partial<User>>({
//         // FIX: The mock `updateProfile` function does not require a token.
//         mutationFn: (data) => updateProfile(data),
//         onSuccess: (data) => {
//             // Note: The mock returns a fixed user. For a real app, you might want to merge data.
//             queryClient.setQueryData(["user"], data);
//         },
//     });
// };

// export const useChangePassword = () => {
//     return useMutation<{ message: string }, Error, { currentPassword: string; newPassword: string }>({
//         // FIX: The mock `changePassword` function does not require a token.
//         mutationFn: (data) => changePassword(data),
//     });
// };

// export const useOrders = () => {
//     const { token } = useAuthStore();
//     return useQuery<Order[], Error>({
//         queryKey: ["orders", token],
//         // FIX: The mock `getMyOrders` function does not require a token.
//         queryFn: getMyOrders,
//         enabled: !!token,
//     });
// };

// export const useAddresses = () => {
//     const { token } = useAuthStore();
//     return useQuery<Address[], Error>({
//         queryKey: ["addresses", token],
//         // FIX: The mock `getUserAddresses` function does not require a token.
//         queryFn: getUserAddresses,
//         enabled: !!token,
//     });
// };

// export const useAddAddress = () => {
//     const queryClient = useQueryClient();
//     return useMutation<Address, Error, Omit<Address, 'id'>>({
//         // FIX: The mock `addAddress` function does not require a token.
//         mutationFn: (data) => addAddress(data),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
//     });
// };

// export const useUpdateAddress = () => {
//     const queryClient = useQueryClient();
//     return useMutation<Address, Error, Address>({
//         // FIX: The mock `updateAddress` function does not require a token.
//         mutationFn: (data) => updateAddress(data),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
//     });
// };

// export const useDeleteAddress = () => {
//     const queryClient = useQueryClient();
//     return useMutation<{ message: string }, Error, string>({
//         // FIX: The mock `deleteAddress` function only takes an `id`.
//         mutationFn: (id) => deleteAddress(id),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
//     });
// };

// export const usePaymentMethods = () => {
//     const { token } = useAuthStore();
//     return useQuery<PaymentMethod[], Error>({
//         queryKey: ["paymentMethods", token],
//         // FIX: The mock `getPaymentMethods` function does not require a token.
//         queryFn: getPaymentMethods,
//         enabled: !!token,
//     });
// };

// export const useAddPaymentMethod = () => {
//     const queryClient = useQueryClient();
//     return useMutation<PaymentMethod, Error, Omit<PaymentMethod, 'id'>>({
//         // FIX: The mock `addPaymentMethod` function does not require a token.
//         mutationFn: (data) => addPaymentMethod(data),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
//     });
// };

// export const useUpdatePaymentMethod = () => {
//     const queryClient = useQueryClient();
//     return useMutation<PaymentMethod, Error, PaymentMethod>({
//         // FIX: The mock `updatePaymentMethod` function does not require a token.
//         mutationFn: (data) => updatePaymentMethod(data),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
//     });
// };

// export const useDeletePaymentMethod = () => {
//     const queryClient = useQueryClient();
//     return useMutation<{ message: string }, Error, string>({
//         // FIX: The mock `deletePaymentMethod` function only takes an `id`.
//         mutationFn: (id) => deletePaymentMethod(id),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
//     });
// };

// // // File: hooks/account.ts

// // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// // import {
// //     updateProfile, changePassword, getMyOrders,
// //     getUserAddresses, addAddress, updateAddress, deleteAddress,
// //     getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod,
// //     Order, Address, PaymentMethod
// // } from '@/components/services/api';

// // // Correctly import the User type from the unified types file.
// // import { User } from '@/components/types/user';
// // import { getProfile } from "@/components/services/auth-api";
// // import { useAuthStore } from '@/components/store/authStore';
// // import { useToast } from "@/hooks/use-toast";
// // import { useEffect } from "react";

// // // The corrected useUser hook now uses the unified type
// // export const useUser = () => {
// //     const { token, logout } = useAuthStore();
// //     const { toast } = useToast();

// //     const queryResult = useQuery<User, Error>({
// //         queryKey: ["user", token],
// //         queryFn: async () => {
// //             if (!token) {
// //                 return Promise.reject(new Error("Authentication token is missing."));
// //             }
// //             return getProfile(token);
// //         },
// //         enabled: !!token,
// //     });

// //     useEffect(() => {
// //         if (queryResult.isError) {
// //             toast({
// //                 title: "Authentication Error",
// //                 description: "Your session has expired. Please log in again.",
// //                 variant: "destructive"
// //             });
// //             logout();
// //         }
// //     }, [queryResult.isError, toast, logout]);

// //     return queryResult;
// // };

// // // All other hooks are fine. Keep them as they are.


// // export const useUpdateProfile = () => {
// //     const queryClient = useQueryClient();
// //     const { token } = useAuthStore();
// //     return useMutation<User, Error, Partial<User>>({
// //         // Updated mutationFn for clarity and robustness
// //         mutationFn: async (data) => {
// //             // The `data` argument is the payload you pass to `mutate()`.
// //             // The `token` is from the outer scope of the hook.
// //             if (!token) {
// //                 throw new Error("Authentication token is missing.");
// //             }
// //             return updateProfile(token, data);
// //         },
// //         onSuccess: (data) => {
// //             queryClient.setQueryData(["user"], data);
// //         },
// //     });
// // };
// // export const useChangePassword = () => {
// //     const { token } = useAuthStore();
// //     return useMutation<{ message: string }, Error, { currentPassword: string; newPassword: string }>({
// //         mutationFn: (data) => changePassword(token!, data),
// //     });
// // };

// // export const useOrders = () => {
// //     const { token } = useAuthStore();
// //     return useQuery<Order[], Error>({
// //         queryKey: ["orders", token],
// //         queryFn: () => getMyOrders(token!),
// //         enabled: !!token,
// //     });
// // };

// // export const useAddresses = () => {
// //     const { token } = useAuthStore();
// //     return useQuery<Address[], Error>({
// //         queryKey: ["addresses", token],
// //         queryFn: () => getUserAddresses(token!),
// //         enabled: !!token,
// //     });
// // };

// // export const useAddAddress = () => {
// //     const queryClient = useQueryClient();
// //     const { token } = useAuthStore();
// //     return useMutation<Address, Error, Omit<Address, 'id'>>({
// //         mutationFn: (data) => addAddress(token!, data),
// //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// //     });
// // };

// // export const useUpdateAddress = () => {
// //     const queryClient = useQueryClient();
// //     const { token } = useAuthStore();
// //     return useMutation<Address, Error, Address>({
// //         mutationFn: (data) => updateAddress(token!, data),
// //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// //     });
// // };

// // export const useDeleteAddress = () => {
// //     const queryClient = useQueryClient();
// //     // The token is retrieved from the store but the API call below might not need it
// //     // if the authentication is handled by an API client/interceptor.
// //     const { token } = useAuthStore();
// //     return useMutation<{ message: string }, Error, string>({
// //         // FIX: The mutation function is corrected to only pass the `id` to `deleteAddress`.
// //         mutationFn: (id) => deleteAddress(id),
// //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// //     });
// // };

// // export const usePaymentMethods = () => {
// //     const { token } = useAuthStore();
// //     return useQuery<PaymentMethod[], Error>({
// //         queryKey: ["paymentMethods", token],
// //         queryFn: () => getPaymentMethods(token!),
// //         enabled: !!token,
// //     });
// // };

// // export const useAddPaymentMethod = () => {
// //     const queryClient = useQueryClient();
// //     const { token } = useAuthStore();
// //     return useMutation<PaymentMethod, Error, Omit<PaymentMethod, 'id'>>({
// //         mutationFn: (data) => addPaymentMethod(token!, data),
// //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// //     });
// // };

// // export const useUpdatePaymentMethod = () => {
// //     const queryClient = useQueryClient();
// //     const { token } = useAuthStore();
// //     return useMutation<PaymentMethod, Error, PaymentMethod>({
// //         mutationFn: (data) => updatePaymentMethod(token!, data),
// //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// //     });
// // };

// // export const useDeletePaymentMethod = () => {
// //     const queryClient = useQueryClient();
// //     // The token is retrieved from the store but the API call below might not need it
// //     // if the authentication is handled by an API client/interceptor.
// //     const { token } = useAuthStore();
// //     return useMutation<{ message: string }, Error, string>({
// //         // FIX: The mutation function is corrected to only pass the `id` to `deletePaymentMethod`.
// //         mutationFn: (id) => deletePaymentMethod(id),
// //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// //     });
// // };



// // // // File: hooks/account.ts

// // // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// // // import {
// // //     updateProfile, changePassword, getMyOrders,
// // //     getUserAddresses, addAddress, updateAddress, deleteAddress,
// // //     getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod,
// // //     Order, Address, PaymentMethod
// // // } from '@/components/services/api';

// // // // Correctly import the User type from the unified types file.
// // // import { User } from '@/components/types/user';
// // // import { getProfile } from "@/components/services/auth-api";
// // // import { useAuthStore } from '@/components/store/authStore';
// // // import { useToast } from "@/hooks/use-toast";
// // // import { useEffect } from "react";

// // // // The corrected useUser hook now uses the unified type
// // // export const useUser = () => {
// // //     const { token, logout } = useAuthStore();
// // //     const { toast } = useToast();

// // //     const queryResult = useQuery<User, Error>({
// // //         queryKey: ["user", token],
// // //         queryFn: async () => {
// // //             if (!token) {
// // //                 return Promise.reject(new Error("Authentication token is missing."));
// // //             }
// // //             return getProfile(token);
// // //         },
// // //         enabled: !!token,
// // //     });

// // //     useEffect(() => {
// // //         if (queryResult.isError) {
// // //             toast({
// // //                 title: "Authentication Error",
// // //                 description: "Your session has expired. Please log in again.",
// // //                 variant: "destructive"
// // //             });
// // //             logout();
// // //         }
// // //     }, [queryResult.isError, toast, logout]);

// // //     return queryResult;
// // // };

// // // // All other hooks are fine. Keep them as they are.


// // // export const useUpdateProfile = () => {
// // //     const queryClient = useQueryClient();
// // //     const { token } = useAuthStore();
// // //     return useMutation<User, Error, Partial<User>>({
// // //         // Updated mutationFn for clarity and robustness
// // //         mutationFn: async (data) => {
// // //             // The `data` argument is the payload you pass to `mutate()`.
// // //             // The `token` is from the outer scope of the hook.
// // //             if (!token) {
// // //                 throw new Error("Authentication token is missing.");
// // //             }
// // //             return updateProfile(token, data);
// // //         },
// // //         onSuccess: (data) => {
// // //             queryClient.setQueryData(["user"], data);
// // //         },
// // //     });
// // // };
// // // export const useChangePassword = () => {
// // //     const { token } = useAuthStore();
// // //     return useMutation<{ message: string }, Error, { currentPassword: string; newPassword: string }>({
// // //         mutationFn: (data) => changePassword(token!, data),
// // //     });
// // // };

// // // export const useOrders = () => {
// // //     const { token } = useAuthStore();
// // //     return useQuery<Order[], Error>({
// // //         queryKey: ["orders", token],
// // //         queryFn: () => getMyOrders(token!),
// // //         enabled: !!token,
// // //     });
// // // };

// // // export const useAddresses = () => {
// // //     const { token } = useAuthStore();
// // //     return useQuery<Address[], Error>({
// // //         queryKey: ["addresses", token],
// // //         queryFn: () => getUserAddresses(token!),
// // //         enabled: !!token,
// // //     });
// // // };

// // // export const useAddAddress = () => {
// // //     const queryClient = useQueryClient();
// // //     const { token } = useAuthStore();
// // //     return useMutation<Address, Error, Omit<Address, 'id'>>({
// // //         mutationFn: (data) => addAddress(token!, data),
// // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // //     });
// // // };

// // // export const useUpdateAddress = () => {
// // //     const queryClient = useQueryClient();
// // //     const { token } = useAuthStore();
// // //     return useMutation<Address, Error, Address>({
// // //         mutationFn: (data) => updateAddress(token!, data),
// // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // //     });
// // // };

// // // export const useDeleteAddress = () => {
// // //     const queryClient = useQueryClient();
// // //     const { token } = useAuthStore();
// // //     // Corrected `mutationFn` to pass only `id`. The `token` is from the closure.
// // //     // Assuming `deleteAddress` returns `{ message: string }`, the return type is fixed.
// // //     return useMutation<{ message: string }, Error, string>({
// // //         mutationFn: (id) => deleteAddress(token!, id),
// // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // //     });
// // // };

// // // export const usePaymentMethods = () => {
// // //     const { token } = useAuthStore();
// // //     return useQuery<PaymentMethod[], Error>({
// // //         queryKey: ["paymentMethods", token],
// // //         queryFn: () => getPaymentMethods(token!),
// // //         enabled: !!token,
// // //     });
// // // };

// // // export const useAddPaymentMethod = () => {
// // //     const queryClient = useQueryClient();
// // //     const { token } = useAuthStore();
// // //     return useMutation<PaymentMethod, Error, Omit<PaymentMethod, 'id'>>({
// // //         mutationFn: (data) => addPaymentMethod(token!, data),
// // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // //     });
// // // };

// // // export const useUpdatePaymentMethod = () => {
// // //     const queryClient = useQueryClient();
// // //     const { token } = useAuthStore();
// // //     return useMutation<PaymentMethod, Error, PaymentMethod>({
// // //         mutationFn: (data) => updatePaymentMethod(token!, data),
// // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // //     });
// // // };

// // // export const useDeletePaymentMethod = () => {
// // //     const queryClient = useQueryClient();
// // //     const { token } = useAuthStore();
// // //     // Corrected `mutationFn` to pass only `id` and the return type to match.
// // //     // Assuming `deletePaymentMethod` returns `{ message: string }`, the return type is fixed.
// // //     return useMutation<{ message: string }, Error, string>({
// // //         mutationFn: (id) => deletePaymentMethod(token!, id),
// // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // //     });
// // // };

// // // // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// // // // import {
// // // //     updateProfile, changePassword, getMyOrders,
// // // //     getUserAddresses, addAddress, updateAddress, deleteAddress,
// // // //     getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod
// // // // } from '@/components/services/api';

// // // // // Correctly import the User type from the unified types file
// // // // import { User } from '@/components/types/user';
// // // // import { getProfile } from "@/components/services/auth-api";
// // // // import { useAuthStore } from '@/components/store/authStore';
// // // // import { Order, Address, PaymentMethod } from '@/components/services/api'; 
// // // // import { useToast } from "@/hooks/use-toast";
// // // // import { useEffect } from "react";

// // // // // The corrected useUser hook now uses the unified type
// // // // export const useUser = () => {
// // // //     const { token, logout } = useAuthStore();
// // // //     const { toast } = useToast();

// // // //     const queryResult = useQuery<User, Error>({
// // // //         queryKey: ["user", token],
// // // //         queryFn: async () => {
// // // //             if (!token) {
// // // //                 return Promise.reject(new Error("Authentication token is missing."));
// // // //             }
// // // //             return getProfile(token);
// // // //         },
// // // //         enabled: !!token,
// // // //     });

// // // //     useEffect(() => {
// // // //         if (queryResult.isError) {
// // // //             toast({
// // // //                 title: "Authentication Error",
// // // //                 description: "Your session has expired. Please log in again.",
// // // //                 variant: "destructive"
// // // //             });
// // // //             logout();
// // // //         }
// // // //     }, [queryResult.isError, toast, logout]);

// // // //     return queryResult;
// // // // };

// // // // // All other hooks are fine. Keep them as they are.

// // // // export const useUpdateProfile = () => {
// // // //     const queryClient = useQueryClient();
// // // //     const { token } = useAuthStore();
// // // //     return useMutation<User, Error, Partial<User>>({
// // // //         mutationFn: (data) => updateProfile(token!, data),
// // // //         onSuccess: (data) => queryClient.setQueryData(["user"], data),
// // // //     });
// // // // };

// // // // export const useChangePassword = () => {
// // // //     const { token } = useAuthStore();
// // // //     return useMutation<{ message: string }, Error, { currentPassword: string; newPassword: string }>({
// // // //         mutationFn: (data) => changePassword(token!, data),
// // // //     });
// // // // };

// // // // export const useOrders = () => {
// // // //     const { token } = useAuthStore();
// // // //     return useQuery<Order[], Error>({
// // // //         queryKey: ["orders", token],
// // // //         queryFn: () => getMyOrders(token!),
// // // //         enabled: !!token,
// // // //     });
// // // // };

// // // // export const useAddresses = () => {
// // // //     const { token } = useAuthStore();
// // // //     return useQuery<Address[], Error>({
// // // //         queryKey: ["addresses", token],
// // // //         queryFn: () => getUserAddresses(token!),
// // // //         enabled: !!token,
// // // //     });
// // // // };

// // // // export const useAddAddress = () => {
// // // //     const queryClient = useQueryClient();
// // // //     const { token } = useAuthStore();
// // // //     return useMutation<Address, Error, Omit<Address, 'id'>>({
// // // //         mutationFn: (data) => addAddress(token!, data),
// // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // //     });
// // // // };

// // // // export const useUpdateAddress = () => {
// // // //     const queryClient = useQueryClient();
// // // //     const { token } = useAuthStore();
// // // //     return useMutation<Address, Error, Address>({
// // // //         mutationFn: (data) => updateAddress(token!, data),
// // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // //     });
// // // // };

// // // // export const useDeleteAddress = () => {
// // // //     const queryClient = useQueryClient();
// // // //     const { token } = useAuthStore();
// // // //     return useMutation<void, Error, string>({
// // // //         mutationFn: (id) => deleteAddress(token!, id),
// // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // //     });
// // // // };

// // // // export const usePaymentMethods = () => {
// // // //     const { token } = useAuthStore();
// // // //     return useQuery<PaymentMethod[], Error>({
// // // //         queryKey: ["paymentMethods", token],
// // // //         queryFn: () => getPaymentMethods(token!),
// // // //         enabled: !!token,
// // // //     });
// // // // };

// // // // export const useAddPaymentMethod = () => {
// // // //     const queryClient = useQueryClient();
// // // //     const { token } = useAuthStore();
// // // //     return useMutation<PaymentMethod, Error, Omit<PaymentMethod, 'id'>>({
// // // //         mutationFn: (data) => addPaymentMethod(token!, data),
// // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // //     });
// // // // };

// // // // export const useUpdatePaymentMethod = () => {
// // // //     const queryClient = useQueryClient();
// // // //     const { token } = useAuthStore();
// // // //     return useMutation<PaymentMethod, Error, PaymentMethod>({
// // // //         mutationFn: (data) => updatePaymentMethod(token!, data),
// // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // //     });
// // // // };

// // // // export const useDeletePaymentMethod = () => {
// // // //     const queryClient = useQueryClient();
// // // //     const { token } = useAuthStore();
// // // //     return useMutation<void, Error, string>({
// // // //         mutationFn: (id) => deletePaymentMethod(token!, id),
// // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // //     });
// // // // };


// // // // // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// // // // // import {
// // // // //     updateProfile, changePassword, getMyOrders,
// // // // //     getUserAddresses, addAddress, updateAddress, deleteAddress,
// // // // //     getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod
// // // // // } from '@/components/services/api';

// // // // // // Correctly import the User type from the same place as getProfile
// // // // // import { getProfile } from "@/components/services/auth-api";
// // // // // import { useAuthStore } from '@/components/store/authStore';
// // // // // import { User, Order, Address, PaymentMethod } from '@/components/services/api'; 
// // // // // import { useToast } from "@/hooks/use-toast";
// // // // // import { useEffect } from "react";

// // // // // // The corrected useUser hook
// // // // // export const useUser = () => {
// // // // //     const { token, logout } = useAuthStore();
// // // // //     const { toast } = useToast();

// // // // //     const queryResult = useQuery<User, Error>({
// // // // //         // The queryKey is an array that includes dependencies.
// // // // //         // When the `token` changes, the query will re-run.
// // // // //         queryKey: ["user", token],
// // // // //         queryFn: async () => {
// // // // //             if (!token) {
// // // // //                 // Return a rejected promise if there's no token
// // // // //                 return Promise.reject(new Error("Authentication token is missing."));
// // // // //             }
// // // // //             return getProfile(token);
// // // // //         },
// // // // //         // The query will not run until the `token` is present.
// // // // //         enabled: !!token,
// // // // //     });

// // // // //     useEffect(() => {
// // // // //         if (queryResult.isError) {
// // // // //             toast({
// // // // //                 title: "Authentication Error",
// // // // //                 description: "Your session has expired. Please log in again.",
// // // // //                 variant: "destructive"
// // // // //             });
// // // // //             logout();
// // // // //         }
// // // // //     }, [queryResult.isError, toast, logout]);

// // // // //     return queryResult;
// // // // // };

// // // // // // ... keep all other mutation hooks the same as they were.
// // // // // // This is the full, complete file for reference.

// // // // // export const useUpdateProfile = () => {
// // // // //     const queryClient = useQueryClient();
// // // // //     const { token } = useAuthStore();
// // // // //     return useMutation<User, Error, Partial<User>>({
// // // // //         mutationFn: (data) => updateProfile(token!, data),
// // // // //         onSuccess: (data) => queryClient.setQueryData(["user"], data),
// // // // //     });
// // // // // };

// // // // // export const useChangePassword = () => {
// // // // //     const { token } = useAuthStore();
// // // // //     return useMutation<{ message: string }, Error, { currentPassword: string; newPassword: string }>({
// // // // //         mutationFn: (data) => changePassword(token!, data),
// // // // //     });
// // // // // };

// // // // // export const useOrders = () => {
// // // // //     const { token } = useAuthStore();
// // // // //     return useQuery<Order[], Error>({
// // // // //         queryKey: ["orders", token],
// // // // //         queryFn: () => getMyOrders(token!),
// // // // //         enabled: !!token,
// // // // //     });
// // // // // };

// // // // // export const useAddresses = () => {
// // // // //     const { token } = useAuthStore();
// // // // //     return useQuery<Address[], Error>({
// // // // //         queryKey: ["addresses", token],
// // // // //         queryFn: () => getUserAddresses(token!),
// // // // //         enabled: !!token,
// // // // //     });
// // // // // };

// // // // // export const useAddAddress = () => {
// // // // //     const queryClient = useQueryClient();
// // // // //     const { token } = useAuthStore();
// // // // //     return useMutation<Address, Error, Omit<Address, 'id'>>({
// // // // //         mutationFn: (data) => addAddress(token!, data),
// // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // //     });
// // // // // };

// // // // // export const useUpdateAddress = () => {
// // // // //     const queryClient = useQueryClient();
// // // // //     const { token } = useAuthStore();
// // // // //     return useMutation<Address, Error, Address>({
// // // // //         mutationFn: (data) => updateAddress(token!, data),
// // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // //     });
// // // // // };

// // // // // export const useDeleteAddress = () => {
// // // // //     const queryClient = useQueryClient();
// // // // //     const { token } = useAuthStore();
// // // // //     return useMutation<void, Error, string>({
// // // // //         mutationFn: (id) => deleteAddress(token!, id),
// // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // //     });
// // // // // };

// // // // // export const usePaymentMethods = () => {
// // // // //     const { token } = useAuthStore();
// // // // //     return useQuery<PaymentMethod[], Error>({
// // // // //         queryKey: ["paymentMethods", token],
// // // // //         queryFn: () => getPaymentMethods(token!),
// // // // //         enabled: !!token,
// // // // //     });
// // // // // };

// // // // // export const useAddPaymentMethod = () => {
// // // // //     const queryClient = useQueryClient();
// // // // //     const { token } = useAuthStore();
// // // // //     return useMutation<PaymentMethod, Error, Omit<PaymentMethod, 'id'>>({
// // // // //         mutationFn: (data) => addPaymentMethod(token!, data),
// // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // //     });
// // // // // };

// // // // // export const useUpdatePaymentMethod = () => {
// // // // //     const queryClient = useQueryClient();
// // // // //     const { token } = useAuthStore();
// // // // //     return useMutation<PaymentMethod, Error, PaymentMethod>({
// // // // //         mutationFn: (data) => updatePaymentMethod(token!, data),
// // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // //     });
// // // // // };

// // // // // export const useDeletePaymentMethod = () => {
// // // // //     const queryClient = useQueryClient();
// // // // //     const { token } = useAuthStore();
// // // // //     return useMutation<void, Error, string>({
// // // // //         mutationFn: (id) => deletePaymentMethod(token!, id),
// // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // //     });
// // // // // };

// // // // // // // File: hooks/account.ts

// // // // // // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// // // // // // import {
// // // // // //     updateProfile, changePassword, getMyOrders,
// // // // // //     getUserAddresses, addAddress, updateAddress, deleteAddress,
// // // // // //     getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod
// // // // // // } from '@/components/services/api';

// // // // // // import { getProfile } from "@/components/services/auth-api";
// // // // // // import { useAuthStore } from '@/components/store/authStore';
// // // // // // import { User, Order, Address, PaymentMethod } from '@/components/services/api'; // Ensure correct import for types
// // // // // // import { useToast } from "@/hooks/use-toast";
// // // // // // import { useEffect } from "react";

// // // // // // // Corrected `useUser` hook
// // // // // // export const useUser = () => {
// // // // // //     const { token, logout } = useAuthStore();
// // // // // //     const { toast } = useToast();

// // // // // //     const queryResult = useQuery<User, Error>({
// // // // // //         queryKey: ["user", token],
// // // // // //         queryFn: async () => {
// // // // // //             if (!token) {
// // // // // //                 throw new Error("Authentication token is missing.");
// // // // // //             }
// // // // // //             return getProfile(token);
// // // // // //         },
// // // // // //         enabled: !!token,
// // // // // //     });

// // // // // //     useEffect(() => {
// // // // // //         if (queryResult.isError) {
// // // // // //             toast({
// // // // // //                 title: "Authentication Error",
// // // // // //                 description: "Your session has expired. Please log in again.",
// // // // // //                 variant: "destructive"
// // // // // //             });
// // // // // //             logout();
// // // // // //         }
// // // // // //     }, [queryResult.isError, toast, logout]);

// // // // // //     return queryResult;
// // // // // // };

// // // // // // // All mutation hooks need to be wrapped to pass the token correctly.
// // // // // // export const useUpdateProfile = () => {
// // // // // //     const queryClient = useQueryClient();
// // // // // //     const { token } = useAuthStore();
// // // // // //     return useMutation<User, Error, Partial<User>>({
// // // // // //         mutationFn: (data) => updateProfile(token!, data),
// // // // // //         onSuccess: (data) => queryClient.setQueryData(["user"], data),
// // // // // //     });
// // // // // // };

// // // // // // export const useChangePassword = () => {
// // // // // //     const { token } = useAuthStore();
// // // // // //     return useMutation<{ message: string }, Error, { currentPassword: string; newPassword: string }>({
// // // // // //         mutationFn: (data) => changePassword(token!, data),
// // // // // //     });
// // // // // // };

// // // // // // export const useOrders = () => {
// // // // // //     const { token } = useAuthStore();
// // // // // //     return useQuery<Order[], Error>({
// // // // // //         queryKey: ["orders", token],
// // // // // //         queryFn: () => getMyOrders(token!),
// // // // // //         enabled: !!token,
// // // // // //     });
// // // // // // };

// // // // // // export const useAddresses = () => {
// // // // // //     const { token } = useAuthStore();
// // // // // //     return useQuery<Address[], Error>({
// // // // // //         queryKey: ["addresses", token],
// // // // // //         queryFn: () => getUserAddresses(token!),
// // // // // //         enabled: !!token,
// // // // // //     });
// // // // // // };

// // // // // // export const useAddAddress = () => {
// // // // // //     const queryClient = useQueryClient();
// // // // // //     const { token } = useAuthStore();
// // // // // //     return useMutation<Address, Error, Omit<Address, 'id'>>({
// // // // // //         mutationFn: (data) => addAddress(token!, data),
// // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // // //     });
// // // // // // };

// // // // // // // This is the missing export. It should be here.
// // // // // // export const useUpdateAddress = () => {
// // // // // //     const queryClient = useQueryClient();
// // // // // //     const { token } = useAuthStore();
// // // // // //     return useMutation<Address, Error, Address>({
// // // // // //         mutationFn: (data) => updateAddress(token!, data),
// // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // // //     });
// // // // // // };

// // // // // // export const useDeleteAddress = () => {
// // // // // //     const queryClient = useQueryClient();
// // // // // //     const { token } = useAuthStore();
// // // // // //     return useMutation<void, Error, string>({
// // // // // //         mutationFn: (id) => deleteAddress(token!, id),
// // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // // //     });
// // // // // // };

// // // // // // export const usePaymentMethods = () => {
// // // // // //     const { token } = useAuthStore();
// // // // // //     return useQuery<PaymentMethod[], Error>({
// // // // // //         queryKey: ["paymentMethods", token],
// // // // // //         queryFn: () => getPaymentMethods(token!),
// // // // // //         enabled: !!token,
// // // // // //     });
// // // // // // };

// // // // // // export const useAddPaymentMethod = () => {
// // // // // //     const queryClient = useQueryClient();
// // // // // //     const { token } = useAuthStore();
// // // // // //     return useMutation<PaymentMethod, Error, Omit<PaymentMethod, 'id'>>({
// // // // // //         mutationFn: (data) => addPaymentMethod(token!, data),
// // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // // //     });
// // // // // // };

// // // // // // export const useUpdatePaymentMethod = () => {
// // // // // //     const queryClient = useQueryClient();
// // // // // //     const { token } = useAuthStore();
// // // // // //     return useMutation<PaymentMethod, Error, PaymentMethod>({
// // // // // //         mutationFn: (data) => updatePaymentMethod(token!, data),
// // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // // //     });
// // // // // // };

// // // // // // export const useDeletePaymentMethod = () => {
// // // // // //     const queryClient = useQueryClient();
// // // // // //     const { token } = useAuthStore();
// // // // // //     return useMutation<void, Error, string>({
// // // // // //         mutationFn: (id) => deletePaymentMethod(token!, id),
// // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // // //     });
// // // // // // };


// // // // // // // // File: hooks/useAuth.ts

// // // // // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // // // // import {
// // // // // // //     loginUser,
// // // // // // //     registerUser,
// // // // // // //     getProfile,
// // // // // // //     updateProfile,
// // // // // // //     changePassword,
// // // // // // //     verifyEmail,
// // // // // // //     forgotPassword,
// // // // // // //     resetPassword,
// // // // // // // } from '@/components/services/auth-api';
// // // // // // // import { useAuthStore } from '@/components/store/authStore';
// // // // // // // import {
// // // // // // //     LoginData,
// // // // // // //     LoginResponse,
// // // // // // //     RegisterData,
// // // // // // //     RegisterResponse,
// // // // // // //     UpdateProfileData,
// // // // // // //     VerifyEmailData,
// // // // // // //     VerifyEmailResponse,
// // // // // // //     ForgotPasswordData,
// // // // // // //     ForgotPasswordResponse,
// // // // // // //     ResetPasswordData,
// // // // // // //     ResetPasswordResponse,
// // // // // // //     User,
// // // // // // // } from '@/components/types/auth';

// // // // // // // /**
// // // // // // //  * Custom hook for user login.
// // // // // // //  */
// // // // // // // export const useLogin = () => {
// // // // // // //     const { login } = useAuthStore();
// // // // // // //     const queryClient = useQueryClient();

// // // // // // //     return useMutation<LoginResponse, Error, LoginData>({
// // // // // // //         mutationFn: loginUser,
// // // // // // //         onSuccess: (data) => {
// // // // // // //             login(data.token, data.user);
// // // // // // //             queryClient.setQueryData(['profile'], data.user);
// // // // // // //         },
// // // // // // //         onError: (error) => {
// // // // // // //             console.error('Login failed:', error.message);
// // // // // // //         },
// // // // // // //     });
// // // // // // // };

// // // // // // // /**
// // // // // // //  * Custom hook for user registration.
// // // // // // //  */
// // // // // // // export const useRegister = () => {
// // // // // // //     return useMutation<RegisterResponse, Error, RegisterData>({
// // // // // // //         mutationFn: registerUser,
// // // // // // //         onSuccess: (data) => {
// // // // // // //             console.log('Registration successful:', data.message);
// // // // // // //             console.log('Registered user:', data.user);
// // // // // // //         },
// // // // // // //         onError: (error) => {
// // // // // // //             console.error('Registration failed:', error.message);
// // // // // // //         },
// // // // // // //     });
// // // // // // // };

// // // // // // // /**
// // // // // // //  * Custom hook to get the authenticated user's profile.
// // // // // // //  */
// // // // // // // export const useProfile = () => {
// // // // // // //     const { token } = useAuthStore();
// // // // // // //     return useQuery<User, Error>({
// // // // // // //         queryKey: ['profile'],
// // // // // // //         queryFn: () => getProfile(token!),
// // // // // // //         enabled: !!token,
// // // // // // //     });
// // // // // // // };

// // // // // // // /**
// // // // // // //  * Custom hook to update the user's profile.
// // // // // // //  */
// // // // // // // export const useUpdateProfile = () => {
// // // // // // //     const queryClient = useQueryClient();
// // // // // // //     const { token } = useAuthStore();

// // // // // // //     return useMutation<User, Error, UpdateProfileData>({
// // // // // // //         mutationFn: (updateData) => updateProfile(token!, updateData),
// // // // // // //         onSuccess: (updatedUser) => {
// // // // // // //             queryClient.setQueryData(['profile'], updatedUser);
// // // // // // //             console.log('Profile updated successfully.');
// // // // // // //         },
// // // // // // //         onError: (error) => {
// // // // // // //             console.error('Failed to update profile:', error.message);
// // // // // // //         },
// // // // // // //     });
// // // // // // // };

// // // // // // // /**
// // // // // // //  * Custom hook to change the user's password.
// // // // // // //  */
// // // // // // // export const useChangePassword = () => {
// // // // // // //     const { token } = useAuthStore();

// // // // // // //     return useMutation<
// // // // // // //         { message: string },
// // // // // // //         Error,
// // // // // // //         { currentPassword: string; newPassword: string }
// // // // // // //     >({
// // // // // // //         mutationFn: (data) => changePassword(token!, data),
// // // // // // //         onSuccess: () => {
// // // // // // //             console.log('Password changed successfully.');
// // // // // // //         },
// // // // // // //         onError: (error) => {
// // // // // // //             console.error('Failed to change password:', error.message);
// // // // // // //         },
// // // // // // //     });
// // // // // // // };

// // // // // // // /**
// // // // // // //  * Custom hook to verify a user's email.
// // // // // // //  */
// // // // // // // export const useVerifyEmail = () => {
// // // // // // //     return useMutation<VerifyEmailResponse, Error, VerifyEmailData>({
// // // // // // //         mutationFn: verifyEmail,
// // // // // // //         onSuccess: (data) => {
// // // // // // //             console.log(data.message);
// // // // // // //         },
// // // // // // //         onError: (error) => {
// // // // // // //             console.error('Email verification failed:', error.message);
// // // // // // //         },
// // // // // // //     });
// // // // // // // };

// // // // // // // /**
// // // // // // //  * Custom hook for the forgot password process.
// // // // // // //  */
// // // // // // // export const useForgotPassword = () => {
// // // // // // //     return useMutation<ForgotPasswordResponse, Error, ForgotPasswordData>({
// // // // // // //         mutationFn: forgotPassword,
// // // // // // //         onSuccess: (data) => {
// // // // // // //             console.log(data.message);
// // // // // // //         },
// // // // // // //         onError: (error) => {
// // // // // // //             console.error('Forgot password request failed:', error.message);
// // // // // // //         },
// // // // // // //     });
// // // // // // // };

// // // // // // // /**
// // // // // // //  * Custom hook to reset the user's password.
// // // // // // //  */
// // // // // // // export const useResetPassword = () => {
// // // // // // //     return useMutation<ResetPasswordResponse, Error, ResetPasswordData>({
// // // // // // //         mutationFn: resetPassword,
// // // // // // //         onSuccess: (data) => {
// // // // // // //             console.log(data.message);
// // // // // // //         },
// // // // // // //         onError: (error) => {
// // // // // // //             console.error('Password reset failed:', error.message);
// // // // // // //         },
// // // // // // //     });
// // // // // // // };

// // // // // // // // // File: hooks/account.ts

// // // // // // // // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// // // // // // // // import {
// // // // // // // //     updateProfile, changePassword, getMyOrders,
// // // // // // // //     getUserAddresses, addAddress, updateAddress, deleteAddress,
// // // // // // // //     getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod
// // // // // // // // } from '@/components/services/api';

// // // // // // // // import { getProfile } from "@/components/services/auth-api";

// // // // // // // // import { useAuthStore } from '@/components/store/authStore';
// // // // // // // // import { User, Order, Address, PaymentMethod } from '@/components/services/api';
// // // // // // // // import { useToast } from "@/hooks/use-toast";
// // // // // // // // import { useEffect } from "react";

// // // // // // // // // Corrected `useUser` hook
// // // // // // // // export const useUser = () => {
// // // // // // // //     const { token, logout } = useAuthStore();
// // // // // // // //     const { toast } = useToast();

// // // // // // // //     const queryResult = useQuery<User>({
// // // // // // // //         // Pass the token in the queryKey. This makes the query dependent on the token.
// // // // // // // //         queryKey: ["user", token],
// // // // // // // //         queryFn: async ({ queryKey }) => {
// // // // // // // //             const [, token] = queryKey;
// // // // // // // //             if (!token) {
// // // // // // // //                 // Return an error or handle case where token is missing.
// // // // // // // //                 throw new Error("Authentication token is missing.");
// // // // // // // //             }
// // // // // // // //             return getProfile(token as string);
// // // // // // // //         },
// // // // // // // //         // The query will not run if the token is null or undefined.
// // // // // // // //         enabled: !!token,
// // // // // // // //     });

// // // // // // // //     // Use a useEffect hook to handle the side effect of an error
// // // // // // // //     useEffect(() => {
// // // // // // // //         if (queryResult.isError) {
// // // // // // // //             toast({
// // // // // // // //                 title: "Authentication Error",
// // // // // // // //                 description: "Your session has expired. Please log in again.",
// // // // // // // //                 variant: "destructive"
// // // // // // // //             });
// // // // // // // //             logout();
// // // // // // // //         }
// // // // // // // //     }, [queryResult.isError, toast, logout]);

// // // // // // // //     return queryResult;
// // // // // // // // };

// // // // // // // // // --- UseMutation hooks are correct, as the arguments are passed to mutateFn correctly. ---

// // // // // // // // export const useUpdateProfile = () => {
// // // // // // // //     const queryClient = useQueryClient();
// // // // // // // //     const { token } = useAuthStore();
// // // // // // // //     return useMutation({
// // // // // // // //         // mutationFn correctly receives a single argument, which is the data from the component
// // // // // // // //         mutationFn: (data: Partial<User>) => updateProfile(token!, data),
// // // // // // // //         onSuccess: (data) => queryClient.setQueryData(["user"], data as any),
// // // // // // // //     });
// // // // // // // // };

// // // // // // // // export const useChangePassword = () => {
// // // // // // // //     const { token } = useAuthStore();
// // // // // // // //     return useMutation({
// // // // // // // //         mutationFn: (data: { currentPassword: string; newPassword: string }) => changePassword(token!, data),
// // // // // // // //     });
// // // // // // // // };

// // // // // // // // export const useOrders = () => {
// // // // // // // //     const { token } = useAuthStore();
// // // // // // // //     return useQuery<Order[]>({
// // // // // // // //         queryKey: ["orders", token],
// // // // // // // //         queryFn: ({ queryKey }) => getMyOrders(queryKey[1] as string),
// // // // // // // //         enabled: !!token,
// // // // // // // //     });
// // // // // // // // };

// // // // // // // // export const useAddresses = () => {
// // // // // // // //     const { token } = useAuthStore();
// // // // // // // //     return useQuery<Address[]>({
// // // // // // // //         queryKey: ["addresses", token],
// // // // // // // //         queryFn: ({ queryKey }) => getUserAddresses(queryKey[1] as string),
// // // // // // // //         enabled: !!token,
// // // // // // // //     });
// // // // // // // // };

// // // // // // // // export const useAddAddress = () => {
// // // // // // // //     const queryClient = useQueryClient();
// // // // // // // //     const { token } = useAuthStore();
// // // // // // // //     return useMutation({
// // // // // // // //         mutationFn: (data: Omit<Address, 'id'>) => addAddress(token!, data),
// // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // // // // //     });
// // // // // // // // };

// // // // // // // // export const useUpdateAddress = () => {
// // // // // // // //     const queryClient = useQueryClient();
// // // // // // // //     const { token } = useAuthStore();
// // // // // // // //     return useMutation({
// // // // // // // //         mutationFn: (data: Address) => updateAddress(token!, data),
// // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // // // // //     });
// // // // // // // // };

// // // // // // // // export const useDeleteAddress = () => {
// // // // // // // //     const queryClient = useQueryClient();
// // // // // // // //     const { token } = useAuthStore();
// // // // // // // //     return useMutation({
// // // // // // // //         mutationFn: (id: string) => deleteAddress(token!, id),
// // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // // // // //     });
// // // // // // // // };

// // // // // // // // export const usePaymentMethods = () => {
// // // // // // // //     const { token } = useAuthStore();
// // // // // // // //     return useQuery<PaymentMethod[]>({
// // // // // // // //         queryKey: ["paymentMethods", token],
// // // // // // // //         queryFn: ({ queryKey }) => getPaymentMethods(queryKey[1] as string),
// // // // // // // //         enabled: !!token,
// // // // // // // //     });
// // // // // // // // };

// // // // // // // // export const useAddPaymentMethod = () => {
// // // // // // // //     const queryClient = useQueryClient();
// // // // // // // //     const { token } = useAuthStore();
// // // // // // // //     return useMutation({
// // // // // // // //         mutationFn: (data: Omit<PaymentMethod, 'id'>) => addPaymentMethod(token!, data),
// // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // // // // //     });
// // // // // // // // };

// // // // // // // // export const useUpdatePaymentMethod = () => {
// // // // // // // //     const queryClient = useQueryClient();
// // // // // // // //     const { token } = useAuthStore();
// // // // // // // //     return useMutation({
// // // // // // // //         mutationFn: (data: PaymentMethod) => updatePaymentMethod(token!, data),
// // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // // // // //     });
// // // // // // // // };

// // // // // // // // export const useDeletePaymentMethod = () => {
// // // // // // // //     const queryClient = useQueryClient();
// // // // // // // //     const { token } = useAuthStore();
// // // // // // // //     return useMutation({
// // // // // // // //         mutationFn: (id: string) => deletePaymentMethod(token!, id),
// // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // // // // //     });
// // // // // // // // };


// // // // // // // // // // File: hooks/account.ts

// // // // // // // // // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// // // // // // // // // import {
// // // // // // // // //     // getProfile,
// // // // // // // // //      updateProfile, changePassword, getMyOrders,
// // // // // // // // //     getUserAddresses, addAddress, updateAddress, deleteAddress,
// // // // // // // // //     getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod
// // // // // // // // // } from '@/components/services/api';

// // // // // // // // // import { getProfile } from "@/components/services/auth-api";

// // // // // // // // // import { useAuthStore } from '@/components/store/authStore';
// // // // // // // // // import { User, Order, Address, PaymentMethod } from '@/components/services/api';

// // // // // // // // // // Corrected `useUser` to only run the function without arguments
// // // // // // // // // export const useUser = () => {
// // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // //     return useQuery<User>({
// // // // // // // // //         queryKey: ["user"],
// // // // // // // // //         queryFn: getProfile, // No token argument here
// // // // // // // // //         enabled: !!token, // Still correctly depends on the token
// // // // // // // // //     });
// // // // // // // // // };

// // // // // // // // // // Corrected `useUpdateProfile` to only pass the data
// // // // // // // // // export const useUpdateProfile = () => {
// // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // //     return useMutation({
// // // // // // // // //         mutationFn: (data: Partial<User>) => updateProfile(data), // Removed token from the argument
// // // // // // // // //         onSuccess: (data) => queryClient.setQueryData(["user"], data as any),
// // // // // // // // //     });
// // // // // // // // // };

// // // // // // // // // // Corrected `useChangePassword` to only pass the data
// // // // // // // // // export const useChangePassword = () => {
// // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // //     return useMutation({
// // // // // // // // //         mutationFn: (data: { currentPassword: string; newPassword: string }) => changePassword(data), // Removed token from the argument
// // // // // // // // //     });
// // // // // // // // // };

// // // // // // // // // // Corrected `useOrders`
// // // // // // // // // export const useOrders = () => {
// // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // //     return useQuery<Order[]>({
// // // // // // // // //         queryKey: ["orders"],
// // // // // // // // //         queryFn: getMyOrders, // No token argument here
// // // // // // // // //         enabled: !!token,
// // // // // // // // //     });
// // // // // // // // // };

// // // // // // // // // // Corrected `useAddresses`
// // // // // // // // // export const useAddresses = () => {
// // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // //     return useQuery<Address[]>({
// // // // // // // // //         queryKey: ["addresses"],
// // // // // // // // //         queryFn: getUserAddresses, // No token argument here
// // // // // // // // //         enabled: !!token,
// // // // // // // // //     });
// // // // // // // // // };

// // // // // // // // // // Corrected `useAddAddress`
// // // // // // // // // export const useAddAddress = () => {
// // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // //     return useMutation({
// // // // // // // // //         mutationFn: (data: Omit<Address, 'id'>) => addAddress(data), // Only pass the data
// // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // // // // // //     });
// // // // // // // // // };

// // // // // // // // // // Corrected `useUpdateAddress`
// // // // // // // // // export const useUpdateAddress = () => {
// // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // //     return useMutation({
// // // // // // // // //         mutationFn: (data: Address) => updateAddress(data), // Only pass the data
// // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // // // // // //     });
// // // // // // // // // };

// // // // // // // // // // Corrected `useDeleteAddress`
// // // // // // // // // export const useDeleteAddress = () => {
// // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // //     return useMutation({
// // // // // // // // //         mutationFn: (id: string) => deleteAddress(id), // Only pass the id
// // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // // // // // //     });
// // // // // // // // // };

// // // // // // // // // // Corrected `usePaymentMethods`
// // // // // // // // // export const usePaymentMethods = () => {
// // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // //     return useQuery<PaymentMethod[]>({
// // // // // // // // //         queryKey: ["paymentMethods"],
// // // // // // // // //         queryFn: getPaymentMethods, // No token argument here
// // // // // // // // //         enabled: !!token,
// // // // // // // // //     });
// // // // // // // // // };

// // // // // // // // // // Corrected `useAddPaymentMethod`
// // // // // // // // // export const useAddPaymentMethod = () => {
// // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // //     return useMutation({
// // // // // // // // //         mutationFn: (data: Omit<PaymentMethod, 'id'>) => addPaymentMethod(data), // Only pass the data
// // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // // // // // //     });
// // // // // // // // // };

// // // // // // // // // // Corrected `useUpdatePaymentMethod`
// // // // // // // // // export const useUpdatePaymentMethod = () => {
// // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // //     return useMutation({
// // // // // // // // //         mutationFn: (data: PaymentMethod) => updatePaymentMethod(data), // Only pass the data
// // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // // // // // //     });
// // // // // // // // // };

// // // // // // // // // // Corrected `useDeletePaymentMethod`
// // // // // // // // // export const useDeletePaymentMethod = () => {
// // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // //     return useMutation({
// // // // // // // // //         mutationFn: (id: string) => deletePaymentMethod(id), // Only pass the id
// // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // // // // // //     });
// // // // // // // // // };

// // // // // // // // // // // File: hooks/account.ts

// // // // // // // // // // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// // // // // // // // // // import {
// // // // // // // // // //     getProfile, updateProfile, changePassword, getMyOrders,
// // // // // // // // // //     getUserAddresses, addAddress, updateAddress, deleteAddress,
// // // // // // // // // //     getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod
// // // // // // // // // // } from '@/components/services/api';

// // // // // // // // // // import { useAuthStore } from '@/components/store/authStore';
// // // // // // // // // // import { User, Order, Address, PaymentMethod } from '@/components/services/api';

// // // // // // // // // // // Corrected `useUser` to get the token and enable the query
// // // // // // // // // // export const useUser = () => {
// // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // //     return useQuery<User>({
// // // // // // // // // //         queryKey: ["user"],
// // // // // // // // // //         queryFn: () => getProfile(token!),
// // // // // // // // // //         enabled: !!token,
// // // // // // // // // //     });
// // // // // // // // // // };

// // // // // // // // // // // Corrected `useUpdateProfile` to pass both token and data
// // // // // // // // // // export const useUpdateProfile = () => {
// // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // //     return useMutation({
// // // // // // // // // //         mutationFn: (data: Partial<User>) => updateProfile(token!, data),
// // // // // // // // // //         onSuccess: (data) => queryClient.setQueryData(["user"], data as any),
// // // // // // // // // //     });
// // // // // // // // // // };

// // // // // // // // // // // Corrected `useChangePassword` to pass both token and data
// // // // // // // // // // export const useChangePassword = () => {
// // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // //     return useMutation({
// // // // // // // // // //         mutationFn: (data: { currentPassword: string; newPassword: string }) => changePassword(token!, data),
// // // // // // // // // //     });
// // // // // // // // // // };

// // // // // // // // // // // Corrected `useOrders` to get the token and enable the query
// // // // // // // // // // export const useOrders = () => {
// // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // //     return useQuery<Order[]>({
// // // // // // // // // //         queryKey: ["orders"],
// // // // // // // // // //         queryFn: () => getMyOrders(token!),
// // // // // // // // // //         enabled: !!token,
// // // // // // // // // //     });
// // // // // // // // // // };

// // // // // // // // // // // Corrected `useAddresses` to get the token and enable the query
// // // // // // // // // // export const useAddresses = () => {
// // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // //     return useQuery<Address[]>({
// // // // // // // // // //         queryKey: ["addresses"],
// // // // // // // // // //         queryFn: () => getUserAddresses(token!),
// // // // // // // // // //         enabled: !!token,
// // // // // // // // // //     });
// // // // // // // // // // };

// // // // // // // // // // // Corrected `useAddAddress` to pass both token and data
// // // // // // // // // // export const useAddAddress = () => {
// // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // //     return useMutation({
// // // // // // // // // //         mutationFn: (data: Omit<Address, 'id'>) => addAddress(token!, data),
// // // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // // // // // // //     });
// // // // // // // // // // };

// // // // // // // // // // // Corrected `useUpdateAddress` to pass both token and data
// // // // // // // // // // export const useUpdateAddress = () => {
// // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // //     return useMutation({
// // // // // // // // // //         mutationFn: (data: Address) => updateAddress(token!, data),
// // // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // // // // // // //     });
// // // // // // // // // // };

// // // // // // // // // // // Corrected `useDeleteAddress` to pass both token and id
// // // // // // // // // // export const useDeleteAddress = () => {
// // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // //     return useMutation({
// // // // // // // // // //         mutationFn: (id: string) => deleteAddress(token!, id),
// // // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // // // // // // //     });
// // // // // // // // // // };

// // // // // // // // // // // Corrected `usePaymentMethods` to get the token and enable the query
// // // // // // // // // // export const usePaymentMethods = () => {
// // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // //     return useQuery<PaymentMethod[]>({
// // // // // // // // // //         queryKey: ["paymentMethods"],
// // // // // // // // // //         queryFn: () => getPaymentMethods(token!),
// // // // // // // // // //         enabled: !!token,
// // // // // // // // // //     });
// // // // // // // // // // };

// // // // // // // // // // // Corrected `useAddPaymentMethod` to pass both token and data
// // // // // // // // // // export const useAddPaymentMethod = () => {
// // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // //     return useMutation({
// // // // // // // // // //         mutationFn: (data: Omit<PaymentMethod, 'id'>) => addPaymentMethod(token!, data),
// // // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // // // // // // //     });
// // // // // // // // // // };

// // // // // // // // // // // Corrected `useUpdatePaymentMethod` to pass both token and data
// // // // // // // // // // export const useUpdatePaymentMethod = () => {
// // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // //     return useMutation({
// // // // // // // // // //         mutationFn: (data: PaymentMethod) => updatePaymentMethod(token!, data),
// // // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // // // // // // //     });
// // // // // // // // // // };

// // // // // // // // // // // Corrected `useDeletePaymentMethod` to pass both token and id
// // // // // // // // // // export const useDeletePaymentMethod = () => {
// // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // //     return useMutation({
// // // // // // // // // //         mutationFn: (id: string) => deletePaymentMethod(token!, id),
// // // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // // // // // // //     });
// // // // // // // // // // };


// // // // // // // // // // // // File: hooks/account.ts

// // // // // // // // // // // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// // // // // // // // // // // import {
// // // // // // // // // // //     getProfile, updateProfile, changePassword, getMyOrders,
// // // // // // // // // // //     getUserAddresses, addAddress, updateAddress, deleteAddress,
// // // // // // // // // // //     getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod
// // // // // // // // // // // } from '@/components/services/api';

// // // // // // // // // // // import { useAuthStore } from '@/components/store/authStore';
// // // // // // // // // // // import { User, Order, Address, PaymentMethod } from '@/components/services/api';

// // // // // // // // // // // export const useUser = () => {
// // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // //     return useQuery<User>({
// // // // // // // // // // //         queryKey: ["user"],
// // // // // // // // // // //         queryFn: () => getProfile(token!),
// // // // // // // // // // //         enabled: !!token,
// // // // // // // // // // //     });
// // // // // // // // // // // };

// // // // // // // // // // // export const useUpdateProfile = () => {
// // // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // //     return useMutation({
// // // // // // // // // // //         mutationFn: (data: Partial<User>) => updateProfile(token!, data),
// // // // // // // // // // //         onSuccess: (data) => queryClient.setQueryData(["user"], data as any),
// // // // // // // // // // //     });
// // // // // // // // // // // };

// // // // // // // // // // // export const useChangePassword = () => {
// // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // //     return useMutation({
// // // // // // // // // // //         mutationFn: (data: { currentPassword: string; newPassword: string }) => changePassword(token!, data),
// // // // // // // // // // //     });
// // // // // // // // // // // };

// // // // // // // // // // // export const useOrders = () => {
// // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // //     return useQuery<Order[]>({
// // // // // // // // // // //         queryKey: ["orders"],
// // // // // // // // // // //         queryFn: () => getMyOrders(token!),
// // // // // // // // // // //         enabled: !!token,
// // // // // // // // // // //     });
// // // // // // // // // // // };

// // // // // // // // // // // export const useAddresses = () => {
// // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // //     return useQuery<Address[]>({
// // // // // // // // // // //         queryKey: ["addresses"],
// // // // // // // // // // //         queryFn: () => getUserAddresses(token!),
// // // // // // // // // // //         enabled: !!token,
// // // // // // // // // // //     });
// // // // // // // // // // // };
// // // // // // // // // // // export const useAddAddress = () => {
// // // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // //     return useMutation({
// // // // // // // // // // //         mutationFn: (data: Omit<Address, 'id'>) => addAddress(token!, data),
// // // // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // // // // // // // //     });
// // // // // // // // // // // };
// // // // // // // // // // // export const useUpdateAddress = () => {
// // // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // //     return useMutation({
// // // // // // // // // // //         mutationFn: (data: Address) => updateAddress(token!, data),
// // // // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // // // // // // // //     });
// // // // // // // // // // // };
// // // // // // // // // // // export const useDeleteAddress = () => {
// // // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // //     return useMutation({
// // // // // // // // // // //         mutationFn: (id: string) => deleteAddress(token!, id),
// // // // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // // // // // // // //     });
// // // // // // // // // // // };

// // // // // // // // // // // export const usePaymentMethods = () => {
// // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // //     return useQuery<PaymentMethod[]>({
// // // // // // // // // // //         queryKey: ["paymentMethods"],
// // // // // // // // // // //         queryFn: () => getPaymentMethods(token!),
// // // // // // // // // // //         enabled: !!token,
// // // // // // // // // // //     });
// // // // // // // // // // // };
// // // // // // // // // // // export const useAddPaymentMethod = () => {
// // // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // //     return useMutation({
// // // // // // // // // // //         mutationFn: (data: Omit<PaymentMethod, 'id'>) => addPaymentMethod(token!, data),
// // // // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // // // // // // // //     });
// // // // // // // // // // // };
// // // // // // // // // // // export const useUpdatePaymentMethod = () => {
// // // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // //     return useMutation({
// // // // // // // // // // //         mutationFn: (data: PaymentMethod) => updatePaymentMethod(token!, data),
// // // // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // // // // // // // //     });
// // // // // // // // // // // };
// // // // // // // // // // // export const useDeletePaymentMethod = () => {
// // // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // //     return useMutation({
// // // // // // // // // // //         mutationFn: (id: string) => deletePaymentMethod(token!, id),
// // // // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // // // // // // // //     });
// // // // // // // // // // // };


// // // // // // // // // // // // // File: hooks/account.ts

// // // // // // // // // // // // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// // // // // // // // // // // // import {
// // // // // // // // // // // //     getProfile, updateProfile, changePassword, getMyOrders,
// // // // // // // // // // // //     getUserAddresses, addAddress, updateAddress, deleteAddress,
// // // // // // // // // // // //     getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod
// // // // // // // // // // // // } from '@/components/services/api';

// // // // // // // // // // // // // Import the authentication store to get the user's token
// // // // // // // // // // // // import { useAuthStore } from '@/components/store/authStore';
// // // // // // // // // // // // import { User, Order, Address, PaymentMethod } from '@/components/services/api'; // Assuming these types are exported from your api file


// // // // // // // // // // // // // ⬅️ CORRECTED: Use the user's token to enable and run the query
// // // // // // // // // // // // export const useUser = () => {
// // // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // // //     return useQuery<User>({
// // // // // // // // // // // //         queryKey: ["user"],
// // // // // // // // // // // //         queryFn: () => getProfile(token!), // Pass the token to your API function
// // // // // // // // // // // //         enabled: !!token, // Only run this query if a token exists
// // // // // // // // // // // //     });
// // // // // // // // // // // // };

// // // // // // // // // // // // export const useUpdateProfile = () => {
// // // // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // // // //     const { token } = useAuthStore(); // Get the token for the mutation
// // // // // // // // // // // //     return useMutation({
// // // // // // // // // // // //         mutationFn: (data: Partial<User>) => updateProfile(token!, data),
// // // // // // // // // // // //         onSuccess: (data) => queryClient.setQueryData(["user"], data as any),
// // // // // // // // // // // //     });
// // // // // // // // // // // // };

// // // // // // // // // // // // export const useChangePassword = () => {
// // // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // // //     return useMutation({
// // // // // // // // // // // //         mutationFn: (data: { currentPassword: string, newPassword: string }) => changePassword(token!, data),
// // // // // // // // // // // //     });
// // // // // // // // // // // // };

// // // // // // // // // // // // export const useOrders = () => {
// // // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // // //     return useQuery<Order[]>({
// // // // // // // // // // // //         queryKey: ["orders"],
// // // // // // // // // // // //         queryFn: () => getMyOrders(token!),
// // // // // // // // // // // //         enabled: !!token,
// // // // // // // // // // // //     });
// // // // // // // // // // // // };

// // // // // // // // // // // // export const useAddresses = () => {
// // // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // // //     return useQuery<Address[]>({
// // // // // // // // // // // //         queryKey: ["addresses"],
// // // // // // // // // // // //         queryFn: () => getUserAddresses(token!),
// // // // // // // // // // // //         enabled: !!token,
// // // // // // // // // // // //     });
// // // // // // // // // // // // };
// // // // // // // // // // // // export const useAddAddress = () => {
// // // // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // // //     return useMutation({
// // // // // // // // // // // //         mutationFn: (data: Omit<Address, 'id'>) => addAddress(token!, data),
// // // // // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // // // // // // // // //     });
// // // // // // // // // // // // };
// // // // // // // // // // // // export const useUpdateAddress = () => {
// // // // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // // //     return useMutation({
// // // // // // // // // // // //         mutationFn: (data: Address) => updateAddress(token!, data),
// // // // // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // // // // // // // // //     });
// // // // // // // // // // // // };
// // // // // // // // // // // // export const useDeleteAddress = () => {
// // // // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // // //     return useMutation({
// // // // // // // // // // // //         mutationFn: (id: string) => deleteAddress(token!, id),
// // // // // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // // // // // // // // //     });
// // // // // // // // // // // // };

// // // // // // // // // // // // export const usePaymentMethods = () => {
// // // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // // //     return useQuery<PaymentMethod[]>({
// // // // // // // // // // // //         queryKey: ["paymentMethods"],
// // // // // // // // // // // //         queryFn: () => getPaymentMethods(token!),
// // // // // // // // // // // //         enabled: !!token,
// // // // // // // // // // // //     });
// // // // // // // // // // // // };
// // // // // // // // // // // // export const useAddPaymentMethod = () => {
// // // // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // // //     return useMutation({
// // // // // // // // // // // //         mutationFn: (data: Omit<PaymentMethod, 'id'>) => addPaymentMethod(token!, data),
// // // // // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // // // // // // // // //     });
// // // // // // // // // // // // };
// // // // // // // // // // // // export const useUpdatePaymentMethod = () => {
// // // // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // // //     return useMutation({
// // // // // // // // // // // //         mutationFn: (data: PaymentMethod) => updatePaymentMethod(token!, data),
// // // // // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // // // // // // // // //     });
// // // // // // // // // // // // };
// // // // // // // // // // // // export const useDeletePaymentMethod = () => {
// // // // // // // // // // // //     const queryClient = useQueryClient();
// // // // // // // // // // // //     const { token } = useAuthStore();
// // // // // // // // // // // //     return useMutation({
// // // // // // // // // // // //         mutationFn: (id: string) => deletePaymentMethod(token!, id),
// // // // // // // // // // // //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // // // // // // // // //     });
// // // // // // // // // // // // };

// // // // // // // // // // // // // // File: hooks/account.ts

// // // // // // // // // // // // // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// // // // // // // // // // // // // import {
// // // // // // // // // // // // //   getProfile, updateProfile, changePassword, getMyOrders,
// // // // // // // // // // // // //   getUserAddresses, addAddress, updateAddress, deleteAddress,
// // // // // // // // // // // // //   getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod
// // // // // // // // // // // // // } from '@/components/services/api';

// // // // // // // // // // // // // export const useUser = () => useQuery({ queryKey: ["user"], queryFn: getProfile });
// // // // // // // // // // // // // export const useUpdateProfile = () => {
// // // // // // // // // // // // //   const queryClient = useQueryClient();
// // // // // // // // // // // // //   return useMutation({
// // // // // // // // // // // // //     mutationFn: updateProfile,
// // // // // // // // // // // // //     onSuccess: (data) => queryClient.setQueryData(["user"], data as any),
// // // // // // // // // // // // //   });
// // // // // // // // // // // // // };

// // // // // // // // // // // // // export const useChangePassword = () => useMutation({ mutationFn: changePassword });

// // // // // // // // // // // // // export const useOrders = () => useQuery({ queryKey: ["orders"], queryFn: getMyOrders });

// // // // // // // // // // // // // export const useAddresses = () => useQuery({ queryKey: ["addresses"], queryFn: getUserAddresses });
// // // // // // // // // // // // // export const useAddAddress = () => {
// // // // // // // // // // // // //   const queryClient = useQueryClient();
// // // // // // // // // // // // //   return useMutation({
// // // // // // // // // // // // //     mutationFn: addAddress,
// // // // // // // // // // // // //     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // // // // // // // // // //   });
// // // // // // // // // // // // // };
// // // // // // // // // // // // // export const useUpdateAddress = () => {
// // // // // // // // // // // // //   const queryClient = useQueryClient();
// // // // // // // // // // // // //   return useMutation({
// // // // // // // // // // // // //     mutationFn: updateAddress,
// // // // // // // // // // // // //     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // // // // // // // // // //   });
// // // // // // // // // // // // // };
// // // // // // // // // // // // // export const useDeleteAddress = () => {
// // // // // // // // // // // // //   const queryClient = useQueryClient();
// // // // // // // // // // // // //   return useMutation({
// // // // // // // // // // // // //     mutationFn: deleteAddress,
// // // // // // // // // // // // //     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
// // // // // // // // // // // // //   });
// // // // // // // // // // // // // };

// // // // // // // // // // // // // export const usePaymentMethods = () => useQuery({ queryKey: ["paymentMethods"], queryFn: getPaymentMethods });
// // // // // // // // // // // // // export const useAddPaymentMethod = () => {
// // // // // // // // // // // // //   const queryClient = useQueryClient();
// // // // // // // // // // // // //   return useMutation({
// // // // // // // // // // // // //     mutationFn: addPaymentMethod,
// // // // // // // // // // // // //     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // // // // // // // // // //   });
// // // // // // // // // // // // // };
// // // // // // // // // // // // // export const useUpdatePaymentMethod = () => {
// // // // // // // // // // // // //   const queryClient = useQueryClient();
// // // // // // // // // // // // //   return useMutation({
// // // // // // // // // // // // //     mutationFn: updatePaymentMethod,
// // // // // // // // // // // // //     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // // // // // // // // // //   });
// // // // // // // // // // // // // };
// // // // // // // // // // // // // export const useDeletePaymentMethod = () => {
// // // // // // // // // // // // //   const queryClient = useQueryClient();
// // // // // // // // // // // // //   return useMutation({
// // // // // // // // // // // // //     mutationFn: deletePaymentMethod,
// // // // // // // // // // // // //     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["paymentMethods"] }),
// // // // // // // // // // // // //   });
// // // // // // // // // // // // // };