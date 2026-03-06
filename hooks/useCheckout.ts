// File: /hooks/useCheckout.ts

import { useState, useEffect } from "react";
import { useCart, CartItem } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder, createPaystackCheckoutSession } from "@/components/services/api";
import { useUser } from "./account";
import { useAuthStore } from "@/components/store/authStore";
import { Order } from "@/components/types/auth";

// --- FIX: All checkout-related types are now defined here AND EXPORTED ---

export type CheckoutStep = 'form' | 'success';

export interface AddressDetails {
  firstName: string; lastName: string; company: string; country: string;
  street: string; address2: string; city: string; state: string;
  postalCode: string; email: string; notes?: string;
}

export interface ShippingDetails {
  firstName: string; lastName: string;
  street: string; address2: string;
  city: string; state: string; postalCode: string; country: string;
}

export interface CheckoutPayload {
  items: CartItem[];
  billing: Omit<AddressDetails, 'notes'>;
  shipping: Omit<AddressDetails, 'notes'>;
  paymentMethod: string;
  total: number;
  orderNumber: string | null;
}

export interface CreateOrderPayload {
    orderItems: { product: string; qty: number; price: number }[];
    totalAmount: number;
    paymentMethod: string;
    shippingAddress: { street: string; city: string; state: string; postalCode: string; country: string; };
    billingAddress: { street: string; city: string; state: string; postalCode: string; country: string; };
}

export const useCheckout = () => {
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  const [billing, setBilling] = useState<AddressDetails>({
    firstName: "", lastName: "", company: "", country: "Nigeria", street: "",
    address2: "", city: "", state: "", postalCode: "", email: "", notes: "",
  });
  const [shipping, setShipping] = useState<AddressDetails>({
    firstName: "", lastName: "", company: "", country: "Nigeria", street: "",
    address2: "", city: "", state: "", postalCode: "", email: "", notes: "",
  });
  const [shipDiff, setShipDiff] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (user) {
      const nameParts = user.name.split(' ');
      setBilling(prev => ({ ...prev, firstName: nameParts[0] || '', lastName: nameParts.slice(1).join(' ') || '', email: user.email, phone: user.phone || '' }));
    }
  }, [user]);

  const { mutate: initializePayment, isPending: isInitializingPayment } = useMutation({
    mutationFn: createPaystackCheckoutSession,
    onSuccess: (data) => { if (data.authorization_url) window.location.href = data.authorization_url; },
    onError: (err) => toast({ title: "Payment Error", description: err.message, variant: "destructive" }),
  });

  const { mutate: placeOrder, isPending: isPlacingOrder, error: orderError } = useMutation({
    mutationFn: createOrder,
    onSuccess: (createdOrder: Order) => {
      toast({ title: "Order Created", description: `Redirecting to payment...` });
      initializePayment(createdOrder._id);
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (err) => toast({ title: "Order Creation Failed", description: err.message, variant: "destructive" }),
  });

  useEffect(() => { if (!shipDiff) setShipping(billing); }, [shipDiff, billing]);

  const shippingCost = 5000;
  const finalTotal = total + shippingCost;

  const handlePlaceOrder = () => {
    setLocalError("");
    if (!billing.firstName || !billing.street || !billing.city || !billing.state || !billing.postalCode || !billing.phone || !billing.email) {
      setLocalError("Please fill out all required billing fields.");
      return;
    }
    
    const orderPayload: CreateOrderPayload = {
      orderItems: items.map(item => ({ product: item.id, qty: item.quantity, price: item.price })),
      totalAmount: finalTotal,
      paymentMethod: 'paystack',
      shippingAddress: {
        street: shipDiff ? shipping.street : billing.street,
        city: shipDiff ? shipping.city : billing.city,
        state: shipDiff ? shipping.state : billing.state,
        postalCode: shipDiff ? shipping.postalCode : billing.postalCode,
        country: shipDiff ? shipping.country : billing.country,
      },
      billingAddress: {
        street: billing.street,
        city: billing.city,
        state: billing.state,
        postalCode: billing.postalCode,
        country: billing.country,
      },
    };
    
    placeOrder(orderPayload);
  };
  
  const isPending = isPlacingOrder || isInitializingPayment;
  const displayError = localError || (orderError as Error)?.message || null;

  return {
    items, total, shippingCost, finalTotal, billing, setBilling,
    shipping, setShipping, shipDiff, setShipDiff, error: displayError,
    isPending, handlePlaceOrder,
  };
};

// // File: /hooks/useCheckout.ts

// import { useState, useEffect } from "react";
// import { useCart, CartItem } from "@/hooks/useCart";
// import { useToast } from "@/hooks/use-toast";
// import { useRouter } from "next/navigation";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// // --- FIX: Import the payload type FROM the api.ts file ---
// import { createOrder, createPaystackCheckoutSession, CreateOrderPayload } from "@/components/services/api";
// import { useUser } from "./account";
// import { useAuthStore } from "@/components/store/authStore";
// import { Order } from "@/components/types/auth";

// export type CheckoutStep = 'form' | 'success';

// // --- These local types are fine for the form state ---
// export interface AddressDetails {
//   firstName: string; lastName: string; company: string; country: string;
//   street: string; address2: string; city: string; state: string;
//   postalCode: string; phone: string; email: string; notes?: string;
// }

// // FIX: This type is also now exported to be used by the API route
// export interface CheckoutPayload {
//   items: CartItem[];
//   billing: Omit<AddressDetails, 'notes'>;
//   shipping: Omit<AddressDetails, 'notes'>;
//   paymentMethod: string;
//   total: number;
//   orderNumber: string | null;
// }

// export const useCheckout = () => {
//   const { items, total, clearCart } = useCart();
//   const { toast } = useToast();
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const { data: user } = useUser();

//   const [billing, setBilling] = useState<AddressDetails>({
//     firstName: "", lastName: "", company: "", country: "Nigeria", street: "",
//     address2: "", city: "", state: "", postalCode: "", phone: "", email: "", notes: "",
//   });
//   const [shipping, setShipping] = useState<AddressDetails>({
//     firstName: "", lastName: "", company: "", country: "Nigeria", street: "",
//     address2: "", city: "", state: "", postalCode: "", phone: "", email: "", notes: "",
//   });
//   const [shipDiff, setShipDiff] = useState(false);
//   const [localError, setLocalError] = useState("");

//   useEffect(() => {
//     if (user) {
//       const nameParts = user.name.split(' ');
//       setBilling(prev => ({ ...prev, firstName: nameParts[0] || '', lastName: nameParts.slice(1).join(' ') || '', email: user.email, phone: user.phone || '' }));
//     }
//   }, [user]);

//   const { mutate: initializePayment, isPending: isInitializingPayment } = useMutation({
//     mutationFn: createPaystackCheckoutSession,
//     onSuccess: (data) => { if (data.authorization_url) window.location.href = data.authorization_url; },
//     onError: (err) => toast({ title: "Payment Error", description: err.message, variant: "destructive" }),
//   });

//   const { mutate: placeOrder, isPending: isPlacingOrder, error: orderError } = useMutation({
//     mutationFn: createOrder,
//     onSuccess: (createdOrder: Order) => {
//       toast({ title: "Order Created", description: `Redirecting to payment...` });
//       initializePayment(createdOrder._id);
//       clearCart();
//       queryClient.invalidateQueries({ queryKey: ['orders'] });
//     },
//     onError: (err) => toast({ title: "Order Creation Failed", description: err.message, variant: "destructive" }),
//   });

//   useEffect(() => { if (!shipDiff) setShipping(billing); }, [shipDiff, billing]);

//   const shippingCost = 5000;
//   const finalTotal = total + shippingCost;

//   const handlePlaceOrder = () => {
//     setLocalError("");
//     if (!billing.firstName || !billing.street || !billing.city || !billing.state || !billing.postalCode || !billing.phone || !billing.email) {
//       setLocalError("Please fill out all required billing fields.");
//       return;
//     }
    
//     // This payload object now correctly matches the type imported from api.ts
//     const orderPayload: CreateOrderPayload = {
//       orderItems: items.map(item => ({ product: item.id, qty: item.quantity, price: item.price })),
//       totalAmount: finalTotal,
//       paymentMethod: 'paystack',
//       shippingAddress: {
//         street: shipDiff ? shipping.street : billing.street,
//         city: shipDiff ? shipping.city : billing.city,
//         state: shipDiff ? shipping.state : billing.state,
//         postalCode: shipDiff ? shipping.postalCode : billing.postalCode,
//         country: shipDiff ? shipping.country : billing.country,
//       },
//       billingAddress: {
//         street: billing.street,
//         city: billing.city,
//         state: billing.state,
//         postalCode: billing.postalCode,
//         country: billing.country,
//       },
//     };
    
//     placeOrder(orderPayload);
//   };
  
//   const isPending = isPlacingOrder || isInitializingPayment;
//   const displayError = localError || (orderError as Error)?.message || null;

//   return {
//     items, total, shippingCost, finalTotal, billing, setBilling,
//     shipping, setShipping, shipDiff, setShipDiff, error: displayError,
//     isPending, handlePlaceOrder,
//   };
// };

// // // File: /hooks/useCheckout.ts

// // import { useState, useEffect } from "react";
// // import { useCart, CartItem } from "@/hooks/useCart";
// // import { useToast } from "@/hooks/use-toast";
// // import { useRouter } from "next/navigation";
// // import { useMutation, useQueryClient } from "@tanstack/react-query";
// // import { createOrder, createPaystackCheckoutSession } from "@/components/services/api";
// // import { useUser } from "./account";
// // import { useAuthStore } from "@/components/store/authStore";
// // import { Order } from "@/components/types/auth";

// // export type CheckoutStep = 'form' | 'success';

// // // --- FIX: These types now consistently use 'postalCode' ---
// // export interface AddressDetails {
// //   firstName: string; lastName: string; company: string; country: string;
// //   street: string; address2: string; city: string; state: string;
// //   postalCode: string; phone: string; email: string; notes?: string;
// // }

// // export interface ShippingDetails {
// //   firstName: string; lastName: string;
// //   street: string; address2: string;
// //   city: string; state: string; postalCode: string; country: string; phone: string;
// // }

// // export interface CreateOrderPayload {
// //     orderItems: { product: string; qty: number; price: number }[];
// //     totalAmount: number;
// //     paymentMethod: string;
// //     shippingAddress: { street: string; city: string; state: string; postalCode: string; country: string; };
// //     billingAddress: { street: string; city: string; state: string; postalCode: string; country: string; };
// // }

// // export const useCheckout = () => {
// //   const { items, total, clearCart } = useCart();
// //   const { toast } = useToast();
// //   const router = useRouter();
// //   const queryClient = useQueryClient();
// //   const { data: user } = useUser();

