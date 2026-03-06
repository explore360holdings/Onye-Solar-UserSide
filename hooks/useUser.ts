import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getProfile,
    updateProfile,
    changePassword,
} from '@/components/services/auth-api';
import { useAuthStore } from '@/components/store/authStore';
import {
    UpdateProfileData,
    User,
} from '@/components/types/auth';
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from 'react';

export const useUserProfile = () => {
    const { token, logout } = useAuthStore();
    const { toast } = useToast();
    
    const queryResult = useQuery<User, Error>({
        queryKey: ['user-profile'],
        queryFn: async () => {
            if (!token) {
                // Return a non-promise or throw an error to halt the query
                throw new Error("Authentication token not found.");
            }
            return getProfile(token);
        },
        // The query is only enabled if the token exists
        enabled: !!token,
    });
    
    // Use a useEffect hook to handle the side effect of an error
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

/**
 * Custom hook to update the user's profile.
 *
 * It uses `useMutation` to handle the update action. On success, it
 * automatically updates the cached user profile data using `setQueryData`
 * to ensure the UI reflects the changes instantly without a re-fetch.
 */
export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();
    const { toast } = useToast();

    return useMutation<User, Error, UpdateProfileData>({
        mutationFn: (updates) => updateProfile(token!, updates),
        onSuccess: (updatedUser) => {
            // Update the user profile cache so the UI updates immediately
            queryClient.setQueryData(['user-profile'], updatedUser);
            toast({
                title: "Profile Updated",
                description: "Your profile has been successfully updated.",
            });
        },
        onError: (error) => {
            toast({
                title: "Update Failed",
                description: error.message || "Could not update profile. Please try again.",
                variant: "destructive"
            });
        },
    });
};

/**
 * Custom hook to change the user's password.
 *
 * This uses `useMutation` for the password change action.
 */
export const useChangePassword = () => {
    const { token } = useAuthStore();
    const { toast } = useToast();

    return useMutation<{ message: string }, Error, { currentPassword: string; newPassword: string }>({
        mutationFn: (data) => changePassword(token!, data),
        onSuccess: () => {
            toast({
                title: "Password Changed",
                description: "Your password has been successfully changed.",
            });
        },
        onError: (error) => {
            toast({
                title: "Password Change Failed",
                description: error.message || "Failed to change password. Please check your current password.",
                variant: "destructive"
            });
        },
    });
};

// // File: hooks/useUser.ts

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import {
//     getProfile,
//     updateProfile,
//     changePassword,
// } from '@/components/services/auth-api';
// import { useAuthStore } from '@/components/store/authStore';
// import {
//     UpdateProfileData,
//     User,
// } from '@/components/types/auth';
// import { useToast } from "@/components/ui/use-toast";

// /**
//  * Custom hook to get the authenticated user's profile.
//  *
//  * It uses `useQuery` to automatically fetch and cache the user's profile.
//  * The query is enabled only when a token is present, preventing unauthorized calls.
//  * If the API returns an error (e.g., 401 Unauthorized), it logs the user out.
//  */
// export const useUserProfile = () => {
//     const { token, logout } = useAuthStore();
//     const { toast } = useToast();
    
//     return useQuery<User, Error>({
//         queryKey: ['user-profile'],
//         queryFn: async () => {
//             // Your API function already requires the token
//             if (!token) {
//                 throw new Error("No token found. Please log in.");
//             }
//             return getProfile(token);
//         },
//         enabled: !!token,
//         onError: (error) => {
//             // Optional: You can handle specific errors here
//             toast({
//                 title: "Authentication Error",
//                 description: "Your session has expired. Please log in again.",
//                 variant: "destructive"
//             });
//             logout(); // Logs the user out if fetching the profile fails
//         },
//     });
// };

// /**
//  * Custom hook to update the user's profile.
//  *
//  * It uses `useMutation` to handle the update action. On success, it
//  * automatically updates the cached user profile data using `setQueryData`
//  * to ensure the UI reflects the changes instantly without a re-fetch.
//  */
// export const useUpdateUserProfile = () => {
//     const queryClient = useQueryClient();
//     const { token } = useAuthStore();
//     const { toast } = useToast();

//     return useMutation<User, Error, UpdateProfileData>({
//         mutationFn: (updates) => updateProfile(token!, updates),
//         onSuccess: (updatedUser) => {
//             // Update the user profile cache so the UI updates immediately
//             queryClient.setQueryData(['user-profile'], updatedUser);
//             toast({
//                 title: "Profile Updated",
//                 description: "Your profile has been successfully updated.",
//             });
//         },
//         onError: (error) => {
//             toast({
//                 title: "Update Failed",
//                 description: error.message || "Could not update profile. Please try again.",
//                 variant: "destructive"
//             });
//         },
//     });
// };

// /**
//  * Custom hook to change the user's password.
//  *
//  * This uses `useMutation` for the password change action.
//  */
// export const useChangePassword = () => {
//     const { token } = useAuthStore();
//     const { toast } = useToast();

//     return useMutation<{ message: string }, Error, { currentPassword: string; newPassword: string }>({
//         mutationFn: (data) => changePassword(token!, data),
//         onSuccess: () => {
//             toast({
//                 title: "Password Changed",
//                 description: "Your password has been successfully changed.",
//             });
//         },
//         onError: (error) => {
//             toast({
//                 title: "Password Change Failed",
//                 description: error.message || "Failed to change password. Please check your current password.",
//                 variant: "destructive"
//             });
//         },
//     });
// };

// // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // import {
// //     loginUser,
// //     registerUser,
// //     getProfile,
// //     updateProfile,
// //     changePassword,
// //     verifyEmail,
// //     forgotPassword,
// //     resetPassword,
// // } from '@/components/services/api';
// // import { useAuthStore } from '@/components/store/authStore';
// // import {
// //     LoginData,
// //     LoginResponse,
// //     RegisterData,
// //     RegisterResponse,
// //     UpdateProfileData,
// //     VerifyEmailData,
// //     ForgotPasswordData,
// //     ForgotPasswordResponse,
// //     ResetPasswordData,
// //     ResetPasswordResponse,
// //     User,
// // } from '@/components/types/auth';

// // // ... other hooks (useLogin, useRegister, etc.)

// // /**
// //  * Custom hook to get the authenticated user's profile.
// //  * FIX: Removed the onError property.
// //  */
// // export const useProfile = () => {
// //     const { token, logout } = useAuthStore();
// //     return useQuery<User, Error>({
// //         queryKey: ['profile'],
// //         queryFn: () => getProfile(token!),
// //         enabled: !!token,
// //         // The `onError` property has been removed. Handle errors in the component.
// //     });
// // };

// // // ... other hooks