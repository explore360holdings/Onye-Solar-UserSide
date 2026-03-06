"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useVerifyEmail, useResendVerificationEmail } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const verifyEmailMutation = useVerifyEmail();
  const resendVerificationMutation = useResendVerificationEmail();
  
  const [verificationState, setVerificationState] = useState<'loading' | 'success' | 'error' | 'initial'>('initial');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [hasAttemptedVerification, setHasAttemptedVerification] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendEmail, setResendEmail] = useState('');

  const handleVerification = useCallback((email: string, token: string) => {
    if (hasAttemptedVerification) return;
    
    setHasAttemptedVerification(true);
    setVerificationState('loading');
    
    verifyEmailMutation.mutate(
      { email, token },
      {
        onSuccess: (data) => {
          setVerificationState('success');
          toast({
            title: "Email Verified!",
            description: data.message,
            variant: "default",
          });
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        },
        onError: (error) => {
          setVerificationState('error');
          setErrorMessage(error.message || 'Verification failed');
          toast({
            title: "Verification Failed",
            description: error.message || 'Invalid or expired verification token',
            variant: "destructive",
          });
        }
      }
    );
  }, [hasAttemptedVerification, verifyEmailMutation, toast, router]);

  const handleResendVerification = useCallback((email: string) => {
    setIsResending(true);
    
    resendVerificationMutation.mutate(email, {
      onSuccess: (data) => {
        setIsResending(false);
        toast({
          title: "Verification Email Sent!",
          description: data.message,
          variant: "default",
        });
      },
      onError: (error) => {
        setIsResending(false);
        toast({
          title: "Failed to Resend",
          description: error.message || 'Failed to resend verification email',
          variant: "destructive",
        });
      }
    });
  }, [resendVerificationMutation, toast]);

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    // If both token and email are present in URL, automatically verify
    if (token && email && !hasAttemptedVerification) {
      handleVerification(email, token);
    }
  }, [searchParams, hasAttemptedVerification, handleVerification]);

  // Show verification result if token and email were in URL
  if (searchParams.get('token') && searchParams.get('email')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {verificationState === 'loading' && (
                <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
              )}
              {verificationState === 'success' && (
                <CheckCircle className="h-16 w-16 text-green-500" />
              )}
              {verificationState === 'error' && (
                <XCircle className="h-16 w-16 text-red-500" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {verificationState === 'loading' && 'Verifying Your Email...'}
              {verificationState === 'success' && 'Email Verified!'}
              {verificationState === 'error' && 'Verification Failed'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {verificationState === 'loading' && (
              <p className="text-gray-600">
                Please wait while we verify your email address.
              </p>
            )}
            
            {verificationState === 'success' && (
              <>
                <p className="text-gray-600">
                  Your email has been successfully verified! You can now log in to your account.
                </p>
                <p className="text-sm text-gray-500">
                  Redirecting to login page in 3 seconds...
                </p>
                <Button asChild className="w-full">
                  <Link href="/login">Go to Login Now</Link>
                </Button>
              </>
            )}
            
            {verificationState === 'error' && (
              <>
                <p className="text-red-600 mb-4">
                  {errorMessage}
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={() => handleResendVerification(searchParams.get('email') || '')}
                    disabled={isResending || !searchParams.get('email')}
                    className="w-full"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resending...
                      </>
                    ) : (
                      'Resend Verification Email'
                    )}
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/register">Try Registering Again</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/login">Go to Login</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show email verification instructions if no token/email in URL
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Mail className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-700">
            Check Your Email
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            Thanks for registering! A verification link has been sent to your
            email address. Please click the link to activate your account.
          </p>

          <div className="space-y-3">
            <Button asChild className="w-full bg-red-500 hover:bg-red-600">
              <Link href="https://mail.google.com" target="_blank">
                Open Gmail
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t space-y-4">
            <div className="text-sm text-gray-600">
              Didn't receive the email? Enter your email to resend:
            </div>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                className="w-full"
              />
              <Button 
                onClick={() => handleResendVerification(resendEmail)}
                disabled={isResending || !resendEmail || !/\S+@\S+\.\S+/.test(resendEmail)}
                variant="outline"
                className="w-full"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : (
                  'Resend Verification Email'
                )}
              </Button>
            </div>
            
            <Link href="/login" className="text-green-700 hover:underline block">
              Already verified? Go to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default VerifyEmailContent;