// //   // --- FIX: Initialize state with 'postalCode' property ---
// //   const [billing, setBilling] = useState<AddressDetails>({
// //     firstName: "", lastName: "", company: "", country: "Nigeria", street: "",
// //     address2: "", city: "", state: "", postalCode: "", phone: "", email: "", notes: "",
// //   });
// //   const [shipping, setShipping] = useState<AddressDetails>({
// //     firstName: "", lastName: "", company: "", country: "Nigeria", street: "",
// //     address2: "", city: "", state: "", postalCode: "", phone: "", email: "", notes: "",
// //   });
// //   const [shipDiff, setShipDiff] = useState(false);
// //   const [localError, setLocalError] = useState("");

// //   useEffect(() => {
// //     if (user) {
// //       const nameParts = user.name.split(' ');
// //       setBilling(prev => ({ ...prev, firstName: nameParts[0] || '', lastName: nameParts.slice(1).join(' ') || '', email: user.email, phone: user.phone || '' }));
// //     }
// //   }, [user]);

// //   const { mutate: initializePayment, isPending: isInitializingPayment } = useMutation({
// //     mutationFn: createPaystackCheckoutSession,
// //     onSuccess: (data) => { if (data.authorization_url) window.location.href = data.authorization_url; },
// //     onError: (err) => toast({ title: "Payment Error", description: err.message, variant: "destructive" }),
// //   });

// //   const { mutate: placeOrder, isPending: isPlacingOrder, error: orderError } = useMutation({
// //     mutationFn: createOrder,
// //     onSuccess: (createdOrder: Order) => {
// //       toast({ title: "Order Created", description: `Redirecting to payment...` });
// //       initializePayment(createdOrder._id);
// //       clearCart();
// //       queryClient.invalidateQueries({ queryKey: ['orders'] });
// //     },
// //     onError: (err) => toast({ title: "Order Creation Failed", description: err.message, variant: "destructive" }),
// //   });

// //   useEffect(() => { if (!shipDiff) setShipping(billing); }, [shipDiff, billing]);

// //   const shippingCost = 5000;
// //   const finalTotal = total + shippingCost;

// //   const handlePlaceOrder = () => {
// //     setLocalError("");
// //     if (!billing.firstName || !billing.street || !billing.city || !billing.state || !billing.postalCode || !billing.phone || !billing.email) {
// //       setLocalError("Please fill out all required billing fields.");
// //       return;
// //     }
    
// //     const orderPayload: CreateOrderPayload = {
// //       orderItems: items.map(item => ({ product: item.id, qty: item.quantity, price: item.price })),
// //       totalAmount: finalTotal,
// //       paymentMethod: 'paystack',
// //       // --- FIX: The payload now sends a 'postalCode' property ---
// //       shippingAddress: {
// //         street: shipDiff ? shipping.street : billing.street,
// //         city: shipDiff ? shipping.city : billing.city,
// //         state: shipDiff ? shipping.state : billing.state,
// //         postalCode: shipDiff ? shipping.postalCode : billing.postalCode,
// //         country: shipDiff ? shipping.country : billing.country,
// //       },
// //       billingAddress: {
// //         street: billing.street,
// //         city: billing.city,
// //         state: billing.state,
// //         postalCode: billing.postalCode,
// //         country: billing.country,
// //       },
// //     };
    
// //     placeOrder(orderPayload);
// //   };
  
// //   const isPending = isPlacingOrder || isInitializingPayment;
// //   const displayError = localError || (orderError as Error)?.message || null;

// //   return {
// //     items, total, shippingCost, finalTotal, billing, setBilling,
// //     shipping, setShipping, shipDiff, setShipDiff, error: displayError,
// //     isPending, handlePlaceOrder,
// //   };
// // };

// // // // File: /hooks/useCheckout.ts

// // // import { useState, useEffect } from "react";
// // // import { useCart, CartItem } from "@/hooks/useCart";
// // // import { useToast } from "@/hooks/use-toast";
// // // import { useRouter } from "next/navigation";
// // // import { useMutation, useQueryClient } from "@tanstack/react-query";
// // // import { createOrder, createPaystackCheckoutSession } from "@/components/services/api";
// // // import { useUser } from "./account";
// // // import { useAuthStore } from "@/components/store/authStore";
// // // import { Order } from "@/components/types/auth";

// // // export type CheckoutStep = 'form' | 'success';

// // // // --- FIX: These types now consistently use 'street' ---
// // // export interface AddressDetails {
// // //   firstName: string; lastName: string; company: string; country: string;
// // //   street: string; address2: string; city: string; state: string;
// // //   phone: string; email: string; notes?: string;
// // // }

// // // export interface ShippingDetails {
// // //   firstName: string; lastName: string;
// // //   street: string; address2: string;
// // //   city: string; state: string; country: string; phone: string;
// // // }

// // // // FIX: This type is now correct and exported
// // // export interface CreateOrderPayload {
// // //     orderItems: { product: string; qty: number; price: number }[];
// // //     totalAmount: number;
// // //     paymentMethod: string;
// // //     shippingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
// // //     billingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
// // // }

// // // export const useCheckout = () => {
// // //   const { items, total, clearCart } = useCart();
// // //   const { toast } = useToast();
// // //   const router = useRouter();
// // //   const queryClient = useQueryClient();
// // //   const { data: user } = useUser();

// // //   // FIX: Initialize state with 'street' property
// // //   const [billing, setBilling] = useState<AddressDetails>({
// // //     firstName: "", lastName: "", company: "", country: "Nigeria", street: "",
// // //     address2: "", city: "", state: "", phone: "", email: "", notes: "",
// // //   });
// // //   const [shipping, setShipping] = useState<AddressDetails>({
// // //     firstName: "", lastName: "", company: "", country: "Nigeria", street: "",
// // //     address2: "", city: "", state: "", phone: "", email: "", notes: "",
// // //   });
// // //   const [shipDiff, setShipDiff] = useState(false);
// // //   const [localError, setLocalError] = useState("");

// // //   useEffect(() => {
// // //     if (user) {
// // //       const nameParts = user.name.split(' ');
// // //       setBilling(prev => ({ ...prev, firstName: nameParts[0] || '', lastName: nameParts.slice(1).join(' ') || '', email: user.email, phone: user.phone || '' }));
// // //     }
// // //   }, [user]);

// // //   const { mutate: initializePayment, isPending: isInitializingPayment } = useMutation({
// // //     mutationFn: createPaystackCheckoutSession,
// // //     onSuccess: (data) => { if (data.authorization_url) window.location.href = data.authorization_url; },
// // //     onError: (err) => toast({ title: "Payment Error", description: err.message, variant: "destructive" }),
// // //   });

// // //   const { mutate: placeOrder, isPending: isPlacingOrder, error: orderError } = useMutation({
// // //     mutationFn: createOrder,
// // //     onSuccess: (createdOrder: Order) => {
// // //       toast({ title: "Order Created", description: `Redirecting to payment...` });
// // //       initializePayment(createdOrder._id);
// // //       clearCart();
// // //       queryClient.invalidateQueries({ queryKey: ['orders'] });
// // //     },
// // //     onError: (err) => toast({ title: "Order Creation Failed", description: err.message, variant: "destructive" }),
// // //   });

// // //   useEffect(() => { if (!shipDiff) setShipping(billing); }, [shipDiff, billing]);

// // //   const shippingCost = 5000;
// // //   const finalTotal = total + shippingCost;

// // //   const handlePlaceOrder = () => {
// // //     setLocalError("");
// // //     if (!billing.firstName || !billing.street || !billing.city || !billing.state || !billing.phone || !billing.email) {
// // //       setLocalError("Please fill out all required billing fields.");
// // //       return;
// // //     }
    
// // //     const orderPayload: CreateOrderPayload = {
// // //       orderItems: items.map(item => ({ product: item.id, qty: item.quantity, price: item.price })),
// // //       totalAmount: finalTotal,
// // //       paymentMethod: 'paystack',
// // //       shippingAddress: {
// // //         street: shipDiff ? shipping.street : billing.street,
// // //         city: shipDiff ? shipping.city : billing.city,
// // //         state: shipDiff ? shipping.state : billing.state,
// // //         zipCode: '100001',
// // //         country: shipDiff ? shipping.country : billing.country,
// // //       },
// // //       billingAddress: {
// // //         street: billing.street,
// // //         city: billing.city,
// // //         state: billing.state,
// // //         zipCode: '100001',
// // //         country: billing.country,
// // //       },
// // //     };
    
// // //     placeOrder(orderPayload);
// // //   };
  
// // //   const isPending = isPlacingOrder || isInitializingPayment;
// // //   const displayError = localError || (orderError as Error)?.message || null;

// // //   return {
// // //     items, total, shippingCost, finalTotal, billing, setBilling,
// // //     shipping, setShipping, shipDiff, setShipDiff, error: displayError,
// // //     isPending, handlePlaceOrder,
// // //   };
// // // };


// // // // // File: /hooks/useCheckout.ts

// // // // import { useState, useEffect } from "react";
// // // // import { useCart, CartItem } from "@/hooks/useCart";
// // // // import { useToast } from "@/hooks/use-toast";
// // // // import { useRouter } from "next/navigation";
// // // // import { useMutation, useQueryClient } from "@tanstack/react-query";
// // // // import { createOrder, createPaystackCheckoutSession } from "@/components/services/api";
// // // // import { useUser } from "./account";
// // // // import { useAuthStore } from "@/components/store/authStore";
// // // // import { Order } from "@/components/types/auth";

// // // // export type CheckoutStep = 'form' | 'success';

// // // // // --- FIX: These types now use 'street' to match the backend ---
// // // // export interface AddressDetails {
// // // //   firstName: string; lastName: string; company: string; country: string;
// // // //   street: string; address2: string; city: string; state: string;
// // // //   phone: string; email: string; notes?: string;
// // // // }

// // // // export interface ShippingDetails {
// // // //   firstName: string; lastName: string;
// // // //   street: string; address2: string;
// // // //   city: string; state: string; country: string; phone: string;
// // // // }

// // // // // This interface is passed to your backend's order creation endpoint
// // // // export interface CreateOrderPayload {
// // // //     orderItems: { product: string; qty: number; price: number }[];
// // // //     totalAmount: number;
// // // //     paymentMethod: string;
// // // //     shippingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
// // // //     billingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
// // // // }

// // // // export const useCheckout = () => {
// // // //   const { items, total, clearCart } = useCart();
// // // //   const { toast } = useToast();
// // // //   const router = useRouter();
// // // //   const queryClient = useQueryClient();

