"use client"

import { Bell, Search, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface AdminHeaderProps {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
}

export function AdminHeader({ sidebarCollapsed, setSidebarCollapsed }: AdminHeaderProps) {
  const { toast } = useToast()

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 px-6 py-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="md:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search orders, products, customers..."
              className="pl-10 w-64 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="relative hover:bg-primary/10 hover:text-primary transition-all duration-200"
            onClick={() => toast({ title: "Notifications", description: "Displaying latest notifications." })}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </Button>

          <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="hidden md:block">
              <p className="font-medium text-gray-900">Admin User</p>
              <p className="text-sm text-gray-500">admin@solartech.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
