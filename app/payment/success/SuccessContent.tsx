"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";

// This is a Client Component because it uses useSearchParams
export default function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('orderId');

  // Optional: You could add a redirect here if needed
  // const router = useRouter();
  // useEffect(() => { ... }, []);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-lg text-center p-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. 
          {/* Only show the order number if it exists in the URL */}
          {orderId && ` Your order #${orderId} has been confirmed.`}
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/account/orders"><Button>View My Orders</Button></Link>
          <Link href="/products"><Button variant="outline">Continue Shopping</Button></Link>
        </div>
      </Card>
    </div>
  );
}