// // // //   const { token } = useAuthStore();
// // // //   const { data: user } = useUser();
// // // //   const isLoggedIn = !!token && !!user;

// // // //   const [step, setStep] = useState<CheckoutStep>('form');
// // // //   // --- FIX: Initialize state with 'street' property ---
// // // //   const [billing, setBilling] = useState<AddressDetails>({
// // // //     firstName: "", lastName: "", company: "", country: "Nigeria",
// // // //     street: "", address2: "", city: "", state: "", phone: "", email: "", notes: "",
// // // //   });
// // // //   const [shipping, setShipping] = useState<AddressDetails>({
// // // //     firstName: "", lastName: "", company: "", country: "Nigeria",
// // // //     street: "", address2: "", city: "", state: "", phone: "", email: "", notes: "",
// // // //   });
// // // //   const [shipDiff, setShipDiff] = useState(false);
// // // //   const [localError, setLocalError] = useState("");

// // // //   useEffect(() => {
// // // //     if (isLoggedIn && user) {
// // // //       const nameParts = user.name.split(' ');
// // // //       setBilling(prev => ({ ...prev, firstName: nameParts[0] || '', lastName: nameParts.slice(1).join(' ') || '', email: user.email, phone: user.phone || '' }));
// // // //     }
// // // //   }, [isLoggedIn, user]);

// // // //   const { mutate: initializePayment, isPending: isInitializingPayment } = useMutation({
// // // //     mutationFn: createPaystackCheckoutSession,
// // // //     onSuccess: (data) => { if (data.authorization_url) window.location.href = data.authorization_url; },
// // // //     onError: (err) => toast({ title: "Payment Error", description: err.message, variant: "destructive" }),
// // // //   });

// // // //   const { mutate: placeOrder, isPending: isPlacingOrder } = useMutation({
// // // //     mutationFn: createOrder,
// // // //     onSuccess: (createdOrder: Order) => {
// // // //       toast({ title: "Order Created", description: `Redirecting to payment...` });
// // // //       initializePayment(createdOrder._id);
// // // //       clearCart();
// // // //       queryClient.invalidateQueries({ queryKey: ['orders'] });
// // // //     },
// // // //     onError: (err) => toast({ title: "Order Creation Failed", description: err.message, variant: "destructive" }),
// // // //   });

// // // //   useEffect(() => { if (!shipDiff) setShipping(billing); }, [shipDiff, billing]);

// // // //   const shippingCost = 5000;
// // // //   const finalTotal = total + shippingCost;

// // // //   const handlePlaceOrder = () => {
// // // //     setLocalError("");
// // // //     if (items.length === 0) { router.push('/cart'); return; }
// // // //     // --- FIX: Validation now checks for 'street' ---
// // // //     if (!billing.firstName || !billing.street || !billing.city || !billing.state || !billing.phone || !billing.email) {
// // // //       setLocalError("Please fill out all required billing fields.");
// // // //       return;
// // // //     }
    
// // // //     const orderPayload: CreateOrderPayload = {
// // // //       orderItems: items.map(item => ({ product: item.id, qty: item.quantity, price: item.price })),
// // // //       totalAmount: finalTotal,
// // // //       paymentMethod: 'paystack',
// // // //       // --- FIX: The payload now sends a 'street' property ---
// // // //       shippingAddress: {
// // // //         street: shipDiff ? shipping.street : billing.street,
// // // //         city: shipDiff ? shipping.city : billing.city,
// // // //         state: shipDiff ? shipping.state : billing.state,
// // // //         zipCode: '100001', // Placeholder
// // // //         country: shipDiff ? shipping.country : billing.country,
// // // //       },
// // // //       billingAddress: {
// // // //         street: billing.street,
// // // //         city: billing.city,
// // // //         state: billing.state,
// // // //         zipCode: '100001', // Placeholder
// // // //         country: billing.country,
// // // //       },
// // // //     };
    
// // // //     placeOrder(orderPayload);
// // // //   };
  
// // // //   const isPending = isPlacingOrder || isInitializingPayment;
// // // //   const displayError = localError || null;

// // // //   return {
// // // //     items, total, shippingCost, finalTotal, step, billing, setBilling,
// // // //     shipping, setShipping, shipDiff, setShipDiff, error: displayError,
// // // //     isPending, handlePlaceOrder,
// // // //   };
// // // // };




// // // // // // File: /hooks/useCheckout.ts

// // // // // import { useState, useEffect } from "react";
// // // // // import { useCart, CartItem } from "@/hooks/useCart";
// // // // // import { useToast } from "@/hooks/use-toast";
// // // // // import { useRouter } from "next/navigation";
// // // // // import { useMutation, useQueryClient } from "@tanstack/react-query";
// // // // // import { createOrder, createPaystackCheckoutSession } from "@/components/services/api";
// // // // // import { useUser } from "./account";
// // // // // import { useAuthStore } from "@/components/store/authStore";
// // // // // import { Order } from "@/components/types/auth";

// // // // // export type CheckoutStep = 'form' | 'success';

// // // // // export interface AddressDetails {
// // // // //   firstName: string; lastName: string; company: string; country: string;
// // // // //   address: string; address2: string; city: string; state: string;
// // // // //   phone: string; email: string; notes?: string;
// // // // // }

// // // // // export interface ShippingDetails {
// // // // //   firstName: string; lastName: string; address: string; address2: string;
// // // // //   city: string; state: string; country: string; phone: string;
// // // // // }

// // // // // export interface CheckoutPayload {
// // // // //   items: CartItem[];
// // // // //   billing: Omit<AddressDetails, 'notes'>;
// // // // //   shipping: ShippingDetails;
// // // // //   paymentMethod: string;
// // // // //   total: number;
// // // // //   orderNumber: string | null;
// // // // // }

// // // // // export interface CreateOrderPayload {
// // // // //     orderItems: { product: string; qty: number; price: number }[];
// // // // //     totalAmount: number;
// // // // //     paymentMethod: string;
// // // // //     shippingAddress: { address: string; city: string; state: string; zipCode: string; country: string; };
// // // // //     billingAddress: { address: string; city: string; state: string; zipCode: string; country: string; };
// // // // // }

// // // // // export const useCheckout = () => {
// // // // //   const { items, total, clearCart } = useCart();
// // // // //   const { toast } = useToast();
// // // // //   const router = useRouter();
// // // // //   const queryClient = useQueryClient();

// // // // //   const { token } = useAuthStore();
// // // // //   const { data: user } = useUser();
// // // // //   const isLoggedIn = !!token && !!user;

// // // // //   const [step, setStep] = useState<CheckoutStep>('form');
// // // // //   const [billing, setBilling] = useState<AddressDetails>({
// // // // //     firstName: "", lastName: "", company: "", country: "Nigeria", address: "",
// // // // //     address2: "", city: "", state: "", phone: "", email: "", notes: "",
// // // // //   });
// // // // //   const [shipping, setShipping] = useState<AddressDetails>({
// // // // //     firstName: "", lastName: "", company: "", country: "Nigeria", address: "",
// // // // //     address2: "", city: "", state: "", phone: "", email: "", notes: "",
// // // // //   });
// // // // //   const [shipDiff, setShipDiff] = useState(false);
// // // // //   const [localError, setLocalError] = useState("");

// // // // //   useEffect(() => {
// // // // //     if (isLoggedIn && user) {
// // // // //       const nameParts = user.name.split(' ');
// // // // //       setBilling(prev => ({ ...prev, firstName: nameParts[0] || '', lastName: nameParts.slice(1).join(' ') || '', email: user.email, phone: user.phone || '' }));
// // // // //     }
// // // // //   }, [isLoggedIn, user]);

// // // // //   const { mutate: initializePayment, isPending: isInitializingPayment, error: paymentError } = useMutation({
// // // // //     mutationFn: createPaystackCheckoutSession,
// // // // //     onSuccess: (data) => {
// // // // //       if (data.authorization_url) {
// // // // //         window.location.href = data.authorization_url;
// // // // //       }
// // // // //     },
// // // // //     onError: (err) => {
// // // // //       toast({ title: "Payment Error", description: err.message, variant: "destructive" });
// // // // //     },
// // // // //   });

// // // // //   // --- FIX 1: Destructure the 'error' property and give it a unique name ---
// // // // //   const { mutate: placeOrder, isPending: isPlacingOrder, error: orderError } = useMutation({
// // // // //     mutationFn: createOrder,
// // // // //     onSuccess: (createdOrder: Order) => {
// // // // //       toast({ title: "Order Created", description: `Redirecting to payment...` });
// // // // //       initializePayment(createdOrder._id);
// // // // //       clearCart();
// // // // //       queryClient.invalidateQueries({ queryKey: ['orders'] });
// // // // //     },
// // // // //     onError: (err) => {
// // // // //       toast({ title: "Order Creation Failed", description: err.message, variant: "destructive" });
// // // // //     },
// // // // //   });

// // // // //   useEffect(() => {
// // // // //     if (!shipDiff) setShipping(billing);
// // // // //   }, [shipDiff, billing]);

// // // // //   const shippingCost = 5000;
// // // // //   const finalTotal = total + shippingCost;

// // // // //   const handlePlaceOrder = () => {
// // // // //     setLocalError("");
// // // // //     if (items.length === 0) { /* validation */ return; }
// // // // //     if (!billing.firstName || !billing.address || !billing.city || !billing.state || !billing.phone || !billing.email) {
// // // // //       setLocalError("Please fill out all required billing fields.");
// // // // //       return;
// // // // //     }
    
// // // // //     const orderPayload: CreateOrderPayload = {
// // // // //       orderItems: items.map(item => ({ product: item.id, qty: item.quantity, price: item.price })),
// // // // //       totalAmount: finalTotal,
// // // // //       paymentMethod: 'paystack',
// // // // //       shippingAddress: {
// // // // //         address: shipDiff ? shipping.address : billing.address,
// // // // //         city: shipDiff ? shipping.city : billing.city,
// // // // //         state: shipDiff ? shipping.state : billing.state,
// // // // //         zipCode: '100001',
// // // // //         country: shipDiff ? shipping.country : billing.country,
// // // // //       },
// // // // //       billingAddress: {
// // // // //         address: billing.address,
// // // // //         city: billing.city,
// // // // //         state: billing.state,
// // // // //         zipCode: '100001',
// // // // //         country: billing.country,
// // // // //       },
// // // // //     };
    
// // // // //     placeOrder(orderPayload);
// // // // //   };
  
// // // // //   const isPending = isPlacingOrder || isInitializingPayment;
// // // // //   // --- FIX 2: Check for either the orderError or the paymentError ---
// // // // //   const displayError = localError || (orderError as Error)?.message || (paymentError as Error)?.message || null;

