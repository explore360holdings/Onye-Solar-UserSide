
import { Suspense } from 'react';
import StatusContent from './StatusContent'; 
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const PaymentStatusSkeleton = () => {
    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-lg text-center p-8">
                <Loader2 className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-spin" />
                <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </Card>
        </div>
    );
};

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<PaymentStatusSkeleton />}>
      <StatusContent />
    </Suspense>
  );
}


// // File: /app/payment/status/page.tsx
// "use client";

// import { useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { Loader2, CheckCircle, XCircle } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";

// export default function PaymentStatusPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const status = searchParams.get('status');
//   const trxref = searchParams.get('trxref');
//   const reference = searchParams.get('reference');

//   useEffect(() => {
//     if (status === 'successful' && (trxref || reference)) {
//       setTimeout(() => {
//         router.push('/account?tab=orders'); // Redirect to user's order history
//       }, 4000); // 4-second delay
//     }
//   }, [status, trxref, reference, router]);

//   if (!trxref && !reference) {
//     return (
//         <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
//             <Card className="w-full max-w-lg text-center p-8">
//                 <Loader2 className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-spin" />
//                 <h1 className="text-2xl font-bold mb-2">Verifying Payment...</h1>
//                 <p className="text-gray-600">Please wait while we confirm your transaction.</p>
//             </Card>
//         </div>
//     );
//   }

//   if (status === 'successful') {
//     return (
//         <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
//             <Card className="w-full max-w-lg text-center p-8">
//                 <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//                 <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
//                 <p className="text-gray-600 mb-6">Your payment has been confirmed. Your order is now processing. You will be redirected shortly.</p>
//                 <Link href="/account?tab=orders"><Button>View My Orders</Button></Link>
//             </Card>
//         </div>
//     );
//   }

//   return (
//     <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
//         <Card className="w-full max-w-lg text-center p-8">
//             <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//             <h1 className="text-2xl font-bold mb-2">Payment Not Completed</h1>
//             <p className="text-gray-600 mb-6">Your payment was not completed. If you believe this is an error, please contact support.</p>
//             <Link href="/checkout"><Button>Try Again</Button></Link>
//         </Card>
//         </div>
//     );
//   };
