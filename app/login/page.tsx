"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useLogin } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const router = useRouter();
  const { mutate, isPending, isError, error, isSuccess } = useLogin();

  useEffect(() => {
    if (isSuccess) {
      router.push("/account");
    }
  }, [isSuccess, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLocalError("");

    if (!email || !password) {
      setLocalError("Email and password are required.");
      return; 
    }
    mutate({ email, password });
  }

  const displayError = localError || (isError && (error as Error).message);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          {/* <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">

            {/* <span className="text-white font-bold text-2xl">S</span> */}
          {/* </div> */} 
          <Image src="/images/Onye-Solar_Logo.png" alt="Onye-Solar Logo"
          width={80} height={80}
          />
          <h1 className="text-2xl font-bold mt-4 text-green-700">
            Sign In to Onye-Solar
          </h1>
          <p className="text-gray-500 mt-2 text-center">
            Enter your credentials to access your account.
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md w-full space-y-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {displayError && (
              <div className="text-red-600 text-sm">{displayError}</div>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
            <div className="flex justify-between text-sm mt-2">
              <Link href="/forgot-password" className="text-green-700 hover:underline">
                Forgot password?
              </Link>
              <Link href="/register" className="text-green-700 hover:underline">
                Create account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}