// // // // //   return {
// // // // //     items, total, shippingCost, finalTotal, step, billing, setBilling,
// // // // //     shipping, setShipping, shipDiff, setShipDiff, error: displayError,
// // // // //     isPending, handlePlaceOrder,
// // // // //   };
// // // // // };

// // // // // // File: /hooks/useCheckout.ts

// // // // // import { useState, useEffect } from "react";
// // // // // import { useCart, CartItem } from "@/hooks/useCart";
// // // // // import { useToast } from "@/hooks/use-toast";
// // // // // import { useRouter } from "next/navigation";
// // // // // import { useMutation, useQueryClient } from "@tanstack/react-query";
// // // // // import { createOrder, createPaystackCheckoutSession } from "@/components/services/api";
// // // // // import { useUser } from "./account";
// // // // // import { useAuthStore } from "@/components/store/authStore";
// // // // // import { Order } from "@/components/types/auth";

// // // // // export type CheckoutStep = 'form' | 'success';

// // // // // // --- FIX: Add 'export' to all type definitions so they can be imported elsewhere ---
// // // // // export interface AddressDetails {
// // // // //   firstName: string; lastName: string; company: string; country: string;
// // // // //   address: string; address2: string; city: string; state: string;
// // // // //   phone: string; email: string; notes?: string;
// // // // // }

// // // // // export interface ShippingDetails {
// // // // //   firstName: string; lastName: string; address: string; address2: string;
// // // // //   city: string; state: string; country: string; phone: string;
// // // // // }

// // // // // export interface CheckoutPayload {
// // // // //   items: CartItem[];
// // // // //   billing: Omit<AddressDetails, 'notes'>;
// // // // //   shipping: ShippingDetails;
// // // // //   paymentMethod: string;
// // // // //   total: number;
// // // // //   orderNumber: string | null;
// // // // // }

// // // // // // Interface for the data needed to create an order via the API
// // // // // export interface CreateOrderPayload {
// // // // //     orderItems: { product: string; qty: number; price: number }[];
// // // // //     totalAmount: number;
// // // // //     paymentMethod: string;
// // // // //     shippingAddress: { address: string; city: string; state: string; zipCode: string; country: string; };
// // // // //     billingAddress: { address: string; city: string; state: string; zipCode: string; country: string; };
// // // // // }


// // // // // export const useCheckout = () => {
// // // // //   const { items, total, clearCart } = useCart();
// // // // //   const { toast } = useToast();
// // // // //   const router = useRouter();
// // // // //   const queryClient = useQueryClient();

// // // // //   const { token } = useAuthStore();
// // // // //   const { data: user } = useUser();
// // // // //   const isLoggedIn = !!token && !!user;

// // // // //   // FIX: Provide a complete and valid initial state for the form objects
// // // // //   const [step, setStep] = useState<CheckoutStep>('form');
// // // // //   const [billing, setBilling] = useState<AddressDetails>({
// // // // //     firstName: "", lastName: "", company: "", country: "Nigeria", address: "",
// // // // //     address2: "", city: "", state: "", phone: "", email: "", notes: "",
// // // // //   });
// // // // //   const [shipping, setShipping] = useState<AddressDetails>({
// // // // //     firstName: "", lastName: "", company: "", country: "Nigeria", address: "",
// // // // //     address2: "", city: "", state: "", phone: "", email: "", notes: "",
// // // // //   });
// // // // //   const [shipDiff, setShipDiff] = useState(false);
// // // // //   const [localError, setLocalError] = useState("");

// // // // //   useEffect(() => {
// // // // //     if (isLoggedIn && user) {
// // // // //       const nameParts = user.name.split(' ');
// // // // //       setBilling(prev => ({
// // // // //         ...prev,
// // // // //         firstName: nameParts[0] || '',
// // // // //         lastName: nameParts.slice(1).join(' ') || '',
// // // // //         email: user.email,
// // // // //         phone: user.phone || '',
// // // // //       }));
// // // // //     }
// // // // //   }, [isLoggedIn, user]);

// // // // //   const { mutate: initializePayment, isPending: isInitializingPayment } = useMutation({
// // // // //     mutationFn: createPaystackCheckoutSession,
// // // // //     onSuccess: (data) => {
// // // // //       if (data.authorization_url) {
// // // // //         window.location.href = data.authorization_url;
// // // // //       }
// // // // //     },
// // // // //     onError: (err) => {
// // // // //       toast({ title: "Payment Error", description: err.message, variant: "destructive" });
// // // // //     },
// // // // //   });

// // // // //   const { mutate: placeOrder, isPending: isPlacingOrder } = useMutation({
// // // // //     mutationFn: createOrder,
// // // // //     onSuccess: (createdOrder: Order) => {
// // // // //       toast({ title: "Order Created", description: `Redirecting to payment...` });
// // // // //       initializePayment(createdOrder._id);
// // // // //       clearCart();
// // // // //       queryClient.invalidateQueries({ queryKey: ['orders'] });
// // // // //     },
// // // // //     onError: (err) => {
// // // // //       toast({ title: "Order Creation Failed", description: err.message, variant: "destructive" });
// // // // //     },
// // // // //   });

// // // // //   useEffect(() => {
// // // // //     if (!shipDiff) setShipping(billing);
// // // // //   }, [shipDiff, billing]);

// // // // //   const shippingCost = 5000;
// // // // //   const finalTotal = total + shippingCost;

// // // // //   const handlePlaceOrder = () => {
// // // // //     setLocalError("");
// // // // //     if (items.length === 0) { /* validation */ return; }
// // // // //     if (!billing.firstName || !billing.address || !billing.city || !billing.state || !billing.phone || !billing.email) {
// // // // //       setLocalError("Please fill out all required billing fields.");
// // // // //       return;
// // // // //     }
    
// // // // //     const orderPayload: CreateOrderPayload = {
// // // // //       orderItems: items.map(item => ({ product: item.id, qty: item.quantity, price: item.price })),
// // // // //       totalAmount: finalTotal,
// // // // //       paymentMethod: 'paystack',
// // // // //       shippingAddress: {
// // // // //         address: shipDiff ? shipping.address : billing.address,
// // // // //         city: shipDiff ? shipping.city : billing.city,
// // // // //         state: shipDiff ? shipping.state : billing.state,
// // // // //         zipCode: '100001', // Placeholder, consider adding to your form
// // // // //         country: shipDiff ? shipping.country : billing.country,
// // // // //       },
// // // // //       billingAddress: {
// // // // //         address: billing.address,
// // // // //         city: billing.city,
// // // // //         state: billing.state,
// // // // //         zipCode: '100001',
// // // // //         country: billing.country,
// // // // //       },
// // // // //     };
    
// // // // //     placeOrder(orderPayload);
// // // // //   };
  
// // // // //   const isPending = isPlacingOrder || isInitializingPayment;
// // // // //   const displayError = localError || (isPending ? null : (error as Error)?.message);

// // // // //   return {
// // // // //     items, total, shippingCost, finalTotal, step, billing, setBilling,
// // // // //     shipping, setShipping, shipDiff, setShipDiff, error: displayError,
// // // // //     isPending, handlePlaceOrder,
// // // // //   };
// // // // // };

// // // // // --- NOTE: There are no stray characters at the end of this file ---

// // // // // // File: /hooks/useCheckout.ts

// // // // // import { useState, useEffect } from "react";
// // // // // import { useCart, CartItem } from "@/hooks/useCart";
// // // // // import { useToast } from "@/hooks/use-toast";
// // // // // import { useRouter } from "next/navigation";
// // // // // import { useMutation, useQueryClient } from "@tanstack/react-query";
// // // // // import { createOrder, createPaystackCheckoutSession } from "@/components/services/api";
// // // // // import { useUser } from "./account";
// // // // // import { useAuthStore } from "@/components/store/authStore";
// // // // // import { Order } from "@/components/types/auth";

// // // // // export type CheckoutStep = 'form' | 'success'; // We no longer need the 'confirm' step

// // // // // export interface AddressDetails {
// // // // //   firstName: string; lastName: string; company: string; country: string;
// // // // //   address: string; address2: string; city: string; state: string;
// // // // //   phone: string; email: string; notes?: string;
// // // // // }

// // // // // export const useCheckout = () => {
// // // // //   const { items, total, clearCart } = useCart();
// // // // //   const { toast } = useToast();
// // // // //   const router = useRouter();
// // // // //   const queryClient = useQueryClient();

// // // // //   const { token } = useAuthStore();
// // // // //   const { data: user } = useUser();
// // // // //   const isLoggedIn = !!token && !!user;

// // // // //   const [step, setStep] = useState<CheckoutStep>('form');
// // // // //   const [billing, setBilling] = useState<AddressDetails>({ /* ... initial state ... */ });
// // // // //   const [shipDiff, setShipDiff] = useState(false);
// // // // //   const [shipping, setShipping] = useState<AddressDetails>({ /* ... initial state ... */ });
// // // // //   const [localError, setLocalError] = useState("");

// // // // //   useEffect(() => {
// // // // //     if (isLoggedIn && user) {
// // // // //       const nameParts = user.name.split(' ');
// // // // //       setBilling(prev => ({ ...prev, firstName: nameParts[0] || '', lastName: nameParts.slice(1).join(' ') || '', email: user.email, phone: user.phone || '' }));
// // // // //     }
// // // // //   }, [isLoggedIn, user]);

// // // // //   // --- MUTATION 1: Initialize Payment (takes an orderId) ---
// // // // //   const { mutate: initializePayment, isPending: isInitializingPayment } = useMutation({
// // // // //     mutationFn: createPaystackCheckoutSession,
// // // // //     onSuccess: (data) => {
// // // // //       if (data.authorization_url) {
// // // // //         window.location.href = data.authorization_url; // Redirect to Paystack
// // // // //       }
// // // // //     },
// // // // //     onError: (err) => {
// // // // //       toast({ title: "Payment Error", description: err.message, variant: "destructive" });
// // // // //     },
// // // // //   });

// // // // //   // --- MUTATION 2: Create Order (takes order details) ---
// // // // //   const { mutate: placeOrder, isPending: isPlacingOrder } = useMutation({
// // // // //     mutationFn: createOrder,
// // // // //     onSuccess: (createdOrder: Order) => {
// // // // //       // If the order is created successfully, immediately trigger the payment initialization
// // // // //       toast({ title: "Order Created", description: `Order #${createdOrder._id.slice(-6)} created. Redirecting to payment...` });
// // // // //       initializePayment(createdOrder._id); // Chain the mutations
// // // // //       clearCart();
// // // // //       queryClient.invalidateQueries({ queryKey: ['orders'] });
// // // // //     },
// // // // //     onError: (err) => {
// // // // //       toast({ title: "Order Creation Failed", description: err.message, variant: "destructive" });
// // // // //     },
// // // // //   });

