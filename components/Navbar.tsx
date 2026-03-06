// File: /components/Navbar.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, User, LayoutDashboard, LogOutIcon } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { CartDrawer } from "@/components/CartDrawer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { NavbarSkeleton } from "./NavbarSkeleton"

import { useCart } from "@/hooks/useCart"
import { useAuthStore } from "@/components/store/authStore"
import { useUser } from "@/hooks/account"
import { useLogout } from "@/hooks/useAuth"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const { items } = useCart()
  const { token } = useAuthStore()
  // --- FIX: Destructure the logout function correctly ---
  const { logout } = useLogout();
  const { data: user } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  const isLoggedIn = !!token
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  if (!isClient) {
    return <NavbarSkeleton />
  }
  
  const UserNav = () => {
    if (!user) return <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8"><AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal"><div className="flex flex-col space-y-1"><p className="text-sm font-medium leading-none ">{user.name}</p><p className="text-xs leading-none text-muted-foreground">{user.email}</p></div></DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/account')}><LayoutDashboard className="mr-2 h-4 w-4 cursor-pointer" /><span>Dashboard</span></DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* --- FIX: Use the destructured 'logout' function here --- */}
          <DropdownMenuItem onClick={() => logout()} className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer"><LogOutIcon className="mr-2 h-4 w-4" /><span>Log out</span></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg py-2" : "bg-white py-2"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
                <Image src="/images/Onye-Solar_Logo.png" alt="Onye-Solar Logo" width={60} height={60} />
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className={`text-gray-700 hover:text-primary transition-colors pb-1 ${pathname === '/' ? 'border-b-2 border-primary text-primary' : ''}`}>Home</Link>
              <Link href="/products" className={`text-gray-700 hover:text-primary transition-colors pb-1 ${pathname === '/products' ? 'border-b-2 border-primary text-primary' : ''}`}>Products</Link>
              <Link href="/brand" className={`text-gray-700 hover:text-primary transition-colors pb-1 ${pathname === '/brand' ? 'border-b-2 border-primary text-primary' : ''}`}>Brand</Link>
              <Link href="/about" className={`text-gray-700 hover:text-primary transition-colors pb-1 ${pathname === '/about' ? 'border-b-2 border-primary text-primary' : ''}`}>About</Link>
              <Link href="/contact" className={`text-gray-700 hover:text-primary transition-colors pb-1 ${pathname === '/contact' ? 'border-b-2 border-primary text-primary' : ''}`}>Contact Us</Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? <UserNav /> : <Link href="/login"><Button variant="ghost" size="sm"><User className="w-4 h-4 mr-2" />Login / Register</Button></Link>}
              <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(true)} className="relative">
                <ShoppingCart className="w-4 h-4 mr-2" />Cart
                {isClient && cartItemCount > 0 && <span className="absolute -top-1 -right-1 bg-accent text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">{cartItemCount}</span>}
              </Button>
            </div>
            <div className="md:hidden flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(true)} className="relative">
                <ShoppingCart className="w-4 h-4" />
                {isClient && cartItemCount > 0 && <span className="absolute -top-1 -right-1 bg-accent text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">{cartItemCount}</span>}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</Button>
            </div>
          </div>
        </div>
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"} overflow-hidden bg-white border-t`}>
          <div className="px-4 py-4 space-y-4">
            <Link href="/" className={`block py-2 ${pathname === '/' ? 'text-primary font-semibold' : 'text-gray-700'}`} onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/products" className={`block py-2 ${pathname === '/products' ? 'text-primary font-semibold' : 'text-gray-700'}`} onClick={() => setIsOpen(false)}>Products</Link>
            <Link href="/brand" className={`block py-2 ${pathname === '/brand' ? 'text-primary font-semibold' : 'text-gray-700'}`} onClick={() => setIsOpen(false)}>Brand</Link>
            <Link href="/about" className={`block py-2 ${pathname === '/about' ? 'text-primary font-semibold' : 'text-gray-700'}`} onClick={() => setIsOpen(false)}>About</Link>
            <Link href="/contact" className={`block py-2 ${pathname === '/contact' ? 'text-primary font-semibold' : 'text-gray-700'}`} onClick={() => setIsOpen(false)}>Contact Us</Link>
            <Separator />
  
            {isLoggedIn ? (<><Link href="/account" className="block py-2 text-gray-700" onClick={() => setIsOpen(false)}>My Account</Link><button onClick={() => { logout(); setIsOpen(false); }} className="block w-full text-left py-2 text-red-500">Logout</button></>) : (<Link href="/login" className="block py-2 text-gray-700" onClick={() => setIsOpen(false)}>Login / Register</Link>)}
          </div>
        </div>
      </nav>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
