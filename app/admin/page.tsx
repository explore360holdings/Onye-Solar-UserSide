"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/AdminSidebar"
import { AdminHeader } from "@/components/AdminHeader"
import { DashboardOverview } from "@/components/DashboardOverview"
import { OrdersManagement } from "@/components/OrdersManagement"
import { ProductsManagement } from "@/components/ProductsManagement"
import { CustomersManagement } from "@/components/CustomersManagement"
import { Analytics } from "@/components/Analytics"
import { Settings } from "@/components/Settings"

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />
      case "orders":
        return <OrdersManagement />
      case "products":
        return <ProductsManagement />
      case "customers":
        return <CustomersManagement />
      case "analytics":
        return <Analytics />
      case "settings":
        return <Settings />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <AdminHeader sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />

        <main className="p-6">{renderActiveSection()}</main>
      </div>
    </div>
  )
}
