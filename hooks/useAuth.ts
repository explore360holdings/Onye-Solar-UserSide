// File: /hooks/useAuth.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    loginUser, registerUser, getProfile, updateProfile, changePassword,
    verifyEmail, forgotPassword, resetPassword, resendVerificationEmail,
} from '@/components/services/api';
import { useAuthStore } from '@/components/store/authStore';
import {
    LoginData, LoginResponse, RegisterData, RegisterResponse, UpdateProfileData,
    VerifyEmailData, VerifyEmailResponse, ForgotPasswordData, ForgotPasswordResponse,
    ResetPasswordData, ResetPasswordResponse, User,
} from '@/components/types/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export const useLogin = () => {
    const { login } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation<LoginResponse, Error, LoginData>({
        mutationFn: loginUser,
        onSuccess: (data) => {
            // Cart items are preserved in localStorage for user convenience
            login(data.token, data.user);
            queryClient.setQueryData(['user', data.token], data.user);
        },
        onError: (error) => {
            console.error('Login failed:', error.message);
        },
    });
};

// --- THIS IS THE CORRECT LOGOUT HOOK ---
export const useLogout = () => {
    const { logout } = useAuthStore();
    const router = useRouter();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const logoutUser = () => {
        logout();        // 1. Clears the user's token from Zustand
        // Cart items are preserved in localStorage for user convenience
        queryClient.clear(); // 2. Clears all stale data from React Query cache
        toast({ title: "Logged out successfully." });
        router.push("/login"); // 3. Redirect to login page
    }
    
    // The hook returns an object with the logout function
    return { logout: logoutUser };
};

export const useRegister = () => {
    return useMutation<RegisterResponse, Error, RegisterData>({
        mutationFn: registerUser,
        onSuccess: (data) => {
            console.log('Registration successful:', data.message);
        },
        onError: (error) => {
            console.error('Registration failed:', error.message);
        },
    });
};

