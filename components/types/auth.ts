// File: /components/types/auth.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  phone?: string;
}

export interface LoginData { email: string; password: string; }
export interface LoginResponse { token: string; user: User; }
export interface RegisterData { name: string; email: string; password: string; }
export interface RegisterResponse { message: string; user: { _id: string; name: string; email: string; } }
export interface VerifyEmailData { email: string; token: string; }
export interface VerifyEmailResponse { message: string; }
export interface ForgotPasswordData { email: string; }
export interface ForgotPasswordResponse { message: string; }
export interface ResetPasswordData { email: string; token: string; password: string; }
export interface ResetPasswordResponse { message: string; }
export interface UpdateProfileData { name?: string; email?: string; }
export interface UserSettings { theme: string; notifications: boolean; language: string; }

// --- FIX: UserAddress MUST use 'postalCode' to match your backend model ---
export interface UserAddress {
  _id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string; // Corrected from zipCode
  country: string;
  isDefault: boolean;
}

// --- FIX: Order addresses MUST also use 'postalCode' ---
export interface Order {
  _id: string;
  user: string;
  orderItems: { product: string; qty: number; price: number; }[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  isPaid: boolean;
  shippingAddress: { street: string; city: string; state: string; postalCode: string; country: string; }; // Corrected
  billingAddress: { street: string; city: string; state: string; postalCode: string; country: string; }; // Corrected
  createdAt: string;
}

export interface OrderDetails {
  id: string;
  shortCode: string;
  customer: { _id: string; name: string; email: string; };
  date: string;
  status: string;
  total: number;
  paymentMethod: string;
  isPaid: boolean;
  paidAt?: string;
  paymentStatus: string;
  shippingAddress: { street: string; city: string; state: string; postalCode: string; country: string; };
  billingAddress: { street: string; city: string; state: string; postalCode: string; country: string; };
  orderItems: {
    product: {
      id: string;
      name: string;
      image: string;
      price: number;
    };
    qty: number;
    price: number;
  }[];
}

export interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  exp: string;
  isDefault: boolean;
}


// export interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: 'user' | 'admin' | 'superadmin';
//   phone?: string;
// }

// export interface LoginData { email: string; password: string; }
// export interface LoginResponse { token: string; user: User; }
// export interface RegisterData { name: string; email: string; password: string; }
// export interface RegisterResponse { message: string; user: { _id: string; name: string; email: string; } }
// export interface VerifyEmailData { email: string; token: string; }
// export interface VerifyEmailResponse { message: string; }
// export interface ForgotPasswordData { email: string; }
// export interface ForgotPasswordResponse { message: string; }
// export interface ResetPasswordData { email: string; token: string; password: string; }
// export interface ResetPasswordResponse { message: string; }
// export interface UpdateProfileData { name?: string; email?: string; phone?: string; }
// export interface UserSettings { theme: string; notifications: boolean; language: string; }

// export interface UserAddress {
//   _id: string;
//   street: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   country: string;
//   isDefault: boolean;
// }

// export interface Order {
//   _id: string;
//   user: string;
//   orderItems: { product: string; qty: number; price: number; }[];
//   totalAmount: number;
//   status: string;
//   paymentMethod: string;
//   isPaid: boolean;
//   shippingAddress: { street: string; city: string; state: string; postalCode: string; country: string; };
//   billingAddress: { street: string; city: string; state: string; postalCode: string; country: string; };
//   createdAt: string;
// }

// export interface PaymentMethod {
//   id: string;
//   type: string;
//   last4: string;
//   exp: string;
//   isDefault: boolean;
// }

// // // File: /components/types/auth.ts

// // export interface User {
// //   _id: string; name: string; email: string;
// //   role: 'user' | 'admin' | 'superadmin'; phone?: string;
// // }
// // export interface LoginData { email: string; password: string; }
// // export interface LoginResponse { token: string; user: User; }
// // export interface RegisterData { name: string; email: string; password: string; }
// // export interface RegisterResponse { message: string; user: { _id: string; name: string; email: string; } }
// // export interface VerifyEmailData { email: string; token: string; }
// // export interface VerifyEmailResponse { message: string; }
// // export interface ForgotPasswordData { email: string; }
// // export interface ForgotPasswordResponse { message: string; }
// // export interface ResetPasswordData { email: string; token: string; password: string; }
// // export interface ResetPasswordResponse { message: string; }
// // export interface UpdateProfileData { name?: string; email?: string; phone?: string; }

