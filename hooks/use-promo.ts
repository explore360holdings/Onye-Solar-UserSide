// File: /hooks/use-promo.ts

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

// This simulates an API call to a backend that validates the promo code.
const applyPromoCodeApi = async (code: string): Promise<{ discountAmount: number; message: string }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const upperCaseCode = code.toUpperCase();
            if (upperCaseCode === 'SOLAR20') {
                resolve({ discountAmount: 20, message: "You saved 20%!" });
            } else if (upperCaseCode === 'WELCOME10') {
                resolve({ discountAmount: 10, message: "Welcome discount applied!" });
            } else {
                reject(new Error('Invalid or expired promo code.'));
            }
        }, 1000); // Simulate a 1-second network delay
    });
};

export const usePromo = (cartTotal: number) => {
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const { toast } = useToast();

    const { mutate, isPending, error } = useMutation({
        mutationFn: applyPromoCodeApi,
        onSuccess: (data) => {
            // Calculate the actual discount value based on the percentage and cart total
            const discountValue = cartTotal * (data.discountAmount / 100);
            setDiscount(discountValue);
            toast({
                title: "Promo code applied!",
                description: data.message,
            });
        },
        onError: (err: Error) => {
            setDiscount(0); // Reset discount on error
            toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
            });
        }
    });

    // This is the function the component calls
    const handleApply = () => {
        if (!promoCode) return;
        mutate(promoCode);
    };

    return {
        promoCode,
        setPromoCode,
        discount,
        handleApply,        // FIX: Now exported
        isPending,          // FIX: Now exported from the mutation
        promoError: error,  // FIX: Now exported from the mutation
    };
};

// import { useState } from 'react';

// export const usePromo = () => {
//   const [promoCode, setPromoCode] = useState('');
//   const [discount, setDiscount] = useState(0);

//   const applyPromoCode = (code: string) => {
//     if (code === 'SOLAR10') {
//       setDiscount(10);
//       setPromoCode(code);
//     } else {
//       setDiscount(0);
//       setPromoCode('');
//     }
//   };

//   return { promoCode, discount, applyPromoCode, setPromoCode };
// };

// // // hooks/use-promo.ts

// // import { useState } from "react";

// // export const usePromo = () => {
// //     const [promo, setPromo] = useState<string | null>(null);

// //     const applyPromo = (code: string) => {
// //         // You would implement your promo code logic here
// //         console.log(`Applying promo code: ${code}`);
// //         setPromo(code);
// //     };

// //     const removePromo = () => {
// //         setPromo(null);
// //     };

// //     return { promo, applyPromo, removePromo };
// // };