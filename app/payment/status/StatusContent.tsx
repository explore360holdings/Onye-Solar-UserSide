// File: /app/payment/status/StatusContent.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// This is a Client Component because it uses browser-only hooks
export default function StatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const trxref = searchParams.get('trxref');
  const reference = searchParams.get('reference');
  const orderId = searchParams.get('orderId');

  // Automatically redirect after a successful payment
  useEffect(() => {
    if (status === 'successful' || orderId) {
      const timer = setTimeout(() => {
        router.push('/account?tab=orders');
      }, 4000); // 4-second delay
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [status, orderId, router]);

  // Case 1: Verification is in progress (Paystack hasn't redirected with params yet)
  if (!trxref && !reference && !orderId) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-lg text-center p-8">
          <Loader2 className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-bold mb-2">Verifying Payment...</h1>
          <p className="text-gray-600">Please wait while we confirm your transaction. Do not close this page.</p>
        </Card>
      </div>
    );
  }

  // Case 2: Payment was successful
  if (status === 'successful' || orderId) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-lg text-center p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your payment has been confirmed{orderId ? ` for order #${orderId}` : ''}. You will be redirected shortly.
          </p>
          <Link href="/account?tab=orders"><Button>View My Orders</Button></Link>
        </Card>
      </div>
    );
  }

  // Case 3: Payment failed or was not completed
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-lg text-center p-8">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Not Completed</h1>
        <p className="text-gray-600 mb-6">Your payment was not completed. If you believe this is an error, please contact support.</p>
        <Link href="/checkout"><Button>Try Again</Button></Link>
      </Card>
    </div>
  );
}