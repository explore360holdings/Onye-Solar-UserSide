"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80">
      <div className="text-center text-white">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white/20">404</h1>
          <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
          <p className="text-xl text-white/80 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-accent text-black hover:bg-accent/90">
              <Home className="mr-2 w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-primary"
            onClick={handleGoBack}
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
} 