// // // // //   useEffect(() => {
// // // // //     if (!shipDiff) setShipping(billing);
// // // // //   }, [shipDiff, billing]);

// // // // //   const shippingCost = 5000;
// // // // //   const finalTotal = total + shippingCost;

// // // // //   const handlePlaceOrder = () => {
// // // // //     setLocalError("");
// // // // //     if (items.length === 0) { /* ... validation ... */ return; }
// // // // //     if (!billing.firstName || !billing.address || !billing.city || !billing.state || !billing.phone || !billing.email) {
// // // // //       setLocalError("Please fill out all required billing fields.");
// // // // //       return;
// // // // //     }
// // // // //     // ... more validation ...

// // // // //     // Construct the payload for YOUR backend's create order endpoint
// // // // //     const orderPayload = {
// // // // //       orderItems: items.map(item => ({ product: item.id, qty: item.quantity, price: item.price })),
// // // // //       totalAmount: finalTotal,
// // // // //       paymentMethod: 'paystack',
// // // // //       shippingAddress: {
// // // // //         address: shipDiff ? shipping.address : billing.address,
// // // // //         city: shipDiff ? shipping.city : billing.city,
// // // // //         state: shipDiff ? shipping.state : billing.state,
// // // // //         zipCode: '10001', // Your backend seems to require this, add a field if needed
// // // // //         country: shipDiff ? shipping.country : billing.country,
// // // // //       },
// // // // //       billingAddress: {
// // // // //         address: billing.address,
// // // // //         city: billing.city,
// // // // //         state: billing.state,
// // // // //         zipCode: '10001',
// // // // //         country: billing.country,
// // // // //       },
// // // // //     };
    
// // // // // x    placeOrder(orderPayload);
// // // // //   };
  
// // // // //   const isPending = isPlacingOrder || isInitializingPayment;
// // // // //   const displayError = localError || null; // Simplified error display

// // // // //   return {
// // // // //     items, total, shippingCost, finalTotal, step, billing, setBilling,
// // // // //     shipping, setShipping, shipDiff, setShipDiff, error: displayError,
// // // // //     isPending, handlePlaceOrder,
// // // // //   };
// // // // // };



// // // // // // // File: /hooks/useCheckout.ts

// // // // // // import { useState, useEffect } from "react";
// // // // // // import { useCart, CartItem } from "@/hooks/useCart";
// // // // // // import { useToast } from "@/hooks/use-toast";
// // // // // // import { useRouter } from "next/navigation";
// // // // // // import { useMutation } from "@tanstack/react-query";
// // // // // // import { createPaystackCheckoutSession } from "@/components/services/api";
// // // // // // import { useUser } from "./account";
// // // // // // import { useAuthStore } from "@/components/store/authStore";

// // // // // // export type CheckoutStep = 'form' | 'confirm' | 'success';

// // // // // // export interface AddressDetails {
// // // // // //   firstName: string; lastName: string; company: string; country: string;
// // // // // //   address: string; address2: string; city: string; state: string;
// // // // // //   phone: string; email: string; notes?: string;
// // // // // // }

// // // // // // export interface ShippingDetails {
// // // // // //   firstName: string; lastName: string; address: string; address2: string;
// // // // // //   city: string; state: string; country: string; phone: string;
// // // // // // }

// // // // // // export interface CheckoutPayload {
// // // // // //   items: CartItem[];
// // // // // //   billing: Omit<AddressDetails, 'notes'>;
// // // // // //   shipping: ShippingDetails;
// // // // // //   paymentMethod: string;
// // // // // //   total: number;
// // // // // //   orderNumber: string | null;
// // // // // // }

// // // // // // export const useCheckout = () => {
// // // // // //   const { items, total, clearCart } = useCart();
// // // // // //   const { toast } = useToast();
// // // // // //   const router = useRouter();

// // // // // //   const { token } = useAuthStore();
// // // // // //   const { data: user } = useUser();
// // // // // //   const isLoggedIn = !!token && !!user;

// // // // // //   const [step, setStep] = useState<CheckoutStep>('form');
// // // // // //   const [billing, setBilling] = useState<AddressDetails>({
// // // // // //     firstName: "", lastName: "", company: "", country: "Nigeria", address: "",
// // // // // //     address2: "", city: "", state: "", phone: "", email: "", notes: "",
// // // // // //   });
// // // // // //   const [shipDiff, setShipDiff] = useState(false);
// // // // // //   const [shipping, setShipping] = useState<ShippingDetails>({
// // // // // //     firstName: "", lastName: "", address: "", address2: "", city: "",
// // // // // //     state: "", country: "Nigeria", phone: "",
// // // // // //   });
// // // // // //   const [localError, setLocalError] = useState("");
// // // // // //   const [orderNumber, setOrderNumber] = useState<string | null>(null);

// // // // // //   useEffect(() => {
// // // // // //     if (isLoggedIn && user) {
// // // // // //       const nameParts = user.name.split(' ');
// // // // // //       const firstName = nameParts[0] || '';
// // // // // //       const lastName = nameParts.slice(1).join(' ') || '';

// // // // // //       setBilling(prev => ({
// // // // // //         ...prev,
// // // // // //         firstName: firstName,
// // // // // //         lastName: lastName,
// // // // // //         email: user.email,
// // // // // //         phone: user.phone || '',
// // // // // //       }));
// // // // // //     }
// // // // // //   }, [isLoggedIn, user]);

// // // // // //   const { mutate, isPending, error } = useMutation({
// // // // // //     mutationFn: createPaystackCheckoutSession,
// // // // // //     onSuccess: (data) => {
// // // // // //       if (data.authorization_url) {
// // // // // //         window.location.href = data.authorization_url;
// // // // // //       } else {
// // // // // //         setStep('success');
// // // // // //         clearCart();
// // // // // //         toast({ title: "Order Placed", description: "Your order was successful." });
// // // // // //       }
// // // // // //     },
// // // // // //     onError: (err) => {
// // // // // //       toast({
// // // // // //         title: "Payment Initialization Failed",
// // // // // //         description: err.message || "An unexpected error occurred.",
// // // // // //         variant: "destructive",
// // // // // //       });
// // // // // //       setStep('form');
// // // // // //     },
// // // // // //   });

// // // // // //   useEffect(() => {
// // // // // //     if (!shipDiff) {
// // // // // //       setShipping({
// // // // // //         firstName: billing.firstName, lastName: billing.lastName, address: billing.address,
// // // // // //         address2: billing.address2, city: billing.city, state: billing.state,
// // // // // //         country: billing.country, phone: billing.phone,
// // // // // //       });
// // // // // //     }
// // // // // //   }, [shipDiff, billing]);

// // // // // //   const shippingCost = 5000;
// // // // // //   const finalTotal = total + shippingCost;

// // // // // //   const handlePlaceOrder = () => {
// // // // // //     setLocalError("");
// // // // // //     if (items.length === 0) {
// // // // // //       toast({ variant: "destructive", description: "Your cart is empty." });
// // // // // //       router.push('/cart');
// // // // // //       return;
// // // // // //     }
// // // // // //     if (!billing.firstName || !billing.lastName || !billing.address || !billing.city || !billing.state || !billing.phone || !billing.email) {
// // // // // //       setLocalError("Please fill out all required billing fields.");
// // // // // //       return;
// // // // // //     }
// // // // // //     if (shipDiff && (!shipping.firstName || !shipping.lastName || !shipping.address || !shipping.city || !shipping.state)) {
// // // // // //       setLocalError("Please fill out all required shipping fields.");
// // // // // //       return;
// // // // // //     }
    
// // // // // //     setOrderNumber((Math.floor(Math.random() * 900000) + 100000).toString());
// // // // // //     setStep('confirm');
// // // // // //   };

// // // // // //   const handlePayNow = () => {
// // // // // //     const payload: CheckoutPayload = {
// // // // // //       items,
// // // // // //       billing: {
// // // // // //         firstName: billing.firstName, lastName: billing.lastName, company: billing.company,
// // // // // //         country: billing.country, address: billing.address, address2: billing.address2,
// // // // // //         city: billing.city, state: billing.state, phone: billing.phone, email: billing.email,
// // // // // //       },
// // // // // //       shipping: shipDiff ? shipping : {
// // // // // //         firstName: billing.firstName, lastName: billing.lastName, address: billing.address,
// // // // // //         address2: billing.address2, city: billing.city, state: billing.state,
// // // // // //         country: billing.country, phone: billing.phone,
// // // // // //       },
// // // // // //       paymentMethod: 'paystack',
// // // // // //       total: finalTotal,
// // // // // //       orderNumber,
// // // // // //     };
// // // // // //     mutate(payload);
// // // // // //   };
  
// // // // // //   const handleCancelOrder = () => {
// // // // // //     setStep('form');
// // // // // //     setOrderNumber(null);
// // // // // //   };
  
// // // // // //   const displayError = localError || (error ? (error as Error).message : null);

// // // // // //   return {
// // // // // //     items, total, shippingCost, finalTotal, step, billing, setBilling,
// // // // // //     shipping, setShipping, shipDiff, setShipDiff, error: displayError,
// // // // // //     orderNumber, isPending, handlePlaceOrder, handlePayNow, handleCancelOrder,
// // // // // //   };
// // // // // // };

// // // // // // // File: /app/checkout/page.tsx
// // // // // // "use client";

// // // // // // import { useCheckout } from "@/hooks/useCheckout";
// // // // // // import { Button } from "@/components/ui/button";
// // // // // // import { Input } from "@/components/ui/input";
// // // // // // import { Label } from "@/components/ui/label";
// // // // // // import { Checkbox } from "@/components/ui/checkbox";
// // // // // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // // // // // import { Separator } from "@/components/ui/separator";
// // // // // // import Image from "next/image";
// // // // // // import Link from "next/link";
// // // // // // import { CheckCircle } from "lucide-react";

// // // // // // // This is the actual React Component that will be rendered for the page.
// // // // // // export default function CheckoutPage() {
// // // // // //   const {
// // // // // //     items,
// // // // // //     total,
// // // // // //     shippingCost,
// // // // // //     finalTotal,
// // // // // //     step,
// // // // // //     billing,
// // // // // //     setBilling,
// // // // // //     shipping,
// // // // // //     setShipping,
// // // // // //     shipDiff,
// // // // // //     setShipDiff,
// // // // // //     error,
// // // // // //     orderNumber,
// // // // // //     isPending,
// // // // // //     handlePlaceOrder,
// // // // // //     handlePayNow,
// // // // // //     handleCancelOrder,
// // // // // //   } = useCheckout();

