"use client"

import { useState } from "react"
import { Search, Filter, Eye, Edit, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Add useToast import
import { useToast } from "@/hooks/use-toast"

const mockCustomers = [
  {
    id: "CUST-001",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    joinDate: "2023-08-15",
    totalOrders: 8,
    totalSpent: 4250,
    lastLogin: "2024-01-14",
    status: "active",
    location: "California, USA",
  },
  {
    id: "CUST-002",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 234-5678",
    joinDate: "2023-06-22",
    totalOrders: 12,
    totalSpent: 7850,
    lastLogin: "2024-01-13",
    status: "active",
    location: "Texas, USA",
  },
  {
    id: "CUST-003",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    phone: "+1 (555) 345-6789",
    joinDate: "2023-09-10",
    totalOrders: 3,
    totalSpent: 1680,
    lastLogin: "2023-12-28",
    status: "inactive",
    location: "New York, USA",
  },
  {
    id: "CUST-004",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1 (555) 456-7890",
    joinDate: "2024-01-05",
    totalOrders: 1,
    totalSpent: 599,
    lastLogin: "2024-01-12",
    status: "active",
    location: "Florida, USA",
  },
]

export function CustomersManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)

  // Inside CustomersManagement function, add toast hook
  const { toast } = useToast()

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`
  const formatDate = (date: string) => new Date(date).toLocaleDateString()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers Management</h1>
          <p className="text-gray-600 mt-2">Manage your customer base and relationships</p>
        </div>
        <div className="flex gap-2">
          {/* Update "Send Newsletter" button onClick handler */}
          <Button
            variant="outline"
            onClick={() =>
              toast({ title: "Send Newsletter", description: "Newsletter functionality would be triggered here." })
            }
          >
            <Mail className="w-4 h-4 mr-2" />
            Send Newsletter
          </Button>
          {/* Update "Export Data" button onClick handler */}
          <Button
            variant="outline"
            onClick={() =>
              toast({ title: "Export Customer Data", description: "Customer data is being prepared for export." })
            }
          >
            <Calendar className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">1,247</div>
            <p className="text-gray-600">Total Customers</p>
            <div className="text-sm text-green-600 mt-1">+12.5% from last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">892</div>
            <p className="text-gray-600">Active Customers</p>
            <div className="text-sm text-green-600 mt-1">+8.2% from last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">$2,847</div>
            <p className="text-gray-600">Avg. Order Value</p>
            <div className="text-sm text-green-600 mt-1">+3.1% from last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">94%</div>
            <p className="text-gray-600">Customer Satisfaction</p>
            <div className="text-sm text-green-600 mt-1">+1.2% from last month</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search customers by name, email, or ID..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {/* Update "Advanced Filters" button onClick handler */}
            <Button
              variant="outline"
              onClick={() =>
                toast({ title: "Advanced Filters", description: "Advanced filter options would appear here." })
              }
            >
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Customer ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name & Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Join Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Orders</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Total Spent</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <>
                    <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <span className="font-medium text-primary">{customer.id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-600">{customer.email}</p>
                          <p className="text-sm text-gray-500">{customer.phone}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{formatDate(customer.joinDate)}</td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">{customer.totalOrders}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-primary">{formatCurrency(customer.totalSpent)}</span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{formatDate(customer.lastLogin)}</td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={customer.status === "active" ? "default" : "secondary"}
                          className={
                            customer.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }
                        >
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCustomer(selectedCustomer === customer.id ? null : customer.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {/* Update "Edit" button onClick handler */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              toast({ title: "Edit Customer", description: `Editing customer ${customer.name}.` })
                            }
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {/* Update "Mail" button onClick handler */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              toast({ title: "Send Email", description: `Opening email client for ${customer.email}.` })
                            }
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {selectedCustomer === customer.id && (
                      <tr>
                        <td colSpan={8} className="py-4 px-4 bg-gray-50">
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Customer Profile</h4>
                            <div className="grid md:grid-cols-3 gap-4">
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Contact Information</h5>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <span className="font-medium">Location:</span> {customer.location}
                                  </p>
                                  <p>
                                    <span className="font-medium">Phone:</span> {customer.phone}
                                  </p>
                                  <p>
                                    <span className="font-medium">Email:</span> {customer.email}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Purchase History</h5>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <span className="font-medium">Total Orders:</span> {customer.totalOrders}
                                  </p>
                                  <p>
                                    <span className="font-medium">Total Spent:</span>{" "}
                                    {formatCurrency(customer.totalSpent)}
                                  </p>
                                  <p>
                                    <span className="font-medium">Avg Order:</span>{" "}
                                    {formatCurrency(customer.totalSpent / customer.totalOrders)}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Account Status</h5>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <span className="font-medium">Member Since:</span> {formatDate(customer.joinDate)}
                                  </p>
                                  <p>
                                    <span className="font-medium">Last Login:</span> {formatDate(customer.lastLogin)}
                                  </p>
                                  <p>
                                    <span className="font-medium">Status:</span>
                                    <Badge
                                      variant={customer.status === "active" ? "default" : "secondary"}
                                      className={`ml-2 ${customer.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                                    >
                                      {customer.status}
                                    </Badge>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                              {/* Update "View Order History" button onClick handler */}
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90"
                                onClick={() =>
                                  toast({
                                    title: "View Order History",
                                    description: `Viewing order history for ${customer.name}.`,
                                  })
                                }
                              >
                                View Order History
                              </Button>
                              {/* Update "Send Email" button onClick handler (inside expanded profile) */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  toast({ title: "Send Email", description: `Sending email to ${customer.name}.` })
                                }
                              >
                                Send Email
                              </Button>
                              {/* Update "Add Note" button onClick handler (inside expanded profile) */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  toast({ title: "Add Note", description: `Adding note to customer ${customer.name}.` })
                                }
                              >
                                Add Note
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
