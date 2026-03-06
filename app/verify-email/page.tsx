"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import VerifyEmailContent from "./VerifyEmailContent";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="w-full max-w-md text-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full space-y-6">
          <h1 className="text-2xl font-bold text-green-700"> Almost There!</h1>
          <p className="text-gray-500">
            Thanks for registering! A verification link has been sent to your
            email address. Please click the link to activate your account.
          </p>

          <div className="flex flex-col items-center space-y-4">
            {/* <p className="font-semibold text-gray-700">Open your email client:</p> */}
            <div className="flex flex-col space-y-2 w-full max-w-xs">
              <Link href="https://mail.google.com" target="_blank" passHref>
                <Button className="w-full bg-red-500 hover:bg-red-600">
                  Open Gmail
                </Button>
              </Link>
            </div>
            {/* <Link href="/login" className="text-green-700 hover:underline mt-4">
              Go to Login Page
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}



