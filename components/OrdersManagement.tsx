"use client"

import { useState } from "react"
import { Search, Filter, Eye, Edit, Truck, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const mockOrders = [
  {
    id: "ORD-2024-001",
    customer: "John Smith",
    email: "john@example.com",
    date: "2024-01-15",
    total: 1299,
    status: "shipped",
    items: 3,
    shippingAddress: "123 Main St, City, State 12345",
  },
  {
    id: "ORD-2024-002",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    date: "2024-01-14",
    total: 849,
    status: "processing",
    items: 2,
    shippingAddress: "456 Oak Ave, Town, State 67890",
  },
  {
    id: "ORD-2024-003",
    customer: "Mike Chen",
    email: "mike@example.com",
    date: "2024-01-13",
    total: 2156,
    status: "pending",
    items: 5,
    shippingAddress: "789 Pine Rd, Village, State 54321",
  },
  {
    id: "ORD-2024-004",
    customer: "Emily Davis",
    email: "emily@example.com",
    date: "2024-01-12",
    total: 599,
    status: "delivered",
    items: 1,
    shippingAddress: "321 Elm St, Borough, State 98765",
  },
]

export function OrdersManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-2">Manage and track customer orders</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              toast({ title: "Exporting Orders", description: "Orders data is being prepared for export." })
            }
          >
            <Calendar className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders by ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() =>
                toast({ title: "More Filters", description: "Advanced filter options would appear here." })
              }
            >
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Items</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <>
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <span className="font-medium text-primary">{order.id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.customer}</p>
                          <p className="text-sm text-gray-600">{order.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{order.date}</td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-gray-900">₦{order.total.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{order.items} items</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toast({ title: "Edit Order", description: `Editing order ${order.id}.` })}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              toast({ title: "Ship Order", description: `Initiating shipment for order ${order.id}.` })
                            }
                          >
                            <Truck className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {selectedOrder === order.id && (
                      <tr>
                        <td colSpan={7} className="py-4 px-4 bg-gray-50">
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Order Details</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Shipping Address</h5>
                                <p className="text-gray-600">{order.shippingAddress}</p>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Order Timeline</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Order Placed</span>
                                    <span className="text-gray-600">{order.date}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Current Status</span>
                                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90"
                                onClick={() =>
                                  toast({ title: "Status Updated", description: `Order ${order.id} status updated.` })
                                }
                              >
                                Update Status
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  toast({ title: "Add Note", description: `Adding note to order ${order.id}.` })
                                }
                              >
                                Add Note
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  toast({
                                    title: "Print Invoice",
                                    description: `Printing invoice for order ${order.id}.`,
                                  })
                                }
                              >
                                Print Invoice
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
