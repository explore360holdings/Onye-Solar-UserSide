"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RefreshCw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-red-700">
      <div className="text-center text-white">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4">Something went wrong!</h1>
          <p className="text-xl text-white/80 mb-8">
            An unexpected error occurred. Please try again.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={reset}
            className="bg-white text-red-600 hover:bg-white/90"
          >
            <RefreshCw className="mr-2 w-4 h-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button className="bg-accent text-black hover:bg-accent/90">
              <Home className="mr-2 w-4 h-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 