// // // // // //   if (step === 'success') {
// // // // // //     return (
// // // // // //       <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
// // // // // //         <Card className="w-full max-w-lg text-center p-8">
// // // // // //             <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
// // // // // //             <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
// // // // // //             <p className="text-gray-600 mb-4">Thank you for your purchase. Your order number is <span className="font-semibold text-primary">{orderNumber}</span>.</p>
// // // // // //             <Link href="/account/orders"><Button>View My Orders</Button></Link>
// // // // // //         </Card>
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   if (step === 'confirm') {
// // // // // //     return (
// // // // // //         <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
// // // // // //             <Card className="w-full max-w-2xl">
// // // // // //                 <CardHeader>
// // // // // //                     <CardTitle>Confirm Your Order</CardTitle>
// // // // // //                 </CardHeader>
// // // // // //                 <CardContent className="space-y-6">
// // // // // //                     <p>Please review your order details below before proceeding to payment.</p>
// // // // // //                     <div className="border rounded-lg p-4 space-y-2">
// // // // // //                         <div className="flex justify-between"><span className="text-gray-600">Order Number:</span> <span className="font-semibold">{orderNumber}</span></div>
// // // // // //                         <div className="flex justify-between"><span className="text-gray-600">Total Amount:</span> <span className="font-semibold text-primary text-lg">${finalTotal.toLocaleString()}</span></div>
// // // // // //                     </div>
// // // // // //                     <div className="flex justify-end gap-4">
// // // // // //                         <Button variant="outline" onClick={handleCancelOrder}>Edit Order</Button>
// // // // // //                         <Button onClick={handlePayNow} disabled={isPending}>
// // // // // //                             {isPending ? 'Processing...' : 'Pay with Paystack'}
// // // // // //                         </Button>
// // // // // //                     </div>
// // // // // //                 </CardContent>
// // // // // //             </Card>
// // // // // //         </div>
// // // // // //     )
// // // // // //   }

// // // // // //   // The main checkout form
// // // // // //   return (
// // // // // //     <div className="min-h-screen pt-20 bg-gray-50">
// // // // // //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// // // // // //         <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
// // // // // //         <div className="grid lg:grid-cols-2 gap-12">
// // // // // //           {/* Billing & Shipping Forms */}
// // // // // //           <div className="space-y-6">
// // // // // //             <Card>
// // // // // //               <CardHeader><CardTitle>Billing Details</CardTitle></CardHeader>
// // // // // //               <CardContent className="space-y-4">
// // // // // //                 <div className="grid grid-cols-2 gap-4">
// // // // // //                   <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" value={billing.firstName} onChange={e => setBilling(b => ({ ...b, firstName: e.target.value }))} /></div>
// // // // // //                   <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" value={billing.lastName} onChange={e => setBilling(b => ({ ...b, lastName: e.target.value }))} /></div>
// // // // // //                 </div>
// // // // // //                 <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={billing.email} onChange={e => setBilling(b => ({ ...b, email: e.target.value }))} /></div>
// // // // // //                 <div><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" value={billing.phone} onChange={e => setBilling(b => ({ ...b, phone: e.target.value }))} /></div>
// // // // // //                 <div><Label htmlFor="address">Address</Label><Input id="address" value={billing.address} onChange={e => setBilling(b => ({ ...b, address: e.target.value }))} /></div>
                
// // // // // //                 {/* --- FIX: ADDED MISSING CITY AND STATE FIELDS --- */}
// // // // // //                 <div className="grid grid-cols-2 gap-4">
// // // // // //                     <div>
// // // // // //                         <Label htmlFor="city">City</Label>
// // // // // //                         <Input id="city" value={billing.city} onChange={e => setBilling(b => ({ ...b, city: e.target.value }))} />
// // // // // //                     </div>
// // // // // //                     <div>
// // // // // //                         <Label htmlFor="state">State</Label>
// // // // // //                         <Input id="state" value={billing.state} onChange={e => setBilling(b => ({ ...b, state: e.target.value }))} />
// // // // // //                     </div>
// // // // // //                 </div>

// // // // // //               </CardContent>
// // // // // //             </Card>
            
// // // // // //             <div className="flex items-center space-x-2">
// // // // // //               <Checkbox id="shipDiff" checked={shipDiff} onCheckedChange={c => setShipDiff(Boolean(c))} />
// // // // // //               <Label htmlFor="shipDiff">Ship to a different address?</Label>
// // // // // //             </div>

// // // // // //             {shipDiff && (
// // // // // //                 <Card>
// // // // // //                     <CardHeader><CardTitle>Shipping Details</CardTitle></CardHeader>
// // // // // //                     <CardContent className="space-y-4">
// // // // // //                         {/* You can add the full shipping form here, similar to the billing form */}
// // // // // //                         <div className="grid grid-cols-2 gap-4">
// // // // // //                             <div><Label>First Name</Label><Input value={shipping.firstName} onChange={e => setShipping(s => ({...s, firstName: e.target.value}))} /></div>
// // // // // //                             <div><Label>Last Name</Label><Input value={shipping.lastName} onChange={e => setShipping(s => ({...s, lastName: e.target.value}))} /></div>
// // // // // //                         </div>
// // // // // //                         {/* ... etc */}
// // // // // //                     </CardContent>
// // // // // //                 </Card>
// // // // // //             )}
// // // // // //           </div>

// // // // // //           {/* Order Summary */}
// // // // // //           <div className="space-y-6">
// // // // // //             <Card>
// // // // // //               <CardHeader><CardTitle>Your Order</CardTitle></CardHeader>
// // // // // //               <CardContent className="space-y-4">
// // // // // //                 {items.map(item => (
// // // // // //                     <div key={item.id} className="flex items-center justify-between">
// // // // // //                         <div className="flex items-center gap-4">
// // // // // //                             <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
// // // // // //                                 <Image src={item.image || ''} alt={item.name} fill className="object-cover" />
// // // // // //                             </div>
// // // // // //                             <div>
// // // // // //                                 <p className="font-semibold">{item.name}</p>
// // // // // //                                 <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
// // // // // //                             </div>
// // // // // //                         </div>
// // // // // //                         <p className="font-semibold">${(item.price * item.quantity).toLocaleString()}</p>
// // // // // //                     </div>
// // // // // //                 ))}
// // // // // //                 <Separator />
// // // // // //                 <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>${total.toLocaleString()}</span></div>
// // // // // //                 <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>${shippingCost.toLocaleString()}</span></div>
// // // // // //                 <Separator />
// // // // // //                 <div className="flex justify-between font-bold text-lg"><span className="text-gray-900">Total</span><span className="text-primary">${finalTotal.toLocaleString()}</span></div>
// // // // // //                 {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
// // // // // //                 <Button className="w-full" size="lg" onClick={handlePlaceOrder}>Place Order</Button>
// // // // // //               </CardContent>
// // // // // //             </Card>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // }


// // // // // // // // File: /hooks/useCheckout.ts

// // // // // // // import { useState, useEffect } from "react";
// // // // // // // import { useCart, CartItem } from "@/hooks/useCart";
// // // // // // // import { useToast } from "@/hooks/use-toast";
// // // // // // // import { useRouter } from "next/navigation";
// // // // // // // import { useMutation } from "@tanstack/react-query";
// // // // // // // import { createPaystackCheckoutSession } from "@/components/services/api";

// // // // // // // // --- Import your real user and auth hooks ---
// // // // // // // import { useUser } from "./account";
// // // // // // // import { useAuthStore } from "@/components/store/authStore";

// // // // // // // export type CheckoutStep = 'form' | 'confirm' | 'success';

// // // // // // // // --- Type Definitions ---
// // // // // // // export interface AddressDetails {
// // // // // // //   firstName: string; lastName: string; company: string; country: string;
// // // // // // //   address: string; address2: string; city: string; state: string;
// // // // // // //   phone: string; email: string; notes?: string;
// // // // // // // }

// // // // // // // export interface ShippingDetails {
// // // // // // //   firstName: string; lastName: string; address: string; address2: string;
// // // // // // //   city: string; state: string; country: string; phone: string;
// // // // // // // }

// // // // // // // export interface CheckoutPayload {
// // // // // // //   items: CartItem[];
// // // // // // //   billing: Omit<AddressDetails, 'notes'>;
// // // // // // //   shipping: ShippingDetails;
// // // // // // //   paymentMethod: string;
// // // // // // //   total: number;
// // // // // // //   orderNumber: string | null;
// // // // // // // }

// // // // // // // export const useCheckout = () => {
// // // // // // //   const { items, total, clearCart } = useCart();
// // // // // // //   const { toast } = useToast();
// // // // // // //   const router = useRouter();

// // // // // // //   // --- Use REAL auth state, not mock data ---
// // // // // // //   const { token } = useAuthStore();
// // // // // // //   const { data: user } = useUser(); // Fetch the logged-in user's data
// // // // // // //   const isLoggedIn = !!token && !!user;

// // // // // // //   // --- Initialize state ---
// // // // // // //   // The form state will be empty by default and filled by an effect if the user is logged in.
// // // // // // //   const [step, setStep] = useState<CheckoutStep>('form');
// // // // // // //   const [billing, setBilling] = useState<AddressDetails>({
// // // // // // //     firstName: "", lastName: "", company: "", country: "Nigeria", address: "",
// // // // // // //     address2: "", city: "", state: "", phone: "", email: "", notes: "",
// // // // // // //   });
// // // // // // //   const [shipDiff, setShipDiff] = useState(false);
// // // // // // //   const [shipping, setShipping] = useState<ShippingDetails>({
// // // // // // //     firstName: "", lastName: "", address: "", address2: "", city: "",
// // // // // // //     state: "", country: "Nigeria", phone: "",
// // // // // // //   });
// // // // // // //   const [localError, setLocalError] = useState("");
// // // // // // //   const [orderNumber, setOrderNumber] = useState<string | null>(null);

// // // // // // //   // --- Effect to pre-fill form for logged-in users ---
// // // // // // //   useEffect(() => {
// // // // // // //     if (isLoggedIn && user) {
// // // // // // //       // Assuming user.name is "FirstName LastName"
// // // // // // //       const nameParts = user.name.split(' ');
// // // // // // //       const firstName = nameParts[0] || '';
// // // // // // //       const lastName = nameParts.slice(1).join(' ') || '';

// // // // // // //       setBilling(prev => ({
// // // // // // //         ...prev,
// // // // // // //         firstName: firstName,
// // // // // // //         lastName: lastName,
// // // // // // //         email: user.email,
// // // // // // //         phone: user.phone || '', // Use user's phone if it exists
// // // // // // //         // You might need to fetch the user's saved address here in a real app
// // // // // // //       }));
// // // // // // //     }
// // // // // // //   }, [isLoggedIn, user]); // This runs when user data becomes available

// // // // // // //   // The mutation for Paystack remains the same
// // // // // // //   const { mutate, isPending, error } = useMutation({
// // // // // // //     mutationFn: createPaystackCheckoutSession,
// // // // // // //     onSuccess: (data) => {
// // // // // // //       if (data.authorization_url) {
// // // // // // //         window.location.href = data.authorization_url;
// // // // // // //       } else {
// // // // // // //         setStep('success');
// // // // // // //         clearCart();
// // // // // // //         toast({ title: "Order Placed", description: "Your order was successful." });
// // // // // // //       }
// // // // // // //     },
// // // // // // //     onError: (err) => {
// // // // // // //       toast({
// // // // // // //         title: "Payment Initialization Failed",
// // // // // // //         description: err.message || "An unexpected error occurred.",
// // // // // // //         variant: "destructive",
// // // // // // //       });
// // // // // // //       setStep('form');
// // // // // // //     },
// // // // // // //   });

// // // // // // //   // Sync shipping with billing if the checkbox is unticked
// // // // // // //   useEffect(() => {
// // // // // // //     if (!shipDiff) {
// // // // // // //       setShipping({
// // // // // // //         firstName: billing.firstName, lastName: billing.lastName, address: billing.address,
// // // // // // //         address2: billing.address2, city: billing.city, state: billing.state,
// // // // // // //         country: billing.country, phone: billing.phone,
// // // // // // //       });
// // // // // // //     }
// // // // // // //   }, [shipDiff, billing]);

// // // // // // //   const shippingCost = 5000;
// // // // // // //   const finalTotal = total + shippingCost;

// // // // // // //   const handlePlaceOrder = () => {
// // // // // // //     setLocalError("");
// // // // // // //     if (items.length === 0) {
// // // // // // //       toast({ variant: "destructive", description: "Your cart is empty." });
// // // // // // //       router.push('/cart');
// // // // // // //       return;
// // // // // // //     }
// // // // // // //     if (!billing.firstName || !billing.lastName || !billing.address || !billing.city || !billing.state || !billing.phone || !billing.email) {
// // // // // // //       setLocalError("Please fill out all required billing fields.");
// // // // // // //       return;
// // // // // // //     }
// // // // // // //     if (shipDiff && (!shipping.firstName || !shipping.lastName || !shipping.address || !shipping.city || !shipping.state)) {
// // // // // // //       setLocalError("Please fill out all required shipping fields.");
// // // // // // //       return;
// // // // // // //     }
    
// // // // // // //     setOrderNumber((Math.floor(Math.random() * 900000) + 100000).toString());
// // // // // // //     setStep('confirm');
// // // // // // //   };

// // // // // // //   const handlePayNow = () => {
// // // // // // //     const payload: CheckoutPayload = {
// // // // // // //       items,
// // // // // // //       billing: {
// // // // // // //         firstName: billing.firstName, lastName: billing.lastName, company: billing.company,
// // // // // // //         country: billing.country, address: billing.address, address2: billing.address2,
// // // // // // //         city: billing.city, state: billing.state, phone: billing.phone, email: billing.email,
// // // // // // //       },
// // // // // // //       shipping: shipDiff ? shipping : {
// // // // // // //         firstName: billing.firstName, lastName: billing.lastName, address: billing.address,
// // // // // // //         address2: billing.address2, city: billing.city, state: billing.state,
// // // // // // //         country: billing.country, phone: billing.phone,
// // // // // // //       },
// // // // // // //       paymentMethod: 'paystack',
// // // // // // //       total: finalTotal,
// // // // // // //       orderNumber,
// // // // // // //     };
// // // // // // //     mutate(payload);
// // // // // // // };
  
// // // // // // //   const handleCancelOrder = () => {
// // // // // // //     setStep('form');
// // // // // // //     setOrderNumber(null);
// // // // // // //   };
  
// // // // // // //   const displayError = localError || (error ? (error as Error).message : null);

// // // // // // //   return {
// // // // // // //     items, total, shippingCost, finalTotal, step, billing, setBilling,
// // // // // // //     shipping, setShipping, shipDiff, setShipDiff, error: displayError,
// // // // // // //     orderNumber, isPending, handlePlaceOrder, handlePayNow, handleCancelOrder,
// // // // // // //   };
// // // // // // // };

// // // // // // // // // File: /hooks/useCheckout.ts

// // // // // // // // import { useState, useEffect } from "react";
// // // // // // // // import { useCart, CartItem } from "@/hooks/useCart";
// // // // // // // // import { useToast } from "@/hooks/use-toast";
// // // // // // // // import { useRouter } from "next/navigation";
// // // // // // // // import { useMutation } from "@tanstack/react-query";
// // // // // // // // import { createPaystackCheckoutSession } from "@/components/services/api";

// // // // // // // // export type CheckoutStep = 'form' | 'confirm' | 'success';

// // // // // // // // // --- Type Definitions ---
// // // // // // // // export interface AddressDetails {
// // // // // // // //   firstName: string; lastName: string; company: string; country: string;
// // // // // // // //   address: string; address2: string; city: string; state: string;
// // // // // // // //   phone: string; email: string; notes?: string;
// // // // // // // // }

// // // // // // // // export interface ShippingDetails {
// // // // // // // //   firstName: string; lastName: string; address: string; address2: string;
// // // // // // // //   city: string; state: string; country: string; phone: string;
// // // // // // // // }

// // // // // // // // // --- FIX: The CheckoutPayload is now cleaner and correct ---
// // // // // // // // export interface CheckoutPayload {
// // // // // // // //   items: CartItem[];
// // // // // // // //   billing: Omit<AddressDetails, 'notes'>;
// // // // // // // //   shipping: ShippingDetails;
// // // // // // // //   paymentMethod: string;
// // // // // // // //   // The redundant top-level 'email' has been removed.
// // // // // // // //   total: number;
// // // // // // // //   orderNumber: string | null;
// // // // // // // //   email: string
// // // // // // // // }

// // // // // // // // // --- Mock User Data ---
// // // // // // // // const mockUser = {
// // // // // // // //   isLoggedIn: true, firstName: "IDOKO", lastName: "TOCHUKWU",
// // // // // // // //   email: "victorvector608@gmail.com", phone: "+2348025383208",
// // // // // // // //   address: "Ajegunle apapa lagos", address2: "No.59 ekundayo street",
// // // // // // // //   city: "Ajegunle", state: "Lagos", country: "Nigeria", company: "",
// // // // // // // // };


// // // // // // // // export const useCheckout = () => {
// // // // // // // //   const { items, total, clearCart } = useCart();
// // // // // // // //   const { toast } = useToast();
// // // // // // // //   const router = useRouter();

// // // // // // // //   const [step, setStep] = useState<CheckoutStep>('form');
// // // // // // // //   const [billing, setBilling] = useState<AddressDetails>({
// // // // // // // //     firstName: mockUser.isLoggedIn ? mockUser.firstName : "",
// // // // // // // //     lastName: mockUser.isLoggedIn ? mockUser.lastName : "",
// // // // // // // //     company: mockUser.isLoggedIn ? mockUser.company : "",
// // // // // // // //     country: mockUser.isLoggedIn ? mockUser.country : "Nigeria",
// // // // // // // //     address: mockUser.isLoggedIn ? mockUser.address : "",
// // // // // // // //     address2: mockUser.isLoggedIn ? mockUser.address2 : "",
// // // // // // // //     city: mockUser.isLoggedIn ? mockUser.city : "",
// // // // // // // //     state: mockUser.isLoggedIn ? mockUser.state : "",
// // // // // // // //     phone: mockUser.isLoggedIn ? mockUser.phone : "",
// // // // // // // //     email: mockUser.isLoggedIn ? mockUser.email : "",
// // // // // // // //     notes: "",
// // // // // // // //   });
// // // // // // // //   const [shipDiff, setShipDiff] = useState(false);
// // // // // // // //   const [shipping, setShipping] = useState<ShippingDetails>({
// // // // // // // //     firstName: "", lastName: "", address: "", address2: "", city: "",
// // // // // // // //     state: "", country: "Nigeria", phone: "",
// // // // // // // //   });
// // // // // // // //   const [localError, setLocalError] = useState("");
// // // // // // // //   const [orderNumber, setOrderNumber] = useState<string | null>(null);

// // // // // // // //   const { 
// // // // // // // //     mutate, 
// // // // // // // //     isPending, 
// // // // // // // //     error 
// // // // // // // //   } = useMutation({
// // // // // // // //     mutationFn: createPaystackCheckoutSession,
// // // // // // // //     onSuccess: (data) => {
// // // // // // // //       if (data.authorization_url) {
// // // // // // // //         window.location.href = data.authorization_url;
// // // // // // // //       } else {
// // // // // // // //         toast({ title: "Order Placed", description: "Proceeding to payment..." });
// // // // // // // //         setStep('success');
// // // // // // // //         clearCart();
// // // // // // // //       }
// // // // // // // //     },
// // // // // // // //     onError: (err) => {
// // // // // // // //       toast({
// // // // // // // //         title: "Payment Initialization Failed",
// // // // // // // //         description: err.message || "An unexpected error occurred.",
// // // // // // // //         variant: "destructive",
// // // // // // // //       });
// // // // // // // //       setStep('form');
// // // // // // // //     },
// // // // // // // //   });

// // // // // // // //   useEffect(() => {
// // // // // // // //     if (!shipDiff) {
// // // // // // // //       setShipping({
// // // // // // // //         firstName: billing.firstName, lastName: billing.lastName, address: billing.address,
// // // // // // // //         address2: billing.address2, city: billing.city, state: billing.state,
// // // // // // // //         country: billing.country, phone: billing.phone,
// // // // // // // //       });
// // // // // // // //     }
// // // // // // // //   }, [shipDiff, billing]);

// // // // // // // //   const shippingCost = 5000;
// // // // // // // //   const finalTotal = total + shippingCost;

// // // // // // // //   const handlePlaceOrder = () => {
// // // // // // // //     setLocalError("");
// // // // // // // //     if (items.length === 0) {
// // // // // // // //       toast({ variant: "destructive", description: "Your cart is empty." });
// // // // // // // //       router.push('/cart');
// // // // // // // //       return;
// // // // // // // //     }
// // // // // // // //     if (!billing.firstName || !billing.lastName || !billing.address || !billing.city || !billing.state || !billing.phone || !billing.email) {
// // // // // // // //       setLocalError("Please fill out all required billing fields.");
// // // // // // // //       return;
// // // // // // // //     }
// // // // // // // //     if (shipDiff && (!shipping.firstName || !shipping.lastName || !shipping.address || !shipping.city || !shipping.state)) {
// // // // // // // //       setLocalError("Please fill out all required shipping fields.");
// // // // // // // //       return;
// // // // // // // //     }
    
// // // // // // // //     setOrderNumber((Math.floor(Math.random() * 900000) + 100000).toString());
// // // // // // // //     setStep('confirm');
// // // // // // // //   };

// // // // // // // //   const handlePayNow = () => {
// // // // // // // //     // This payload object now correctly matches the updated CheckoutPayload type
// // // // // // // //     const payload: CheckoutPayload = {
// // // // // // // //       items,
// // // // // // // //       billing: {
// // // // // // // //         firstName: billing.firstName, lastName: billing.lastName, company: billing.company,
// // // // // // // //         country: billing.country, address: billing.address, address2: billing.address2,
// // // // // // // //         city: billing.city, state: billing.state, phone: billing.phone, email: billing.email,
// // // // // // // //       },
// // // // // // // //       shipping: shipDiff ? shipping : {
// // // // // // // //         firstName: billing.firstName, lastName: billing.lastName, address: billing.address,
// // // // // // // //         address2: billing.address2, city: billing.city, state: billing.state,
// // // // // // // //         country: billing.country, phone: billing.phone,
// // // // // // // //       },
// // // // // // // //       paymentMethod: 'paystack',
// // // // // // // //       total: finalTotal,
// // // // // // // //       orderNumber,
// // // // // // // //     };
// // // // // // // //     mutate(payload);
// // // // // // // //   };
  
// // // // // // // //   const handleCancelOrder = () => {
// // // // // // // //     setStep('form');
// // // // // // // //     setOrderNumber(null);
// // // // // // // //   };
  
// // // // // // // //   const displayError = localError || (error ? (error as Error).message : null);

// // // // // // // //   return {
// // // // // // // //     items, total, shippingCost, finalTotal, step, billing, setBilling,
// // // // // // // //     shipping, setShipping, shipDiff, setShipDiff, error: displayError,
// // // // // // // //     orderNumber, isPending, handlePlaceOrder, handlePayNow, handleCancelOrder,
// // // // // // // //   };
// // // // // // // // };

// // // // // // // // // // File: /hooks/useCheckout.ts

// // // // // // // // // import { useState, useEffect } from "react";
// // // // // // // // // import { useCart, CartItem } from "@/hooks/useCart";
// // // // // // // // // import { useToast } from "@/hooks/use-toast";
// // // // // // // // // import { useRouter } from "next/navigation";
// // // // // // // // // import { useMutation } from "@tanstack/react-query";
// // // // // // // // // import { createPaystackCheckoutSession } from "@/components/services/api";

// // // // // // // // // export type CheckoutStep = 'form' | 'confirm' | 'success';

// // // // // // // // // export interface AddressDetails {
// // // // // // // // //   firstName: string; lastName: string; company: string; country: string;
// // // // // // // // //   address: string; address2: string; city: string; state: string;
// // // // // // // // //   phone: string; email: string; notes?: string;
// // // // // // // // // }

// // // // // // // // // export interface ShippingDetails {
// // // // // // // // //   firstName: string; lastName: string; address: string; address2: string;
// // // // // // // // //   city: string; state: string; country: string; phone: string;
// // // // // // // // // }

// // // // // // // // // export interface CheckoutPayload {
// // // // // // // // //   items: CartItem[];
// // // // // // // // //   billing: Omit<AddressDetails, 'notes'>;
// // // // // // // // //   shipping: ShippingDetails;
// // // // // // // // //   paymentMethod: string;
// // // // // // // // // //   email: string;
// // // // // // // // //   total: number;
// // // // // // // // //   orderNumber: string | null;
// // // // // // // // // }

// // // // // // // // // const mockUser = {
// // // // // // // // //   isLoggedIn: true, firstName: "IDOKO", lastName: "TOCHUKWU",
// // // // // // // // //   email: "victorvector608@gmail.com", phone: "+2348025383208",
// // // // // // // // //   address: "Ajegunle apapa lagos", address2: "No.59 ekundayo street",
// // // // // // // // //   city: "Ajegunle", state: "Lagos", country: "Nigeria", company: "",
// // // // // // // // // };

// // // // // // // // // export const useCheckout = () => {
// // // // // // // // //   const { items, total, clearCart } = useCart();
// // // // // // // // //   const { toast } = useToast();
// // // // // // // // //   const router = useRouter();

// // // // // // // // //   const [step, setStep] = useState<CheckoutStep>('form');
// // // // // // // // //   const [billing, setBilling] = useState<AddressDetails>({
// // // // // // // // //     firstName: mockUser.isLoggedIn ? mockUser.firstName : "",
// // // // // // // // //     lastName: mockUser.isLoggedIn ? mockUser.lastName : "",
// // // // // // // // //     company: mockUser.isLoggedIn ? mockUser.company : "",
// // // // // // // // //     country: mockUser.isLoggedIn ? mockUser.country : "Nigeria",
// // // // // // // // //     address: mockUser.isLoggedIn ? mockUser.address : "",
// // // // // // // // //     address2: mockUser.isLoggedIn ? mockUser.address2 : "",
// // // // // // // // //     city: mockUser.isLoggedIn ? mockUser.city : "",
// // // // // // // // //     state: mockUser.isLoggedIn ? mockUser.state : "",
// // // // // // // // //     phone: mockUser.isLoggedIn ? mockUser.phone : "",
// // // // // // // // //     email: mockUser.isLoggedIn ? mockUser.email : "",
// // // // // // // // //     notes: "",
// // // // // // // // //   });
// // // // // // // // //   const [shipDiff, setShipDiff] = useState(false);
// // // // // // // // //   const [shipping, setShipping] = useState<ShippingDetails>({
// // // // // // // // //     firstName: "", lastName: "", address: "", address2: "", city: "",
// // // // // // // // //     state: "", country: "Nigeria", phone: "",
// // // // // // // // //   });
// // // // // // // // //   const [localError, setLocalError] = useState("");
// // // // // // // // //   const [orderNumber, setOrderNumber] = useState<string | null>(null);

// // // // // // // // //   const { 
// // // // // // // // //     mutate, 
// // // // // // // // //     isPending, 
// // // // // // // // //     error 
// // // // // // // // //   } = useMutation({
// // // // // // // // //     mutationFn: createPaystackCheckoutSession,
// // // // // // // // //     onSuccess: (data) => {
// // // // // // // // //       if (data.authorization_url) {
// // // // // // // // //         window.location.href = data.authorization_url;
// // // // // // // // //       } else {
// // // // // // // // //         toast({ title: "Order Placed", description: "Proceeding to payment..." });
// // // // // // // // //         setStep('success');
// // // // // // // // //         clearCart();
// // // // // // // // //       }
// // // // // // // // //     },
// // // // // // // // //     onError: (err) => {
// // // // // // // // //       toast({
// // // // // // // // //         title: "Payment Initialization Failed",
// // // // // // // // //         description: err.message || "An unexpected error occurred.",
// // // // // // // // //         variant: "destructive",
// // // // // // // // //       });
// // // // // // // // //       setStep('form');
// // // // // // // // //     },
// // // // // // // // //   });

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     if (!shipDiff) {
// // // // // // // // //       setShipping({
// // // // // // // // //         firstName: billing.firstName, lastName: billing.lastName, address: billing.address,
// // // // // // // // //         address2: billing.address2, city: billing.city, state: billing.state,
// // // // // // // // //         country: billing.country, phone: billing.phone,
// // // // // // // // //       });
// // // // // // // // //     }
// // // // // // // // //   }, [shipDiff, billing]);

// // // // // // // // //   const shippingCost = 5000;
// // // // // // // // //   const finalTotal = total + shippingCost;

// // // // // // // // //   const handlePlaceOrder = () => {
// // // // // // // // //     setLocalError("");
// // // // // // // // //     if (items.length === 0) {
// // // // // // // // //       toast({ variant: "destructive", description: "Your cart is empty." });
// // // // // // // // //       router.push('/cart');
// // // // // // // // //       return;
// // // // // // // // //     }
// // // // // // // // //     if (!billing.firstName || !billing.lastName || !billing.address || !billing.city || !billing.state || !billing.phone || !billing.email) {
// // // // // // // // //       setLocalError("Please fill out all required billing fields.");
// // // // // // // // //       return;
// // // // // // // // //     }
// // // // // // // // //     if (shipDiff && (!shipping.firstName || !shipping.lastName || !shipping.address || !shipping.city || !shipping.state)) {
// // // // // // // // //       setLocalError("Please fill out all required shipping fields.");
// // // // // // // // //       return;
// // // // // // // // //     }
    
// // // // // // // // //     setOrderNumber((Math.floor(Math.random() * 900000) + 100000).toString());
// // // // // // // // //     setStep('confirm');
// // // // // // // // //   };

// // // // // // // // //   const handlePayNow = () => {
// // // // // // // // //     const payload: CheckoutPayload = {
// // // // // // // // //       items,
// // // // // // // // //       billing: {
// // // // // // // // //         firstName: billing.firstName, lastName: billing.lastName, company: billing.company,
// // // // // // // // //         country: billing.country, address: billing.address, address2: billing.address2,
// // // // // // // // //         city: billing.city, state: billing.state, phone: billing.phone, email: billing.email,
// // // // // // // // //       },
// // // // // // // // //       shipping: shipDiff ? shipping : {
// // // // // // // // //         firstName: billing.firstName, lastName: billing.lastName, address: billing.address,
// // // // // // // // //         address2: billing.address2, city: billing.city, state: billing.state,
// // // // // // // // //         country: billing.country, phone: billing.phone,
// // // // // // // // //       },
// // // // // // // // //       paymentMethod: 'paystack',
// // // // // // // // //       total: finalTotal,
// // // // // // // // //       orderNumber,
// // // // // // // // //     };
// // // // // // // // //     mutate(payload);
// // // // // // // // //   };
  
// // // // // // // // //   const handleCancelOrder = () => {
// // // // // // // // //     setStep('form');
// // // // // // // // //     setOrderNumber(null);
// // // // // // // // //   };
  
// // // // // // // // //   const displayError = localError || (error ? (error as Error).message : null);

// // // // // // // // //   return {
// // // // // // // // //     items, total, shippingCost, finalTotal, step, billing, setBilling,
// // // // // // // // //     shipping, setShipping, shipDiff, setShipDiff, error: displayError,
// // // // // // // // //     orderNumber, isPending, handlePlaceOrder, handlePayNow, handleCancelOrder,
// // // // // // // // //   };
// // // // // // // // // };