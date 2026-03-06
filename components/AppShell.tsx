"use client"
import React, { useState } from "react"
import { usePathname } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
// import { CategorySidebar } from "@/components/CategorySidebar"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/hooks/useCart"

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const pathname = usePathname()
  const isAuthPage = AUTH_ROUTES.includes(pathname)

  // Collapse sidebar handler
  const handleSidebarCollapse = () => setSidebarExpanded(false)

  if (isAuthPage) {
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <CartProvider>
      <Navbar />
      {sidebarExpanded && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={handleSidebarCollapse}
          aria-label="Close sidebar overlay"
        />
      )} 
      <main className="min-h-screen transition-all duration-300">{children}</main>
      <Footer />
      <Toaster />
    </CartProvider>
  )
} 