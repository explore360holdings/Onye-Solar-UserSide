"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XCircle } from "lucide-react";

export default function PaymentErrorPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-lg text-center p-8">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-6">Unfortunately, we were unable to process your payment. Please try again or contact support.</p>
        <Link href="/checkout"><Button>Try Again</Button></Link>
      </Card>
    </div>
  );
}