// // // --- FIX: UserAddress MUST use 'street' to match the backend ---
// // export interface UserAddress {
// //   _id: string;
// //   street: string; // This is the single source of truth
// //   city: string;
// //   state: string;
// //   zipCode: string;
// //   country: string;
// //   isDefault: boolean;
// // }

// // // --- FIX: Order addresses MUST also use 'street' ---
// // export interface Order {
// //   _id: string; user: string;
// //   orderItems: { product: string; qty: number; price: number; }[];
// //   totalAmount: number; status: string; paymentMethod: string; isPaid: boolean;
// //   shippingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
// //   billingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
// //   createdAt: string;
// // }

// // export interface PaymentMethod { id: string; type: string; last4: string; exp: string; isDefault: boolean; }

// // // // File: /components/types/auth.ts

// // // // The core User model for your application.
// // // export interface User {
// // //   _id: string;
// // //   name: string;
// // //   email: string;
// // //   role: 'user' | 'admin' | 'superadmin';
// // //   phone?: string;
// // // }

// // // // Data required to send to the login API endpoint.
// // // export interface LoginData {
// // //   email: string;
// // //   password: string;
// // // }

// // // // The complete response received from the login API.
// // // export interface LoginResponse {
// // //   token: string;
// // //   user: User;
// // // }

// // // // Data required to send to the register API endpoint.
// // // export interface RegisterData {
// // //   name: string;
// // //   email: string;
// // //   password: string;
// // // }

// // // // The response received from the registration API.
// // // export interface RegisterResponse {
// // //   message: string;
// // //   user: {
// // //     _id: string;
// // //     name: string;
// // //     email: string;
// // //   }
// // // }

// // // // Data required for email verification.
// // // export interface VerifyEmailData {
// // //   email: string;
// // //   token: string;
// // // }

// // // export interface VerifyEmailResponse {
// // //   message: string;
// // // }

// // // // Data required for forgot password request.
// // // export interface ForgotPasswordData {
// // //   email: string;
// // // }

// // // export interface ForgotPasswordResponse {
// // //   message: string;
// // // }

// // // // Data required for resetting the password.
// // // export interface ResetPasswordData {
// // //   email: string;
// // //   token: string;
// // //   password: string;
// // // }

// // // export interface ResetPasswordResponse {
// // //   message: string;
// // // }

// // // // Data required for updating a user's profile.
// // // export interface UpdateProfileData {
// // //   name?: string;
// // //   email?: string;
// // //   phone?: string;
// // // }

// // // // User settings types
// // // export interface UserSettings {
// // //   theme: string;
// // //   notifications: boolean;
// // //   language: string;
// // // }

// // // // --- FIX: The UserAddress type now uses 'street' to match your backend model ---
// // // export interface UserAddress {
// // //   _id: string;
// // //   street: string; // Changed from 'address'
// // //   city: string;
// // //   state: string;
// // //   zipCode: string;
// // //   country: string;
// // //   isDefault: boolean;
// // // }

// // // // The Order type
// // // export interface Order {
// // //   _id: string;
// // //   user: string;
// // //   orderItems: { product: string; qty: number; price: number; }[];
// // //   totalAmount: number;
// // //   status: string;
// // //   paymentMethod: string;
// // //   isPaid: boolean;
// // //   shippingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
// // //   billingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
// // //   createdAt: string;
// // // }

// // // export interface PaymentMethod {
// // //   id: string;
// // //   type: string;
// // //   last4: string;
// // //   exp: string;
// // //   isDefault: boolean;
// // // }

// // // export interface User {
// // //   _id: string;
// // //   name: string;
// // //   email: string;
// // //   role: 'user' | 'admin' | 'superadmin';
// // //   phone?: string;
// // // }

// // // export interface LoginData {
// // //   email: string;
// // //   password: string;
// // // }

// // // export interface LoginResponse {
// // //   token: string;
// // //   user: User;
// // // }

// // // export interface RegisterData {
// // //   name: string;
// // //   email: string;
// // //   password: string;
// // // }

// // // export interface RegisterResponse {
// // //   message: string;
// // //   user: {
// // //     _id: string;
// // //     name: string;
// // //     email: string;
// // //   }
// // // }

// // // export interface VerifyEmailData {
// // //   email: string;
// // //   token: string;
// // // }

// // // export interface VerifyEmailResponse {
// // //   message: string;
// // // }

// // // export interface ForgotPasswordData {
// // //   email: string;
// // // }

