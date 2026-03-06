"use client"

import { TrendingUp, DollarSign, Users, Package, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Add useToast import
import { useToast } from "@/hooks/use-toast"

export function Analytics() {
  // Inside Analytics function, add toast hook
  const { toast } = useToast()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-2">Comprehensive insights into your solar business performance</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          {/* Update "Export Report" button onClick handler */}
          <Button
            variant="outline"
            onClick={() =>
              toast({ title: "Export Report", description: "Analytics report is being prepared for export." })
            }
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <DollarSign className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">$284,750</div>
            <div className="text-sm text-green-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              +18.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Orders Completed</CardDescription>
            <Package className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">1,247</div>
            <div className="text-sm text-green-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12.3% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>New Customers</CardDescription>
            <Users className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">89</div>
            <div className="text-sm text-green-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8.7% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Avg. Order Value</CardDescription>
            <DollarSign className="w-5 h-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">$2,284</div>
            <div className="text-sm text-green-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              +5.2% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>Revenue trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Sales Chart</p>
                <p className="text-sm text-gray-400">Interactive revenue chart would be rendered here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">SolarMax Pro 400W Panel</p>
                  <p className="text-sm text-gray-600">45 units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">$13,455</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "90%" }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">PowerTech 3000W Inverter</p>
                  <p className="text-sm text-gray-600">23 units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">$13,777</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">EcoSolar 200Ah Battery</p>
                  <p className="text-sm text-gray-600">18 units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">$16,182</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">GreenEnergy MPPT Controller</p>
                  <p className="text-sm text-gray-600">34 units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">$6,766</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Demographics</CardTitle>
            <CardDescription>Customer distribution by location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">California</span>
                <span className="text-sm text-gray-600">34%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "34%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Texas</span>
                <span className="text-sm text-gray-600">28%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "28%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Florida</span>
                <span className="text-sm text-gray-600">18%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "18%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Other States</span>
                <span className="text-sm text-gray-600">20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "20%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Status */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Stock levels and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">In Stock</p>
                  <p className="text-sm text-gray-600">127 products</p>
                </div>
                <div className="text-2xl font-bold text-green-600">89%</div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Low Stock</p>
                  <p className="text-sm text-gray-600">12 products</p>
                </div>
                <div className="text-2xl font-bold text-orange-600">8%</div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Out of Stock</p>
                  <p className="text-sm text-gray-600">4 products</p>
                </div>
                <div className="text-2xl font-bold text-red-600">3%</div>
              </div>

              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View Inventory Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Targets */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Targets</CardTitle>
            <CardDescription>Progress towards monthly goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Revenue Target</span>
                  <span className="text-sm text-gray-600">$284,750 / $300,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full" style={{ width: "95%" }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">95% completed</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Orders Target</span>
                  <span className="text-sm text-gray-600">1,247 / 1,500</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full" style={{ width: "83%" }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">83% completed</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">New Customers</span>
                  <span className="text-sm text-gray-600">89 / 120</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full" style={{ width: "74%" }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">74% completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
