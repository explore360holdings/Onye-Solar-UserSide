import { Suspense } from 'react';
import SuccessContent from './SuccessContent'; // <-- Import the new client component
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// This is a Server Component. It can provide a loading UI.
const SuccessPageSkeleton = () => {
    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-lg text-center p-8">
                <Loader2 className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />
                <h1 className="text-2xl font-bold mb-2">Loading Confirmation...</h1>
                <p className="text-gray-600 mb-6">Please wait while we fetch your order details.</p>
            </Card>
        </div>
    );
};

export default function PaymentSuccessPage() {
  return (
    // The <Suspense> boundary is the key to the fix.
    // It tells Next.js: "Render the 'fallback' UI immediately on the server.
    // Then, on the client, swap it out for the real <SuccessContent>."
    <Suspense fallback={<SuccessPageSkeleton />}>
      <SuccessContent />
    </Suspense>
  );
}


// // File: /app/payment/success/page.tsx
// "use client"
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { CheckCircle } from "lucide-react";

// export default function PaymentSuccessPage() {
//   const params = useSearchParams();
//   const orderId = params.get('orderId');

//   return (
//     <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
//       <Card className="w-full max-w-lg text-center p-8">
//         <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//         <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
//         <p className="text-gray-600 mb-6">Thank you for your purchase. Your order #{orderId} has been confirmed.</p>
//         <div className="flex gap-4 justify-center">
//           <Link href="/account/orders"><Button>View My Orders</Button></Link>
//           <Link href="/products"><Button variant="outline">Continue Shopping</Button></Link>
//         </div>
//       </Card>
//     </div>
//   );
// }