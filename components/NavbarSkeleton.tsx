// File: /components/NavbarSkeleton.tsx

import Link from "next/link";
import Image from "next/image";
import { Menu, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";

export function NavbarSkeleton() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/Onye-Solar_Logo.png"
              alt="Onye-Solar Logo"
              width={60}
              height={60}
            />
            {/* <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"><span className="text-white font-bold text-lg">S</span></div>
                        <span className="font-bold text-xl text-primary">SolarTech</span> */}
          </Link>
          {/* Desktop Links Placeholder */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="h-4 w-12 bg-gray-200 rounded-md" />
            <div className="h-4 w-12 bg-gray-200 rounded-md" />
            <div className="h-4 w-16 bg-gray-200 rounded-md" />
            <div className="h-4 w-20 bg-gray-200 rounded-md" />
          </div>
          {/* Actions Placeholder */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="h-9 w-36 bg-gray-200 rounded-md" />
            <div className="h-9 w-24 bg-gray-200 rounded-md" />
          </div>
          {/* Mobile Placeholder */}
          <div className="md:hidden flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <ShoppingCart className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
