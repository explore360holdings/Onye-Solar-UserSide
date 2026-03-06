"use client"

import { TrendingUp, TrendingDown, Users, ShoppingCart, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const kpiData = [
  {
    title: "Total Sales Today",
    value: "$12,847",
    change: "+12.5%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "New Orders",
    value: "47",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Active Customers",
    value: "1,284",
    change: "+3.1%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Low Stock Items",
    value: "12",
    change: "-2 from yesterday",
    trend: "down",
    icon: AlertTriangle,
  },
]

const recentOrders = [
  { id: "ORD-2024-001", customer: "John Smith", total: "₦1,299", status: "shipped", time: "2 hours ago" },
  { id: "ORD-2024-002", customer: "Sarah Johnson", total: "₦849", status: "processing", time: "4 hours ago" },
  { id: "ORD-2024-003", customer: "Mike Chen", total: "₦2,156", status: "pending", time: "6 hours ago" },
  { id: "ORD-2024-004", customer: "Emily Davis", total: "₦599", status: "delivered", time: "8 hours ago" },
]

const topProducts = [
  { name: "SolarMax Pro 400W Panel", sold: 45, revenue: "$13,455" },
  { name: "PowerTech 3000W Inverter", sold: 23, revenue: "$13,777" },
  { name: "EcoSolar 200Ah Battery", sold: 18, revenue: "$16,182" },
  { name: "GreenEnergy MPPT Controller", sold: 34, revenue: "$6,766" },
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your solar business today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:okgrid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription className="text-sm font-medium">{kpi.title}</CardDescription>
                <Icon className={`w-5 h-5 ${kpi.trend === "up" ? "text-green-600" : "text-orange-500"}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
                <div
                  className={`text-sm flex items-center ${kpi.trend === "up" ? "text-green-600" : "text-orange-500"}`}
                >
                  {kpi.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {kpi.change}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart Placeholder */}
        <Card className="lg:col-span-2">
          
          <CardHeader>
            <CardTitle>Sales Trends</CardTitle>
            <CardDescription>Revenue over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Sales Chart Placeholder</p>
                <p className="text-sm text-gray-400">Interactive chart would be rendered here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Current order distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Processing</span>
                </div>
                <span className="font-medium">24</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Pending</span>
                </div>
                <span className="font-medium">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Shipped</span>
                </div>
                <span className="font-medium">18</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm">Delivered</span>
                </div>
                <span className="font-medium">31</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{order.total}</p>
                    <Badge
                      variant={order.status === "delivered" ? "default" : "secondary"}
                      className={
                        order.status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "pending"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-green-100 text-green-800"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performers this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sold} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