export const useProfile = () => {
    const { token } = useAuthStore();
    return useQuery<User, Error>({
        queryKey: ['profile'],
        queryFn: () => getProfile(token!),
        enabled: !!token,
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();
    return useMutation<User, Error, UpdateProfileData>({
        mutationFn: (updateData) => updateProfile(token!, updateData),
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(['user', token], updatedUser);
        },
        onError: (error) => {
            console.error('Failed to update profile:', error.message);
        },
    });
};

export const useChangePassword = () => {
    const { token } = useAuthStore();
    return useMutation<{ message: string }, Error, { currentPassword: string; newPassword: string }>({
        mutationFn: (data) => changePassword(token!, data),
        onSuccess: () => {
            console.log('Password changed successfully.');
        },
        onError: (error) => {
            console.error('Failed to change password:', error.message);
        },
    });
};

export const useVerifyEmail = () => {
    return useMutation<VerifyEmailResponse, Error, VerifyEmailData>({
        mutationFn: verifyEmail,
        onSuccess: (data) => {
            console.log(data.message);
        },
        onError: (error) => {
            console.error('Email verification failed:', error.message);
        },
    });
};

export const useResendVerificationEmail = () => {
    return useMutation<{ message: string }, Error, string>({
        mutationFn: resendVerificationEmail,
        onSuccess: (data) => {
            console.log('Resend verification email:', data.message);
        },
        onError: (error) => {
            console.error('Failed to resend verification email:', error.message);
        },
    });
};

export const useForgotPassword = () => {
    return useMutation<ForgotPasswordResponse, Error, ForgotPasswordData>({
        mutationFn: forgotPassword,
        onSuccess: (data) => {
            console.log(data.message);
        },
        onError: (error) => {
            console.error('Forgot password request failed:', error.message);
        },
    });
};

export const useResetPassword = () => {
    return useMutation<ResetPasswordResponse, Error, ResetPasswordData>({
        mutationFn: resetPassword,
        onSuccess: (data) => {
            console.log(data.message);
        },
        onError: (error) => {
            console.error('Password reset failed:', error.message);
        },
    });
};

// // File: /hooks/useAuth.ts

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import {
//     loginUser,
//     registerUser,
//     getProfile,
//     updateProfile,
//     changePassword,
//     verifyEmail,
//     forgotPassword,
//     resetPassword,
// } from '@/components/services/api';
// import { useAuthStore } from '@/components/store/authStore';
// import { useCart } from './useCart'; // <-- Import the useCart hook
// import { useToast } from '@/hooks/use-toast';
// import { useRouter } from 'next/navigation';
// import {
//     LoginData,
//     LoginResponse,
//     RegisterData,
//     RegisterResponse,
//     UpdateProfileData,
//     VerifyEmailData,
//     VerifyEmailResponse,
//     ForgotPasswordData,
//     ForgotPasswordResponse,
//     ResetPasswordData,
//     ResetPasswordResponse,
//     User,
// } from '@/components/types/auth';


// export const useLogin = () => {
//     const { login } = useAuthStore();
//     const queryClient = useQueryClient();
//     const { clearCart } = useCart(); // <-- Get clearCart function

//     return useMutation<LoginResponse, Error, LoginData>({
//         mutationFn: loginUser,
//         onSuccess: (data) => {
//             clearCart();
//             login(data.token, data.user);
//             // Invalidate queries to refetch user-specific data, like the user profile
//             queryClient.invalidateQueries({ queryKey: ['user'] });
//         },
//         onError: (error) => {
//             console.error('Login failed:', error.message);
//         },
//     });
// };

// /**
//  * --- FIX: Create a new dedicated hook for Logout ---
//  * This hook is responsible for ALL logout-related actions.
//  */
// export const useLogout = () => {
//     const { logout } = useAuthStore();
//     const { clearCart } = useCart(); // Get the clearCart function from your cart hook
//     const { toast } = useToast();
//     const router = useRouter();
//     const queryClient = useQueryClient();

//     const handleLogout = () => {
//         logout();      // Clears the user's token from Zustand
//         clearCart();   // Clears all items from the cart context

//         // This is a best practice: remove all cached data on logout
//         queryClient.clear();

//         toast({ title: "Logged out successfully." });
//         router.push("/"); // Redirect to the login page
//     };

//     return handleLogout;
// };

// export const useRegister = () => {
//     return useMutation<RegisterResponse, Error, RegisterData>({
//         mutationFn: registerUser,
//         onSuccess: (data) => {
//             console.log('Registration successful:', data.message);
//         },
//         onError: (error) => {
//             console.error('Registration failed:', error.message);
//         },
//     });
// };

// export const useProfile = () => {
//     const { token } = useAuthStore();
//     return useQuery<User, Error>({
//         queryKey: ['user', token],
//         queryFn: () => getProfile(token!),
//         enabled: !!token,
//     });
// };

// export const useUpdateProfile = () => {
//     const queryClient = useQueryClient();
//     const { token } = useAuthStore();
//     const { user } = useAuthStore.getState(); // Get user for query key consistency

//     return useMutation<User, Error, UpdateProfileData>({
//         mutationFn: (updateData) => updateProfile(token!, updateData),
//         onSuccess: (updatedUser) => {
//             queryClient.setQueryData(['user', token], updatedUser);
//             console.log('Profile updated successfully.');
//         },
//         onError: (error) => {
//             console.error('Failed to update profile:', error.message);
//         },
//     });
// };

// export const useChangePassword = () => {
//     const { token } = useAuthStore();

//     return useMutation<
//         { message: string },
//         Error,
//         { currentPassword: string; newPassword: string }
//     >({
//         mutationFn: (data) => changePassword(token!, data),
//         onSuccess: () => {
//             console.log('Password changed successfully.');
//         },
//         onError: (error) => {
//             console.error('Failed to change password:', error.message);
//         },
//     });
// };

// export const useVerifyEmail = () => {
//     return useMutation<VerifyEmailResponse, Error, VerifyEmailData>({
//         mutationFn: verifyEmail,
//         onSuccess: (data) => {
//             console.log(data.message);
//         },
//         onError: (error) => {
//             console.error('Email verification failed:', error.message);
//         },
//     });
// };

// export const useForgotPassword = () => {
//     return useMutation<ForgotPasswordResponse, Error, ForgotPasswordData>({
//         mutationFn: forgotPassword,
//         onSuccess: (data) => {
//             console.log(data.message);
//         },
//         onError: (error) => {
//             console.error('Forgot password request failed:', error.message);
//         },
//     });
// };

// export const useResetPassword = () => {
//     return useMutation<ResetPasswordResponse, Error, ResetPasswordData>({
//         mutationFn: resetPassword,
//         onSuccess: (data) => {
//             console.log(data.message);
//         },
//         onError: (error) => {
//             console.error('Password reset failed:', error.message);
//         },
//     });
// };

// // // File: /hooks/useAuth.ts

// // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // import {
// //     // FIX: Import ALL necessary functions from the single 'api.ts' file
// //     loginUser,
// //     registerUser,
// //     getProfile,
// //     updateProfile,
// //     changePassword,
// //     verifyEmail,
// //     forgotPassword,
// //     resetPassword,
// // } from '@/components/services/api'; // <-- Ensure this path is correct
// // import { useAuthStore } from '@/components/store/authStore';
// // import {
// //     LoginData,
// //     LoginResponse,
// //     RegisterData,
// //     RegisterResponse,
// //     UpdateProfileData,
// //     VerifyEmailData,
// //     VerifyEmailResponse,
// //     ForgotPasswordData,
// //     ForgotPasswordResponse,
// //     ResetPasswordData,
// //     ResetPasswordResponse,
// //     User,
// // } from '@/components/types/auth';

// // /**
// //  * Custom hook for user login.
// //  */
// // export const useLogin = () => {
// //     const { login } = useAuthStore();
// //     const queryClient = useQueryClient();

// //     return useMutation<LoginResponse, Error, LoginData>({
// //         mutationFn: loginUser,
// //         onSuccess: (data) => {
// //             login(data.token, data.user);
// //             queryClient.setQueryData(['profile'], data.user);
// //         },
// //         onError: (error) => {
// //             console.error('Login failed:', error.message);
// //         },
// //     });
// // };

// // /**
// //  * Custom hook for user registration.
// //  */
// // export const useRegister = () => {
// //     return useMutation<RegisterResponse, Error, RegisterData>({
// //         mutationFn: registerUser,
// //         onSuccess: (data) => {
// //             console.log('Registration successful:', data.message);
// //             console.log('Registered user:', data.user);
// //         },
// //         onError: (error) => {
// //             console.error('Registration failed:', error.message);
// //         },
// //     });
// // };

// // /**
// //  * Custom hook to get the authenticated user's profile.
// //  */
// // export const useProfile = () => {
// //     const { token } = useAuthStore();
// //     return useQuery<User, Error>({
// //         queryKey: ['profile'],
// //         queryFn: () => getProfile(token!),
// //         enabled: !!token,
// //     });
// // };

// // export const useUpdateProfile = () => {
// //     const queryClient = useQueryClient();
// //     const { token } = useAuthStore();

// //     return useMutation<User, Error, UpdateProfileData>({
// //         mutationFn: (updateData) => updateProfile(token!, updateData),
// //         onSuccess: (updatedUser) => {
// //             queryClient.setQueryData(['profile'], updatedUser);
// //             console.log('Profile updated successfully.');
// //         },
// //         onError: (error) => {
// //             console.error('Failed to update profile:', error.message);
// //         },
// //     });
// // };

// // export const useChangePassword = () => {
// //     const { token } = useAuthStore();

// //     return useMutation<
// //         { message: string },
// //         Error,
// //         { currentPassword: string; newPassword: string }
// //     >({
// //         mutationFn: (data) => changePassword(token!, data),
// //         onSuccess: () => {
// //             console.log('Password changed successfully.');
// //         },
// //         onError: (error) => {
// //             console.error('Failed to change password:', error.message);
// //         },
// //     });
// // };

// // export const useVerifyEmail = () => {
// //     return useMutation<VerifyEmailResponse, Error, VerifyEmailData>({
// //         mutationFn: verifyEmail,
// //         onSuccess: (data) => {
// //             console.log(data.message);
// //         },
// //         onError: (error) => {
// //             console.error('Email verification failed:', error.message);
// //         },
// //     });
// // };


// // export const useForgotPassword = () => {
// //     return useMutation<ForgotPasswordResponse, Error, ForgotPasswordData>({
// //         mutationFn: forgotPassword,
// //         onSuccess: (data) => {
// //             console.log(data.message);
// //         },
// //         onError: (error) => {
// //             console.error('Forgot password request failed:', error.message);
// //         },
// //     });
// // };


// // export const useResetPassword = () => {
// //     return useMutation<ResetPasswordResponse, Error, ResetPasswordData>({
// //         mutationFn: resetPassword,
// //         onSuccess: (data) => {
// //             console.log(data.message);
// //         },
// //         onError: (error) => {
// //             console.error('Password reset failed:', error.message);
// //         },
// //     });
// // };

// // // // File: hooks/useAuth.ts

// // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // import {
// // //     loginUser,
// // //     registerUser,
// // //     getProfile,
// // //     updateProfile,
// // //     changePassword,
// // //     // verifyEmail,
// // //     // forgotPassword,
// // //     // resetPassword,
// // // } from '@/components/services/api';
// // // import { useAuthStore } from '@/components/store/authStore';
// // // import {
// // //     LoginData,
// // //     LoginResponse,
// // //     RegisterData,
// // //     RegisterResponse,
// // //     UpdateProfileData,
// // //     VerifyEmailData,
// // //     VerifyEmailResponse,
// // //     ForgotPasswordData,
// // //     ForgotPasswordResponse,
// // //     ResetPasswordData,
// // //     ResetPasswordResponse,
// // //     User,
// // // } from '@/components/types/auth';

// // // /**
// // //  * Custom hook for user login.
// // //  */
// // // export const useLogin = () => {
// // //     const { login } = useAuthStore();
// // //     const queryClient = useQueryClient();

// // //     return useMutation<LoginResponse, Error, LoginData>({
// // //         mutationFn: loginUser,
// // //         onSuccess: (data) => {
// // //             login(data.token, data.user);
// // //             queryClient.setQueryData(['profile'], data.user);
// // //         },
// // //         onError: (error) => {
// // //             console.error('Login failed:', error.message);
// // //         },
// // //     });
// // // };

// // // /**
// // //  * Custom hook for user registration.
// // //  */
// // // export const useRegister = () => {
// // //     return useMutation<RegisterResponse, Error, RegisterData>({
// // //         mutationFn: registerUser,
// // //         onSuccess: (data) => {
// // //             console.log('Registration successful:', data.message);
// // //             console.log('Registered user:', data.user);
// // //         },
// // //         onError: (error) => {
// // //             console.error('Registration failed:', error.message);
// // //         },
// // //     });
// // // };

// // // /**
// // //  * Custom hook to get the authenticated user's profile.
// // //  */
// // // export const useProfile = () => {
// // //     const { token } = useAuthStore();
// // //     return useQuery<User, Error>({
// // //         queryKey: ['profile'],
// // //         queryFn: () => getProfile(token!),
// // //         enabled: !!token,
// // //     });
// // // };

// // // /**
// // //  * Custom hook to update the user's profile.
// // //  */
// // // export const useUpdateProfile = () => {
// // //     const queryClient = useQueryClient();
// // //     const { token } = useAuthStore();

// // //     return useMutation<User, Error, UpdateProfileData>({
// // //         mutationFn: (updateData) => updateProfile(token!, updateData),
// // //         onSuccess: (updatedUser) => {
// // //             queryClient.setQueryData(['profile'], updatedUser);
// // //             console.log('Profile updated successfully.');
// // //         },
// // //         onError: (error) => {
// // //             console.error('Failed to update profile:', error.message);
// // //         },
// // //     });
// // // };

// // // /**
// // //  * Custom hook to change the user's password.
// // //  */
// // // export const useChangePassword = () => {
// // //     const { token } = useAuthStore();

// // //     return useMutation<
// // //         { message: string },
// // //         Error,
// // //         { currentPassword: string; newPassword: string }
// // //     >({
// // //         mutationFn: (data) => changePassword(token!, data),
// // //         onSuccess: () => {
// // //             console.log('Password changed successfully.');
// // //         },
// // //         onError: (error) => {
// // //             console.error('Failed to change password:', error.message);
// // //         },
// // //     });
// // // };

// // // /**
// // //  * Custom hook to verify a user's email.
// // //  */
// // // // export const useVerifyEmail = () => {
// // // //     return useMutation<VerifyEmailResponse, Error, VerifyEmailData>({
// // // //         mutationFn: verifyEmail,
// // // //         onSuccess: (data) => {
// // // //             console.log(data.message);
// // // //         },
// // // //         onError: (error) => {
// // // //             console.error('Email verification failed:', error.message);
// // // //         },
// // // //     });
// // // // };

// // // /**
// // //  * Custom hook for the forgot password process.
// // //  */
// // // export const useForgotPassword = () => {
// // //     return useMutation<ForgotPasswordResponse, Error, ForgotPasswordData>({
// // //         mutationFn: forgotPassword,
// // //         onSuccess: (data) => {
// // //             console.log(data.message);
// // //         },
// // //         onError: (error) => {
// // //             console.error('Forgot password request failed:', error.message);
// // //         },
// // //     });
// // // };

// // // /**
// // //  * Custom hook to reset the user's password.
// // //  */
// // // export const useResetPassword = () => {
// // //     return useMutation<ResetPasswordResponse, Error, ResetPasswordData>({
// // //         mutationFn: resetPassword,
// // //         onSuccess: (data) => {
// // //             console.log(data.message);
// // //         },
// // //         onError: (error) => {
// // //             console.error('Password reset failed:', error.message);
// // //         },
// // //     });
// // // };

// // // // // File: hooks/useAuth.ts

// // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // import {
// // // //     loginUser,
// // // //     registerUser,
// // // //     getProfile,
// // // //     updateProfile,
// // // //     changePassword,
// // // //     verifyEmail,
// // // //     forgotPassword,
// // // //     resetPassword,
// // // // } from '@/components/services/auth-api';
// // // // import { useAuthStore } from '@/components/store/authStore';
// // // // import {
// // // //     LoginData,
// // // //     LoginResponse,
// // // //     RegisterData,
// // // //     RegisterResponse,
// // // //     UpdateProfileData,
// // // //     VerifyEmailData,
// // // //     VerifyEmailResponse,
// // // //     ForgotPasswordData,
// // // //     ForgotPasswordResponse,
// // // //     ResetPasswordData,
// // // //     ResetPasswordResponse,
// // // //     User,
// // // // } from '@/components/types/auth';

// // // // /**
// // // //  * Custom hook for user login.
// // // //  */
// // // // export const useLogin = () => { // ⬅️ Ensure this line has the 'export' keyword
// // // //     const { login } = useAuthStore();
// // // //     const queryClient = useQueryClient();

// // // //     return useMutation<LoginResponse, Error, LoginData>({
// // // //         mutationFn: loginUser,
// // // //         onSuccess: (data) => {
// // // //             login(data.token, data.user);
// // // //             queryClient.setQueryData(['profile'], data.user);
// // // //         },
// // // //         onError: (error) => {
// // // //             console.error('Login failed:', error.message);
// // // //         },
// // // //     });
// // // // };

// // // // /**
// // // //  * Custom hook for user registration.
// // // //  */
// // // // export const useRegister = () => {
// // // //     return useMutation<RegisterResponse, Error, RegisterData>({
// // // //         mutationFn: registerUser,
// // // //         onSuccess: (data) => {
// // // //             console.log('Registration successful:', data.message);
// // // //             console.log('Registered user:', data.user);
// // // //         },
// // // //         onError: (error) => {
// // // //             console.error('Registration failed:', error.message);
// // // //         },
// // // //     });
// // // // };

// // // // /**
// // // //  * Custom hook to get the authenticated user's profile.
// // // //  */
// // // // export const useProfile = () => {
// // // //     const { token } = useAuthStore();
// // // //     return useQuery<User, Error>({
// // // //         queryKey: ['profile'],
// // // //         queryFn: () => getProfile(token!),
// // // //         enabled: !!token,
// // // //     });
// // // // };

// // // // /**
// // // //  * Custom hook to update the user's profile.
// // // //  */
// // // // export const useUpdateProfile = () => {
// // // //     const queryClient = useQueryClient();
// // // //     const { token } = useAuthStore();

// // // //     return useMutation<User, Error, UpdateProfileData>({
// // // //         mutationFn: (updateData) => updateProfile(token!, updateData),
// // // //         onSuccess: (updatedUser) => {
// // // //             queryClient.setQueryData(['profile'], updatedUser);
// // // //             console.log('Profile updated successfully.');
// // // //         },
// // // //         onError: (error) => {
// // // //             console.error('Failed to update profile:', error.message);
// // // //         },
// // // //     });
// // // // };

// // // // /**
// // // //  * Custom hook to change the user's password.
// // // //  */
// // // // export const useChangePassword = () => {
// // // //     const { token } = useAuthStore();

// // // //     return useMutation<
// // // //         { message: string },
// // // //         Error,
// // // //         { currentPassword: string; newPassword: string }
// // // //     >({
// // // //         mutationFn: (data) => changePassword(token!, data),
// // // //         onSuccess: () => {
// // // //             console.log('Password changed successfully.');
// // // //         },
// // // //         onError: (error) => {
// // // //             console.error('Failed to change password:', error.message);
// // // //         },
// // // //     });
// // // // };

// // // // /**
// // // //  * Custom hook to verify a user's email.
// // // //  */
// // // // export const useVerifyEmail = () => {
// // // //     return useMutation<VerifyEmailResponse, Error, VerifyEmailData>({
// // // //         mutationFn: verifyEmail,
// // // //         onSuccess: (data) => {
// // // //             console.log(data.message);
// // // //         },
// // // //         onError: (error) => {
// // // //             console.error('Email verification failed:', error.message);
// // // //         },
// // // //     });
// // // // };

// // // // /**
// // // //  * Custom hook for the forgot password process.
// // // //  */
// // // // export const useForgotPassword = () => {
// // // //     return useMutation<ForgotPasswordResponse, Error, ForgotPasswordData>({
// // // //         mutationFn: forgotPassword,
// // // //         onSuccess: (data) => {
// // // //             console.log(data.message);
// // // //         },
// // // //         onError: (error) => {
// // // //             console.error('Forgot password request failed:', error.message);
// // // //         },
// // // //     });
// // // // };

// // // // /**
// // // //  * Custom hook to reset the user's password.
// // // //  */
// // // // export const useResetPassword = () => {
// // // //     return useMutation<ResetPasswordResponse, Error, ResetPasswordData>({
// // // //         mutationFn: resetPassword,
// // // //         onSuccess: (data) => {
// // // //             console.log(data.message);
// // // //         },
// // // //         onError: (error) => {
// // // //             console.error('Password reset failed:', error.message);
// // // //         },
// // // //     });
// // // // };

// // // // // // File: hooks/useAuth.ts

// // // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // // import {
// // // // //     loginUser,
// // // // //     registerUser,
// // // // //     getProfile,
// // // // //     updateProfile,
// // // // //     changePassword,
// // // // //     verifyEmail,
// // // // //     forgotPassword,
// // // // //     resetPassword,
// // // // // } from '@/components/services/auth-api';
// // // // // import { useAuthStore } from '@/components/store/authStore';
// // // // // import {
// // // // //     LoginData,
// // // // //     LoginResponse,
// // // // //     RegisterData,
// // // // //     RegisterResponse,
// // // // //     UpdateProfileData,
// // // // //     VerifyEmailData,
// // // // //     VerifyEmailResponse,
// // // // //     ForgotPasswordData,
// // // // //     ForgotPasswordResponse,
// // // // //     ResetPasswordData,
// // // // //     ResetPasswordResponse,
// // // // //     User,
// // // // // } from '@/components/types/auth';

// // // // // /**
// // // // //  * Custom hook for user login.
// // // // //  */
// // // // // export const useLogin = () => {
// // // // //     const { login } = useAuthStore();
// // // // //     const queryClient = useQueryClient();

// // // // //     return useMutation<LoginResponse, Error, LoginData>({
// // // // //         mutationFn: loginUser,
// // // // //         onSuccess: (data) => {
// // // // //             login(data.token, data.user);
// // // // //             queryClient.setQueryData(['profile'], data.user);
// // // // //         },
// // // // //         onError: (error) => {
// // // // //             console.error('Login failed:', error.message);
// // // // //         },
// // // // //     });
// // // // // };

// // // // // /**
// // // // //  * Custom hook for user registration.
// // // // //  */
// // // // // export const useRegister = () => {
// // // // //     return useMutation<RegisterResponse, Error, RegisterData>({
// // // // //         mutationFn: registerUser,
// // // // //         onSuccess: (data) => {
// // // // //             console.log('Registration successful:', data.message);
// // // // //             console.log('Registered user:', data.user);
// // // // //         },
// // // // //         onError: (error) => {
// // // // //             console.error('Registration failed:', error.message);
// // // // //         },
// // // // //     });
// // // // // };

// // // // // /**
// // // // //  * Custom hook to get the authenticated user's profile.
// // // // //  */
// // // // // export const useProfile = () => {
// // // // //     const { token } = useAuthStore();
// // // // //     return useQuery<User, Error>({
// // // // //         queryKey: ['profile'],
// // // // //         queryFn: () => getProfile(token!),
// // // // //         enabled: !!token,
// // // // //     });
// // // // // };

// // // // // /**
// // // // //  * Custom hook to update the user's profile.
// // // // //  */
// // // // // export const useUpdateProfile = () => {
// // // // //     const queryClient = useQueryClient();
// // // // //     const { token } = useAuthStore();

// // // // //     return useMutation<User, Error, UpdateProfileData>({
// // // // //         mutationFn: (updateData) => updateProfile(token!, updateData),
// // // // //         onSuccess: (updatedUser) => {
// // // // //             queryClient.setQueryData(['profile'], updatedUser);
// // // // //             console.log('Profile updated successfully.');
// // // // //         },
// // // // //         onError: (error) => {
// // // // //             console.error('Failed to update profile:', error.message);
// // // // //         },
// // // // //     });
// // // // // };

// // // // // /**
// // // // //  * Custom hook to change the user's password.
// // // // //  */
// // // // // export const useChangePassword = () => {
// // // // //     const { token } = useAuthStore();

// // // // //     return useMutation<
// // // // //         { message: string },
// // // // //         Error,
// // // // //         { currentPassword: string; newPassword: string }
// // // // //     >({
// // // // //         mutationFn: (data) => changePassword(token!, data),
// // // // //         onSuccess: () => {
// // // // //             console.log('Password changed successfully.');
// // // // //         },
// // // // //         onError: (error) => {
// // // // //             console.error('Failed to change password:', error.message);
// // // // //         },
// // // // //     });
// // // // // };

// // // // // /**
// // // // //  * Custom hook to verify a user's email.
// // // // //  */
// // // // // export const useVerifyEmail = () => {
// // // // //     return useMutation<VerifyEmailResponse, Error, VerifyEmailData>({
// // // // //         mutationFn: verifyEmail,
// // // // //         onSuccess: (data) => {
// // // // //             console.log(data.message);
// // // // //         },
// // // // //         onError: (error) => {
// // // // //             console.error('Email verification failed:', error.message);
// // // // //         },
// // // // //     });
// // // // // };

// // // // // /**
// // // // //  * Custom hook for the forgot password process.
// // // // //  */
// // // // // export const useForgotPassword = () => {
// // // // //     return useMutation<ForgotPasswordResponse, Error, ForgotPasswordData>({
// // // // //         mutationFn: forgotPassword,
// // // // //         onSuccess: (data) => {
// // // // //             console.log(data.message);
// // // // //         },
// // // // //         onError: (error) => {
// // // // //             console.error('Forgot password request failed:', error.message);
// // // // //         },
// // // // //     });
// // // // // };

// // // // // /**
// // // // //  * Custom hook to reset the user's password.
// // // // //  */
// // // // // export const useResetPassword = () => {
// // // // //     return useMutation<ResetPasswordResponse, Error, ResetPasswordData>({
// // // // //         mutationFn: resetPassword,
// // // // //         onSuccess: (data) => {
// // // // //             console.log(data.message);
// // // // //         },
// // // // //         onError: (error) => {
// // // // //             console.error('Password reset failed:', error.message);
// // // // //         },
// // // // //     });
// // // // // };

// // // // // // File: hooks/useAuth.ts

// // // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // // import {
// // // // //     loginUser,
// // // // //     registerUser,
// // // // //     getProfile,
// // // // //     updateProfile,
// // // // //     changePassword,
// // // // //     verifyEmail,
// // // // //     forgotPassword,
// // // // //     resetPassword,
// // // // // } from '@/components/services/auth-api';
// // // // // import { useAuthStore } from '@/components/store/authStore';
// // // // // import {
// // // // //     LoginData,
// // // // //     LoginResponse,
// // // // //     RegisterData,
// // // // //     RegisterResponse,
// // // // //     UpdateProfileData,
// // // // //     VerifyEmailData,
// // // // //     ForgotPasswordData,
// // // // //     ForgotPasswordResponse,
// // // // //     ResetPasswordData,
// // // // //     ResetPasswordResponse,
// // // // //     User, // Use the main User type now
// // // // // } from '@/components/types/auth';

// // // // // /**
// // // // //  * Custom hook for user login.
// // // // //  */
// // // // // export const useLogin = () => {
// // // // //     const { login } = useAuthStore();
// // // // //     const queryClient = useQueryClient();

// // // // //     return useMutation<LoginResponse, Error, LoginData>({
// // // // //         mutationFn: loginUser,
// // // // //         onSuccess: (data) => {
// // // // //             // Update the Zustand store and the TanStack Query cache
// // // // //             login(data.token, data.user);
// // // // //             queryClient.setQueryData(['profile'], data.user);
// // // // //         },
// // // // //         onError: (error) => {
// // // // //             console.error('Login failed:', error.message);
// // // // //         },
// // // // //     });
// // // // // };

// // // // // /**
// // // // //  * Custom hook for user registration.
// // // // //  */
// // // // // export const useRegister = () => {
// // // // //     return useMutation<RegisterResponse, Error, RegisterData>({
// // // // //         mutationFn: registerUser,
// // // // //         onSuccess: (data) => {
// // // // //             // Log the success message and the nested user object
// // // // //             console.log('Registration successful:', data.message);
// // // // //             console.log('Registered user:', data.user);
// // // // //         },
// // // // //         onError: (error) => {
// // // // //             console.error('Registration failed:', error.message);
// // // // //         },
// // // // //     });
// // // // // };

// // // // // /**
// // // // //  * Custom hook to get the authenticated user's profile.
// // // // //  * This now expects and receives a full User object with a 'role'
// // // // //  */
// // // // // export const useProfile = () => {
// // // // //     const { token } = useAuthStore();
// // // // //     return useQuery<User, Error>({ // ⬅️ Correctly uses the full User type
// // // // //         queryKey: ['profile'],
// // // // //         queryFn: () => getProfile(token!),
// // // // //         enabled: !!token,
// // // // //     });
// // // // // };

// // // // // /**
// // // // //  * Custom hook to update the user's profile.
// // // // //  */
// // // // // export const useUpdateProfile = () => {
// // // // //     const queryClient = useQueryClient();
// // // // //     const { token } = useAuthStore();

// // // // //     return useMutation<User, Error, UpdateProfileData>({
// // // // //         mutationFn: (updateData) => updateProfile(token!, updateData),
// // // // //         onSuccess: (updatedUser) => {
// // // // //             queryClient.setQueryData(['profile'], updatedUser);
// // // // //             console.log('Profile updated successfully.');
// // // // //         },
// // // // //         onError: (error) => {
// // // // //             console.error('Failed to update profile:', error.message);
// // // // //         },
// // // // //     });
// // // // // };

// // // // // /**
// // // // //  * Custom hook to change the user's password.
// // // // //  */
// // // // // export const useChangePassword = () => {
// // // // //     const { token } = useAuthStore();

// // // // //     return useMutation<
// // // // //         { message: string },
// // // // //         Error,
// // // // //         { currentPassword: string; newPassword: string }
// // // // //     >({
// // // // //         mutationFn: (data) => changePassword(token!, data),
// // // // //         onSuccess: () => {
// // // // //             console.log('Password changed successfully.');
// // // // //         },
// // // // //         onError: (error) => {
// // // // //             console.error('Failed to change password:', error.message);
// // // // //         },
// // // // //     });
// // // // // };

// // // // // /**
// // // // //  * Custom hook to verify a user's email.
// // // // //  */
// // // // // export const useVerifyEmail = () => {
// // // // //     return useMutation<VerifyEmailResponse, Error, VerifyEmailData>({
// // // // //         mutationFn: verifyEmail,
// // // // //         onSuccess: (data) => {
// // // // //             console.log(data.message);
// // // // //         },
// // // // //         onError: (error) => {
// // // // //             console.error('Email verification failed:', error.message);
// // // // //         },
// // // // //     });
// // // // // };

// // // // // /**
// // // // //  * Custom hook for the forgot password process.
// // // // //  */
// // // // // export const useForgotPassword = () => {
// // // // //     return useMutation<ForgotPasswordResponse, Error, ForgotPasswordData>({
// // // // //         mutationFn: forgotPassword,
// // // // //         onSuccess: (data) => {
// // // // //             console.log(data.message);
// // // // //         },
// // // // //         onError: (error) => {
// // // // //             console.error('Forgot password request failed:', error.message);
// // // // //         },
// // // // //     });
// // // // // };

// // // // // /**
// // // // //  * Custom hook to reset the user's password.
// // // // //  */
// // // // // export const useResetPassword = () => {
// // // // //     return useMutation<ResetPasswordResponse, Error, ResetPasswordData>({
// // // // //         mutationFn: resetPassword,
// // // // //         onSuccess: (data) => {
// // // // //             console.log(data.message);
// // // // //         },
// // // // //         onError: (error) => {
// // // // //             console.error('Password reset failed:', error.message);
// // // // //         },
// // // // //     });
// // // // // };

// // // // // // // File: hooks/useAuth.ts

// // // // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // // // import {
// // // // // //     loginUser,
// // // // // //     registerUser,
// // // // // //     getProfileAuth, // Use the new function from auth-api
// // // // // //     updateProfileAuth, // Use the new function from auth-api
// // // // // //     changePasswordAuth, // Use the new function from auth-api
// // // // // //     verifyEmail,
// // // // // //     forgotPassword,
// // // // // //     resetPassword,
// // // // // // } from '@/components/services/auth-api';
// // // // // // import { useAuthStore } from '@/components/store/authStore';
// // // // // // import {
// // // // // //     LoginData,
// // // // // //     LoginResponse,
// // // // // //     RegisterData,
// // // // // //     RegisterResponse,
// // // // // //     UpdateProfileData,
// // // // // //     VerifyEmailData,
// // // // // //     ForgotPasswordData,
// // // // // //     ForgotPasswordResponse,
// // // // // //     ResetPasswordData,
// // // // // //     ResetPasswordResponse,
// // // // // //     UserAuth, // Use the new UserAuth type
// // // // // // } from '@/components/services/auth-api';

// // // // // // // This is the correct way to handle token-dependent queries
// // // // // // const useToken = () => {
// // // // // //     const { token } = useAuthStore();
// // // // // //     if (!token) {
// // // // // //         throw new Error('Authentication token is not available.');
// // // // // //     }
// // // // // //     return token;
// // // // // // };

// // // // // // /**
// // // // // //  * Custom hook for user login.
// // // // // //  */
// // // // // // export const useLogin = () => {
// // // // // //     const { login } = useAuthStore();
// // // // // //     const queryClient = useQueryClient();

// // // // // //     return useMutation<LoginResponse, Error, LoginData>({
// // // // // //         mutationFn: loginUser,
// // // // // //         onSuccess: (data) => {
// // // // // //             // Update the Zustand store and the TanStack Query cache
// // // // // //             login(data.token, data.user);
// // // // // //             queryClient.setQueryData(['profile'], data.user);
// // // // // //         },
// // // // // //         onError: (error) => {
// // // // // //             console.error('Login failed:', error.message);
// // // // // //         },
// // // // // //     });
// // // // // // };

// // // // // // /**
// // // // // //  * Custom hook for user registration.
// // // // // //  */
// // // // // // export const useRegister = () => {
// // // // // //     return useMutation<RegisterResponse, Error, RegisterData>({
// // // // // //         mutationFn: registerUser,
// // // // // //         onSuccess: (data) => {
// // // // // //             console.log('Registration successful:', data.message);
// // // // // //         },
// // // // // //         onError: (error) => {
// // // // // //             console.error('Registration failed:', error.message);
// // // // // //         },
// // // // // //     });
// // // // // // };

// // // // // // /**
// // // // // //  * Custom hook to get the authenticated user's profile.
// // // // // //  * We remove the `onError` handler from here as it is not a valid option.
// // // // // //  */
// // // // // // export const useProfile = () => {
// // // // // //     const { token } = useAuthStore();
// // // // // //     return useQuery<UserAuth, Error>({
// // // // // //         queryKey: ['profile'],
// // // // // //         queryFn: () => getProfileAuth(token!), // Use the new function and handle token here
// // // // // //         enabled: !!token,
// // // // // //         // Error handling should now be done in the component using `isError` and `error`
// // // // // //     });
// // // // // // };

// // // // // // /**
// // // // // //  * Custom hook to update the user's profile.
// // // // // //  */
// // // // // // export const useUpdateProfile = () => {
// // // // // //     const queryClient = useQueryClient();
// // // // // //     const token = useToken(); // Use the custom token hook to ensure it exists

// // // // // //     return useMutation<UserAuth, Error, UpdateProfileData>({
// // // // // //         mutationFn: (updateData) => updateProfileAuth(token, updateData),
// // // // // //         onSuccess: (updatedUser) => {
// // // // // //             // Optimistically update the cache with the new user data
// // // // // //             queryClient.setQueryData(['profile'], updatedUser);
// // // // // //             // Alternatively, invalidate the query to force a refetch
// // // // // //             // queryClient.invalidateQueries({ queryKey: ['profile'] });
// // // // // //             console.log('Profile updated successfully.');
// // // // // //         },
// // // // // //         onError: (error) => {
// // // // // //             console.error('Failed to update profile:', error.message);
// // // // // //         },
// // // // // //     });
// // // // // // };

// // // // // // /**
// // // // // //  * Custom hook to change the user's password.
// // // // // //  */
// // // // // // export const useChangePassword = () => {
// // // // // //     const token = useToken();

// // // // // //     return useMutation<
// // // // // //         { message: string },
// // // // // //         Error,
// // // // // //         { currentPassword: string; newPassword: string }
// // // // // //     >({
// // // // // //         mutationFn: (data) => changePasswordAuth(token, data),
// // // // // //         onSuccess: () => {
// // // // // //             console.log('Password changed successfully.');
// // // // // //         },
// // // // // //         onError: (error) => {
// // // // // //             console.error('Failed to change password:', error.message);
// // // // // //         },
// // // // // //     });
// // // // // // };

// // // // // // /**
// // // // // //  * Custom hook to verify a user's email.
// // // // // //  */
// // // // // // export const useVerifyEmail = () => {
// // // // // //     return useMutation<any, Error, VerifyEmailData>({
// // // // // //         mutationFn: verifyEmail,
// // // // // //         onSuccess: (data) => {
// // // // // //             console.log(data.message);
// // // // // //         },
// // // // // //         onError: (error) => {
// // // // // //             console.error('Email verification failed:', error.message);
// // // // // //         },
// // // // // //     });
// // // // // // };

// // // // // // /**
// // // // // //  * Custom hook for the forgot password process.
// // // // // //  */
// // // // // // export const useForgotPassword = () => {
// // // // // //     return useMutation<ForgotPasswordResponse, Error, ForgotPasswordData>({
// // // // // //         mutationFn: forgotPassword,
// // // // // //         onSuccess: (data) => {
// // // // // //             console.log(data.message);
// // // // // //         },
// // // // // //         onError: (error) => {
// // // // // //             console.error('Forgot password request failed:', error.message);
// // // // // //         },
// // // // // //     });
// // // // // // };

// // // // // // /**
// // // // // //  * Custom hook to reset the user's password.
// // // // // //  */
// // // // // // export const useResetPassword = () => {
// // // // // //     return useMutation<ResetPasswordResponse, Error, ResetPasswordData>({
// // // // // //         mutationFn: resetPassword,
// // // // // //         onSuccess: (data) => {
// // // // // //             console.log(data.message);
// // // // // //         },
// // // // // //         onError: (error) => {
// // // // // //             console.error('Password reset failed:', error.message);
// // // // // //         },
// // // // // //     });
// // // // // // };

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
// // // // // // // } from '@/components/services/api';
// // // // // // // import { useAuthStore } from '@/components/store/authStore';
// // // // // // // import {
// // // // // // //     LoginData,
// // // // // // //     LoginResponse,
// // // // // // //     RegisterData,
// // // // // // //     RegisterResponse,
// // // // // // //     UpdateProfileData,
// // // // // // //     VerifyEmailData,
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
// // // // // // //             login(data.token, data as unknown as User);
// // // // // // //             queryClient.setQueryData(['profile'], data);
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
// // // // // // //         },
// // // // // // //         onError: (error) => {
// // // // // // //             console.error('Registration failed:', error.message);
// // // // // // //         },
// // // // // // //     });
// // // // // // // };

// // // // // // // /**
// // // // // // //  * Custom hook to get the authenticated user's profile.
// // // // // // //  * FIX: `onError` is not a valid option for `useQuery`.
// // // // // // //  * Error handling is done in the component using the returned `isError` and `error` properties.
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
// // // // // // //         onSuccess: () => {
// // // // // // //             queryClient.invalidateQueries({ queryKey: ['profile'] });
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
// // // // // // //     return useMutation<any, Error, VerifyEmailData>({
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
// // // // // // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // // // // // import {
// // // // // // // //   loginUser,
// // // // // // // //   registerUser,
// // // // // // // //   getProfile,
// // // // // // // //   updateProfile,
// // // // // // // //   changePassword,
// // // // // // // //   verifyEmail,
// // // // // // // //   forgotPassword,
// // // // // // // //   resetPassword,
// // // // // // // // } from '@/components/services/authServices';
// // // // // // // // import { useAuthStore } from '@/components/store/authStore';
// // // // // // // // import {
// // // // // // // //   LoginData,
// // // // // // // //   LoginResponse,
// // // // // // // //   RegisterData,
// // // // // // // //   RegisterResponse,
// // // // // // // //   UpdateProfileData,
// // // // // // // //   VerifyEmailData,
// // // // // // // //   ForgotPasswordData,
// // // // // // // //   ForgotPasswordResponse,
// // // // // // // //   ResetPasswordData,
// // // // // // // //   ResetPasswordResponse,
// // // // // // // //   User,
// // // // // // // // } from '@/components/types/auth';

// // // // // // // // /**
// // // // // // // //  * Custom hook for user login.
// // // // // // // //  * Fix: Changed the generic type from `User` to `LoginResponse` to match the service function's return type.
// // // // // // // //  */
// // // // // // // // export const useLogin = () => {
// // // // // // // //   const { login } = useAuthStore();
// // // // // // // //   const queryClient = useQueryClient();

// // // // // // // //   return useMutation<LoginResponse, Error, LoginData>({
// // // // // // // //     mutationFn: loginUser,
// // // // // // // //     onSuccess: (data) => {
// // // // // // // //       login(data.token, data as unknown as User);
// // // // // // // //       queryClient.setQueryData(['profile'], data);
// // // // // // // //     },
// // // // // // // //     onError: (error) => {
// // // // // // // //       console.error('Login failed:', error.message);
// // // // // // // //     },
// // // // // // // //   });
// // // // // // // // };

// // // // // // // // /**
// // // // // // // //  * Custom hook for user registration.
// // // // // // // //  * Fix: Changed the generic type from `User` to `RegisterResponse` to match the service function's return type.
// // // // // // // //  */
// // // // // // // // export const useRegister = () => {
// // // // // // // //   return useMutation<RegisterResponse, Error, RegisterData>({
// // // // // // // //     mutationFn: registerUser,
// // // // // // // //     onSuccess: (data) => {
// // // // // // // //       console.log('Registration successful:', data.message);
// // // // // // // //     },
// // // // // // // //     onError: (error) => {
// // // // // // // //       console.error('Registration failed:', error.message);
// // // // // // // //     },
// // // // // // // //   });
// // // // // // // // };

// // // // // // // // /**
// // // // // // // //  * Custom hook to get the authenticated user's profile.
// // // // // // // //  * Uses useQuery to fetch the profile, which is cached by TanStack Query.
// // // // // // // //  * The query is only enabled when a token exists in the Zustand store.
// // // // // // // //  */
// // // // // // // // export const useProfile = () => {
// // // // // // // //   const { token, logout } = useAuthStore();
// // // // // // // //   return useQuery<User, Error>({
// // // // // // // //     queryKey: ['profile'],
// // // // // // // //     queryFn: () => getProfile(token!),
// // // // // // // //     enabled: !!token,
// // // // // // // //     onError: (error) => {
// // // // // // // //       console.error('Failed to fetch profile:', error.message);
// // // // // // // //       logout();
// // // // // // // //     },
// // // // // // // //   });
// // // // // // // // };

// // // // // // // // /**
// // // // // // // //  * Custom hook to update the user's profile.
// // // // // // // //  * Uses useMutation to handle the PUT request.
// // // // // // // //  * On success, it invalidates the 'profile' query to refetch the latest data.
// // // // // // // //  */
// // // // // // // // export const useUpdateProfile = () => {
// // // // // // // //   const queryClient = useQueryClient();
// // // // // // // //   const { token } = useAuthStore();

// // // // // // // //   return useMutation<User, Error, UpdateProfileData>({
// // // // // // // //     mutationFn: (updateData) => updateProfile(token!, updateData),
// // // // // // // //     onSuccess: () => {
// // // // // // // //       queryClient.invalidateQueries({ queryKey: ['profile'] });
// // // // // // // //       console.log('Profile updated successfully.');
// // // // // // // //     },
// // // // // // // //     onError: (error) => {
// // // // // // // //       console.error('Failed to update profile:', error.message);
// // // // // // // //     },
// // // // // // // //   });
// // // // // // // // };

// // // // // // // // /**
// // // // // // // //  * Custom hook to change the user's password.
// // // // // // // //  * Uses useMutation for the POST request.
// // // // // // // //  */
// // // // // // // // export const useChangePassword = () => {
// // // // // // // //   const { token } = useAuthStore();

// // // // // // // //   return useMutation<
// // // // // // // //     { message: string },
// // // // // // // //     Error,
// // // // // // // //     { currentPassword: string; newPassword: string }
// // // // // // // //   >({
// // // // // // // //     mutationFn: (data) => changePassword(token!, data),
// // // // // // // //     onSuccess: () => {
// // // // // // // //       console.log('Password changed successfully.');
// // // // // // // //     },
// // // // // // // //     onError: (error) => {
// // // // // // // //       console.error('Failed to change password:', error.message);
// // // // // // // //     },
// // // // // // // //   });
// // // // // // // // };

// // // // // // // // /**
// // // // // // // //  * Custom hook to verify a user's email.
// // // // // // // //  * Uses useMutation to handle the POST request.
// // // // // // // //  */
// // // // // // // // export const useVerifyEmail = () => {
// // // // // // // //   return useMutation<any, Error, VerifyEmailData>({
// // // // // // // //     mutationFn: verifyEmail,
// // // // // // // //     onSuccess: (data) => {
// // // // // // // //       console.log(data.message);
// // // // // // // //     },
// // // // // // // //     onError: (error) => {
// // // // // // // //       console.error('Email verification failed:', error.message);
// // // // // // // //     },
// // // // // // // //   });
// // // // // // // // };

// // // // // // // // /**
// // // // // // // //  * Custom hook for the forgot password process.
// // // // // // // //  * Fix: Changed the generic type from `any` to `ForgotPasswordResponse` for type safety.
// // // // // // // //  */
// // // // // // // // export const useForgotPassword = () => {
// // // // // // // //   return useMutation<ForgotPasswordResponse, Error, ForgotPasswordData>({
// // // // // // // //     mutationFn: forgotPassword,
// // // // // // // //     onSuccess: (data) => {
// // // // // // // //       console.log(data.message);
// // // // // // // //     },
// // // // // // // //     onError: (error) => {
// // // // // // // //       console.error('Forgot password request failed:', error.message);
// // // // // // // //     },
// // // // // // // //   });
// // // // // // // // };

// // // // // // // // /**
// // // // // // // //  * Custom hook to reset the user's password.
// // // // // // // //  * Fix: Changed the generic type from `any` to `ResetPasswordResponse` for type safety.
// // // // // // // //  */
// // // // // // // // export const useResetPassword = () => {
// // // // // // // //   return useMutation<ResetPasswordResponse, Error, ResetPasswordData>({
// // // // // // // //     mutationFn: resetPassword,
// // // // // // // //     onSuccess: (data) => {
// // // // // // // //       console.log(data.message);
// // // // // // // //     },
// // // // // // // //     onError: (error) => {
// // // // // // // //       console.error('Password reset failed:', error.message);
// // // // // // // //     },
// // // // // // // //   });
// // // // // // // // };

// // // // // // // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // // // // // // import {
// // // // // // // // //   loginUser,
// // // // // // // // //   registerUser,
// // // // // // // // //   getProfile,
// // // // // // // // //   updateProfile,
// // // // // // // // //   changePassword,
// // // // // // // // //   verifyEmail,
// // // // // // // // //   forgotPassword,
// // // // // // // // //   resetPassword,
// // // // // // // // // } from '@/components/services/authServices';
// // // // // // // // // import { useAuthStore } from '@/components/store/authStore';
// // // // // // // // // import {
// // // // // // // // //   LoginData,
// // // // // // // // //   LoginResponse, // ⬅️ Added LoginResponse
// // // // // // // // //   RegisterData,
// // // // // // // // //   RegisterResponse, // ⬅️ Added RegisterResponse
// // // // // // // // //   UpdateProfileData,
// // // // // // // // //   VerifyEmailData,
// // // // // // // // //   ForgotPasswordData,
// // // // // // // // //   ForgotPasswordResponse, // ⬅️ Added ForgotPasswordResponse
// // // // // // // // //   ResetPasswordData,
// // // // // // // // //   ResetPasswordResponse, // ⬅️ Added ResetPasswordResponse
// // // // // // // // //   User,
// // // // // // // // // } from '@/components/types/auth';

// // // // // // // // // /**
// // // // // // // // //  * Custom hook for user login.
// // // // // // // // //  * Fix: Changed the generic type from `User` to `LoginResponse`.
// // // // // // // // //  */
// // // // // // // // // export const useLogin = () => {
// // // // // // // // //   const { login } = useAuthStore();
// // // // // // // // //   const queryClient = useQueryClient();

// // // // // // // // //   return useMutation<LoginResponse, Error, LoginData>({
// // // // // // // // //     mutationFn: loginUser,
// // // // // // // // //     onSuccess: (data) => {
// // // // // // // // //       login(data.token as string, data as unknown as User); // ⬅️ Casted data to User
// // // // // // // // //       queryClient.setQueryData(['profile'], data);
// // // // // // // // //     },
// // // // // // // // //     onError: (error) => {
// // // // // // // // //       console.error('Login failed:', error.message);
// // // // // // // // //     },
// // // // // // // // //   });
// // // // // // // // // };

// // // // // // // // // /**
// // // // // // // // //  * Custom hook for user registration.
// // // // // // // // //  * Fix: Changed the generic type from `User` to `RegisterResponse`.
// // // // // // // // //  */
// // // // // // // // // export const useRegister = () => {
// // // // // // // // //   return useMutation<RegisterResponse, Error, RegisterData>({
// // // // // // // // //     mutationFn: registerUser,
// // // // // // // // //     onSuccess: (data) => {
// // // // // // // // //       console.log('Registration successful:', data.message);
// // // // // // // // //     },
// // // // // // // // //     onError: (error) => {
// // // // // // // // //       console.error('Registration failed:', error.message);
// // // // // // // // //     },
// // // // // // // // //   });
// // // // // // // // // };

// // // // // // // // // /**
// // // // // // // // //  * Custom hook to get the authenticated user's profile.
// // // // // // // // //  * No changes needed here.
// // // // // // // // //  */
// // // // // // // // // export const useProfile = () => {
// // // // // // // // //   const { token, logout } = useAuthStore();
// // // // // // // // //   return useQuery<User, Error>({
// // // // // // // // //     queryKey: ['profile'],
// // // // // // // // //     queryFn: () => getProfile(token!),
// // // // // // // // //     enabled: !!token,
// // // // // // // // //     onError: (error) => {
// // // // // // // // //       console.error('Failed to fetch profile:', error.message);
// // // // // // // // //       logout();
// // // // // // // // //     },
// // // // // // // // //   });
// // // // // // // // // };

// // // // // // // // // /**
// // // // // // // // //  * Custom hook to update the user's profile.
// // // // // // // // //  * No changes needed here.
// // // // // // // // //  */
// // // // // // // // // export const useUpdateProfile = () => {
// // // // // // // // //   const queryClient = useQueryClient();
// // // // // // // // //   const { token } = useAuthStore();

// // // // // // // // //   return useMutation<User, Error, UpdateProfileData>({
// // // // // // // // //     mutationFn: (updateData) => updateProfile(token!, updateData),
// // // // // // // // //     onSuccess: () => {
// // // // // // // // //       queryClient.invalidateQueries({ queryKey: ['profile'] });
// // // // // // // // //       console.log('Profile updated successfully.');
// // // // // // // // //     },
// // // // // // // // //     onError: (error) => {
// // // // // // // // //       console.error('Failed to update profile:', error.message);
// // // // // // // // //     },
// // // // // // // // //   });
// // // // // // // // // };

// // // // // // // // // /**
// // // // // // // // //  * Custom hook to change the user's password.
// // // // // // // // //  * No changes needed here.
// // // // // // // // //  */
// // // // // // // // // export const useChangePassword = () => {
// // // // // // // // //   const { token } = useAuthStore();

// // // // // // // // //   return useMutation<
// // // // // // // // //     { message: string },
// // // // // // // // //     Error,
// // // // // // // // //     { currentPassword: string; newPassword: string }
// // // // // // // // //   >({
// // // // // // // // //     mutationFn: (data) => changePassword(token!, data),
// // // // // // // // //     onSuccess: () => {
// // // // // // // // //       console.log('Password changed successfully.');
// // // // // // // // //     },
// // // // // // // // //     onError: (error) => {
// // // // // // // // //       console.error('Failed to change password:', error.message);
// // // // // // // // //     },
// // // // // // // // //   });
// // // // // // // // // };

// // // // // // // // // /**
// // // // // // // // //  * Custom hook to verify a user's email.
// // // // // // // // //  * No changes needed here.
// // // // // // // // //  */
// // // // // // // // // export const useVerifyEmail = () => {
// // // // // // // // //   return useMutation<any, Error, VerifyEmailData>({
// // // // // // // // //     mutationFn: verifyEmail,
// // // // // // // // //     onSuccess: (data) => {
// // // // // // // // //       console.log(data.message);
// // // // // // // // //     },
// // // // // // // // //     onError: (error) => {
// // // // // // // // //       console.error('Email verification failed:', error.message);
// // // // // // // // //     },
// // // // // // // // //   });
// // // // // // // // // };

// // // // // // // // // /**
// // // // // // // // //  * Custom hook for the forgot password process.
// // // // // // // // //  * Fix: Changed the generic type from `any` to `ForgotPasswordResponse`.
// // // // // // // // //  */
// // // // // // // // // export const useForgotPassword = () => {
// // // // // // // // //   return useMutation<ForgotPasswordResponse, Error, ForgotPasswordData>({
// // // // // // // // //     mutationFn: forgotPassword,
// // // // // // // // //     onSuccess: (data) => {
// // // // // // // // //       console.log(data.message);
// // // // // // // // //     },
// // // // // // // // //     onError: (error) => {
// // // // // // // // //       console.error('Forgot password request failed:', error.message);
// // // // // // // // //     },
// // // // // // // // //   });
// // // // // // // // // };

// // // // // // // // // /**
// // // // // // // // //  * Custom hook to reset the user's password.
// // // // // // // // //  * Fix: Changed the generic type from `any` to `ResetPasswordResponse`.
// // // // // // // // //  */
// // // // // // // // // export const useResetPassword = () => {
// // // // // // // // //   return useMutation<ResetPasswordResponse, Error, ResetPasswordData>({
// // // // // // // // //     mutationFn: resetPassword,
// // // // // // // // //     onSuccess: (data) => {
// // // // // // // // //       console.log(data.message);
// // // // // // // // //     },
// // // // // // // // //     onError: (error) => {
// // // // // // // // //       console.error('Password reset failed:', error.message);
// // // // // // // // //     },
// // // // // // // // //   });
// // // // // // // // // };


// // // // // // // // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // // // // // // // import {
// // // // // // // // // //   loginUser,
// // // // // // // // // //   registerUser,
// // // // // // // // // //   getProfile,
// // // // // // // // // //   updateProfile,
// // // // // // // // // //   changePassword,
// // // // // // // // // //   verifyEmail,
// // // // // // // // // //   forgotPassword,
// // // // // // // // // //   resetPassword,
// // // // // // // // // // } from '@/components/services/authServices';
// // // // // // // // // // import { useAuthStore } from '@/components/store/authStore';
// // // // // // // // // // import {
// // // // // // // // // //   LoginData,
// // // // // // // // // //   RegisterData,
// // // // // // // // // //   UpdateProfileData,
// // // // // // // // // //   VerifyEmailData,
// // // // // // // // // //   ForgotPasswordData,
// // // // // // // // // //   ResetPasswordData,
// // // // // // // // // //   User,
// // // // // // // // // // } from '@/components/types/auth'

// // // // // // // // // // /**
// // // // // // // // // //  * Custom hook for user login.
// // // // // // // // // //  * Uses useMutation to handle the login POST request.
// // // // // // // // // //  * On success, it updates the Zustand store with the user token and data.
// // // // // // // // // //  */
// // // // // // // // // // export const useLogin = () => {
// // // // // // // // // //   const { login } = useAuthStore();
// // // // // // // // // //   const queryClient = useQueryClient();

// // // // // // // // // //   return useMutation<User, Error, LoginData>({
// // // // // // // // // //     mutationFn: loginUser,
// // // // // // // // // //     onSuccess: (data) => {
// // // // // // // // // //       login(data.token as string, data);
// // // // // // // // // //       queryClient.setQueryData(['profile'], data);
// // // // // // // // // //     },
// // // // // // // // // //     onError: (error) => {
// // // // // // // // // //       console.error('Login failed:', error.message);
// // // // // // // // // //     },
// // // // // // // // // //   });
// // // // // // // // // // };

// // // // // // // // // // /**
// // // // // // // // // //  * Custom hook for user registration.
// // // // // // // // // //  * Uses useMutation to handle the register POST request.
// // // // // // // // // //  */
// // // // // // // // // // export const useRegister = () => {
// // // // // // // // // //   return useMutation<User, Error, RegisterData>({
// // // // // // // // // //     mutationFn: registerUser,
// // // // // // // // // //     onSuccess: (data) => {
// // // // // // // // // //       console.log('Registration successful:', data.message);
// // // // // // // // // //     },
// // // // // // // // // //     onError: (error) => {
// // // // // // // // // //       console.error('Registration failed:', error.message);
// // // // // // // // // //     },
// // // // // // // // // //   });
// // // // // // // // // // };

// // // // // // // // // // /**
// // // // // // // // // //  * Custom hook to get the authenticated user's profile.
// // // // // // // // // //  * Uses useQuery to fetch the profile, which is cached by react-query.
// // // // // // // // // //  * The query is only enabled when a token exists in the Zustand store.
// // // // // // // // // //  */
// // // // // // // // // // export const useProfile = () => {
// // // // // // // // // //   const { token, logout } = useAuthStore();
// // // // // // // // // //   return useQuery<User, Error>({
// // // // // // // // // //     queryKey: ['profile'],
// // // // // // // // // //     queryFn: () => getProfile(token!),
// // // // // // // // // //     enabled: !!token,
// // // // // // // // // //     onError: (error) => {
// // // // // // // // // //       console.error('Failed to fetch profile:', error.message);
// // // // // // // // // //       // If fetching the profile fails (e.g., invalid token), log the user out
// // // // // // // // // //       logout();
// // // // // // // // // //     },
// // // // // // // // // //   });
// // // // // // // // // // };

// // // // // // // // // // /**
// // // // // // // // // //  * Custom hook to update the user's profile.
// // // // // // // // // //  * Uses useMutation to handle the PUT request.
// // // // // // // // // //  * On success, it invalidates the 'profile' query to refetch the latest data.
// // // // // // // // // //  */
// // // // // // // // // // export const useUpdateProfile = () => {
// // // // // // // // // //   const queryClient = useQueryClient();
// // // // // // // // // //   const { token } = useAuthStore();

// // // // // // // // // //   return useMutation<User, Error, UpdateProfileData>({
// // // // // // // // // //     mutationFn: (updateData) => updateProfile(token!, updateData),
// // // // // // // // // //     onSuccess: () => {
// // // // // // // // // //       queryClient.invalidateQueries({ queryKey: ['profile'] });
// // // // // // // // // //       console.log('Profile updated successfully.');
// // // // // // // // // //     },
// // // // // // // // // //     onError: (error) => {
// // // // // // // // // //       console.error('Failed to update profile:', error.message);
// // // // // // // // // //     },
// // // // // // // // // //   });
// // // // // // // // // // };

// // // // // // // // // // /**
// // // // // // // // // //  * Custom hook to change the user's password.
// // // // // // // // // //  * Uses useMutation for the POST request.
// // // // // // // // // //  */
// // // // // // // // // // export const useChangePassword = () => {
// // // // // // // // // //   const { token } = useAuthStore();

// // // // // // // // // //   return useMutation<
// // // // // // // // // //     { message: string },
// // // // // // // // // //     Error,
// // // // // // // // // //     { currentPassword: string; newPassword: string }
// // // // // // // // // //   >({
// // // // // // // // // //     mutationFn: (data) => changePassword(token!, data),
// // // // // // // // // //     onSuccess: () => {
// // // // // // // // // //       console.log('Password changed successfully.');
// // // // // // // // // //     },
// // // // // // // // // //     onError: (error) => {
// // // // // // // // // //       console.error('Failed to change password:', error.message);
// // // // // // // // // //     },
// // // // // // // // // //   });
// // // // // // // // // // };

// // // // // // // // // // /**
// // // // // // // // // //  * Custom hook to verify a user's email.
// // // // // // // // // //  * Uses useMutation to handle the POST request.
// // // // // // // // // //  */
// // // // // // // // // // export const useVerifyEmail = () => {
// // // // // // // // // //   return useMutation<any, Error, VerifyEmailData>({
// // // // // // // // // //     mutationFn: verifyEmail,
// // // // // // // // // //     onSuccess: (data) => {
// // // // // // // // // //       console.log(data.message);
// // // // // // // // // //     },
// // // // // // // // // //     onError: (error) => {
// // // // // // // // // //       console.error('Email verification failed:', error.message);
// // // // // // // // // //     },
// // // // // // // // // //   });
// // // // // // // // // // };

// // // // // // // // // // /**
// // // // // // // // // //  * Custom hook for the forgot password process.
// // // // // // // // // //  * Uses useMutation to send a forgot password email.
// // // // // // // // // //  */
// // // // // // // // // // export const useForgotPassword = () => {
// // // // // // // // // //   return useMutation<any, Error, ForgotPasswordData>({
// // // // // // // // // //     mutationFn: forgotPassword,
// // // // // // // // // //     onSuccess: (data) => {
// // // // // // // // // //       console.log(data.message);
// // // // // // // // // //     },
// // // // // // // // // //     onError: (error) => {
// // // // // // // // // //       console.error('Forgot password request failed:', error.message);
// // // // // // // // // //     },
// // // // // // // // // //   });
// // // // // // // // // // };

// // // // // // // // // // /**
// // // // // // // // // //  * Custom hook to reset the user's password.
// // // // // // // // // //  * Uses useMutation for the POST request.
// // // // // // // // // //  */
// // // // // // // // // // export const useResetPassword = () => {
// // // // // // // // // //   return useMutation<any, Error, ResetPasswordData>({
// // // // // // // // // //     mutationFn: resetPassword,
// // // // // // // // // //     onSuccess: (data) => {
// // // // // // // // // //       console.log(data.message);
// // // // // // // // // //     },
// // // // // // // // // //     onError: (error) => {
// // // // // // // // // //       console.error('Password reset failed:', error.message);
// // // // // // // // // //     },
// // // // // // // // // //   });
// // // // // // // // // // };