// // // export interface ForgotPasswordResponse {
// // //   message: string;
// // // }

// // // export interface ResetPasswordData {
// // //   email: string;
// // //   token: string;
// // //   password: string;
// // // }

// // // export interface ResetPasswordResponse {
// // //   message: string;
// // // }

// // // export interface UpdateProfileData {
// // //   name?: string;
// // //   email?: string;
// // //   phone?: string;
// // // }

// // // export interface UserSettings {
// // //   theme: string;
// // //   notifications: boolean;
// // //   language: string;
// // // }

// // // // User address types
// // // export interface UserAddress {
// // //   _id: string;
// // //   address: string;
// // //   city: string;
// // //   state: string;
// // //   zipCode: string;
// // //   country: string;
// // //   isDefault: boolean;
// // // }

// // // export interface Order {
// // //   _id: string; // Use _id,
// // //   user: string; // The user's ID
// // //   orderItems: {
// // //     product: string; // The product's ID
// // //     qty: number;
// // //     price: number;
// // //   }[];
// // //   totalAmount: number;
// // //   status: string;
// // //   paymentMethod: string;
// // //   isPaid: boolean;
// // //   shippingAddress: {
// // //     address: string;
// // //     city: string;
// // //     state: string;
// // //     zipCode: string;
// // //     country: string;
// // //   };
// // //   billingAddress: {
// // //     address: string;
// // //     city: string;
// // //     state: string;
// // //     zipCode: string;
// // //     country: string;
// // //   };
// // //   createdAt: string; // The date the order was created
// // // }

// // // export interface Order {
// // //   id: string;
// // //   date: string;
// // //   status: string;
// // //   total: number;
// // //   items: { name: string; quantity: number; price: number }[];
// // // }

// // // Add this interface as well
// // export interface PaymentMethod {
// //   id: string;
// //   type: string;
// //   last4: string;
// //   exp: string;
// //   isDefault: boolean;
// // }

// // // // File: components/types/auth.ts

// // // // The core User model for your application.
// // // // This is the complete representation of a user in your system.
// // // export interface User {
// // //   _id: string;
// // //   name: string;
// // //   email: string;
// // //   role: 'user' | 'admin' | 'superadmin';
// // //   phone?: string;
// // // }

// // // // Data required to send to the login API endpoint.
// // // export interface LoginData {
// // //   email: string;
// // //   password: string;
// // // }

// // // // The complete response received from the login API.
// // // // It contains a token for authentication and the core User data.
// // // export interface LoginResponse {
// // //   token: string;
// // //   user: User; // ⬅️ The user object should have the 'role' property
// // // }

// // // // Data required to send to the register API endpoint.
// // // export interface RegisterData {
// // //   name: string;
// // //   email: string;
// // //   password: string;
// // // }

// // // // The response received from the registration API.
// // // // It confirms success and includes the newly created user's data without the role
// // // export interface RegisterResponse {
// // //   message: string;
// // //   user: {
// // //     _id: string;
// // //     name: string;
// // //     email: string;
// // //   }
// // // }

// // // // Data required for email verification.
// // // export interface VerifyEmailData {
// // //   email: string;
// // //   token: string;
// // // }

// // // export interface VerifyEmailResponse {
// // //   message: string;
// // // }

// // // // Data required for forgot password request.
// // // export interface ForgotPasswordData {
// // //   email: string;
// // // }

// // // export interface ForgotPasswordResponse {
// // //   message: string;
// // // }

// // // // Data required for resetting the password.
// // // export interface ResetPasswordData {
// // //   email: string;
// // //   token: string;
// // //   password: string;
// // // }

// // // export interface ResetPasswordResponse {
// // //   message: string;
// // // }

// // // // Data required for updating a user's profile.
// // // export interface UpdateProfileData {
// // //   name?: string;
// // //   email?: string;
// // // }

// // // // User settings types
// // // export interface UserSettings {
// // //   theme: string;
// // //   notifications: boolean;
// // //   language: string;
// // // }

// // // // User address types
// // // export interface UserAddress {
// // //   _id: string;
// // //   address: string;
// // //   city: string;
// // //   state: string;
// // //   zipCode: string;
// // //   country: string;
// // //   isDefault: boolean;
// // // }

// // // // // File: components/types/auth.ts

// // // // // The core User model for your application.
// // // // // This is the complete representation of a user in your system.
// // // // export interface User {
// // // //   _id: string;
// // // //   name: string;
// // // //   email: string;
// // // //   role: 'user' | 'admin' | 'superadmin';
// // // //   phone?: string;
// // // // }

// // // // // Data required to send to the login API endpoint.
// // // // export interface LoginData {
// // // //   email: string;
// // // //   password: string;
// // // // }

// // // // // The complete response received from the login API.
// // // // // It contains a token for authentication and the core User data.
// // // // export interface LoginResponse {
// // // //   token: string;
// // // //   user: User; // ⬅️ Reference the main User interface
// // // // }

// // // // // Data required to send to the register API endpoint.
// // // // export interface RegisterData {
// // // //   name: string;
// // // //   email: string;
// // // //   password: string;
// // // // }

// // // // // The response received from the registration API.
// // // // // It confirms success and may include the new user's basic data.
// // // // export interface RegisterResponse {
// // // //   message: string;
// // // //   user: {
// // // //     _id: string;
// // // //     name: string;
// // // //     email: string;
// // // //   }
// // // // }

// // // // // Data required for email verification.
// // // // export interface VerifyEmailData {
// // // //   email: string;
// // // //   token: string;
// // // // }

// // // // export interface VerifyEmailResponse {
// // // //   message: string;
// // // // }

// // // // // Data required for forgot password request.
// // // // export interface ForgotPasswordData {
// // // //   email: string;
// // // // }

// // // // export interface ForgotPasswordResponse {
// // // //   message: string;
// // // // }

// // // // // Data required for resetting the password.
// // // // export interface ResetPasswordData {
// // // //   email: string;
// // // //   token: string;
// // // //   password: string;
// // // // }

// // // // export interface ResetPasswordResponse {
// // // //   message: string;
// // // // }

// // // // // Data required for updating a user's profile.
// // // // export interface UpdateProfileData {
// // // //   name?: string;
// // // //   email?: string;
// // // // }

// // // // // User settings types
// // // // export interface UserSettings {
// // // //   theme: string;
// // // //   notifications: boolean;
// // // //   language: string;
// // // // }

// // // // // User address types
// // // // export interface UserAddress {
// // // //   _id: string;
// // // //   address: string;
// // // //   city: string;
// // // //   state: string;
// // // //   zipCode: string;
// // // //   country: string;
// // // //   isDefault: boolean;
// // // // }

// // // // // export interface User {
// // // // //   _id: string;
// // // // //   name: string;
// // // // //   email: string;
// // // // //   role: 'user' | 'admin' | 'superadmin';
// // // // //   token?: string;
// // // // // }

// // // // // export interface LoginData {
// // // // //   email: string;
// // // // //   password: string;
// // // // // }

// // // // // export interface LoginResponse {
// // // // //   _id: string;
// // // // //   name: string;
// // // // //   email: string;
// // // // //   role: string;
// // // // //   token: string;
// // // // // }

// // // // // export interface RegisterData {
// // // // //   name: string;
// // // // //   email: string;
// // // // //   password: string;
// // // // // }

// // // // // export interface RegisterResponse {
// // // // //   _id: string;
// // // // //   name: string;
// // // // //   email: string;
// // // // //   role: 'user';
// // // // //   message: string;
// // // // // }

// // // // // export interface VerifyEmailData {
// // // // //   email: string;
// // // // //   token: string;
// // // // // }

// // // // // export interface VerifyEmailResponse {
// // // // //   message: string;
// // // // // }

// // // // // export interface ForgotPasswordData {
// // // // //   email: string;
// // // // // }

// // // // // export interface ForgotPasswordResponse {
// // // // //   message: string;
// // // // // }

// // // // // export interface ResetPasswordData {
// // // // //   email: string;
// // // // //   token: string;
// // // // //   password: string;
// // // // // }

// // // // // export interface ResetPasswordResponse {
// // // // //   message: string;
// // // // // }

// // // // // export interface UpdateProfileData {
// // // // //   name?: string;
// // // // //   email?: string;
// // // // // }

// // // // // // User settings types
// // // // // export interface UserSettings {
// // // // //   theme: string;
// // // // //   notifications: boolean;
// // // // //   language: string;
// // // // // }

// // // // // // User address types
// // // // // export interface UserAddress {
// // // // //   _id: string;
// // // // //   address: string;
// // // // //   city: string;
// // // // //   state: string;
// // // // //   zipCode: string;
// // // // //   country: string;
// // // // //   isDefault: boolean;
// // // // // }