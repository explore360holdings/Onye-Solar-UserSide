"use client"

import { useState } from "react"
import { Save, User, Store, CreditCard, Truck, Bell, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Add useToast import
import { useToast } from "@/hooks/use-toast"

export function Settings() {
  // Inside Settings function, add toast hook
  const { toast } = useToast()

  const [settings, setSettings] = useState({
    storeName: "SolarTech",
    storeEmail: "admin@solartech.com",
    storePhone: "+1 (800) SOLAR-TECH",
    storeAddress: "123 Solar Street, Green City, GC 12345",
    currency: "USD",
    timezone: "America/New_York",
    orderNotifications: true,
    stockAlerts: true,
    customerEmails: false,
    marketingEmails: true,
  })

  // Update handleSave to include toast
  const handleSave = () => {
    // TODO: Save settings to backend
    console.log("Settings saved:", settings)
    toast({
      title: "Settings Saved!",
      description: "Your changes have been successfully saved.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings & Configuration</h1>
          <p className="text-gray-600 mt-2">Manage your store settings and preferences</p>
        </div>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                Store Information
              </CardTitle>
              <CardDescription>Basic information about your solar business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="storeEmail">Store Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storePhone">Store Phone</Label>
                  <Input
                    id="storePhone"
                    value={settings.storePhone}
                    onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) => setSettings({ ...settings, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="storeAddress">Store Address</Label>
                <Textarea
                  id="storeAddress"
                  value={settings.storeAddress}
                  onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={settings.timezone}
                  onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (UTC-6)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (UTC-7)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (UTC-8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Gateways
              </CardTitle>
              <CardDescription>Configure your payment processing options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                      STRIPE
                    </div>
                    <div>
                      <p className="font-medium">Stripe</p>
                      <p className="text-sm text-gray-600">Credit cards, Apple Pay, Google Pay</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast({
                          title: "Configure Payment Gateway",
                          description: "Configuration modal for Stripe would open here.",
                        })
                      }
                    >
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">
                      PAYPAL
                    </div>
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-gray-600">PayPal payments and PayPal Credit</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast({
                          title: "Configure Payment Gateway",
                          description: "Configuration modal for Stripe would open here.",
                        })
                      }
                    >
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">
                      BANK
                    </div>
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-sm text-gray-600">Direct bank transfers and ACH</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast({
                          title: "Configure Payment Gateway",
                          description: "Configuration modal for Stripe would open here.",
                        })
                      }
                    >
                      Configure
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Shipping Configuration
              </CardTitle>
              <CardDescription>Set up shipping zones, rates, and methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-gray-600">Orders over $500</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast({ title: "Edit Shipping Method", description: "Editing shipping method details." })
                      }
                    >
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Standard Shipping</p>
                    <p className="text-sm text-gray-600">$49.99 - 5-7 business days</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast({ title: "Edit Shipping Method", description: "Editing shipping method details." })
                      }
                    >
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Express Shipping</p>
                    <p className="text-sm text-gray-600">$99.99 - 2-3 business days</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast({ title: "Edit Shipping Method", description: "Editing shipping method details." })
                      }
                    >
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Local Delivery</p>
                    <p className="text-sm text-gray-600">$25.00 - Same day within 50 miles</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast({ title: "Edit Shipping Method", description: "Editing shipping method details." })
                      }
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() =>
                    toast({
                      title: "Add Shipping Method",
                      description: "Form to add new shipping method would appear here.",
                    })
                  }
                >
                  Add New Shipping Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure when and how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order Notifications</p>
                    <p className="text-sm text-gray-600">Get notified when new orders are placed</p>
                  </div>
                  <Switch
                    checked={settings.orderNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, orderNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Stock Alerts</p>
                    <p className="text-sm text-gray-600">Alerts when products are running low</p>
                  </div>
                  <Switch
                    checked={settings.stockAlerts}
                    onCheckedChange={(checked) => setSettings({ ...settings, stockAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Customer Emails</p>
                    <p className="text-sm text-gray-600">Copy on all customer email communications</p>
                  </div>
                  <Switch
                    checked={settings.customerEmails}
                    onCheckedChange={(checked) => setSettings({ ...settings, customerEmails: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-gray-600">Updates about new features and promotions</p>
                  </div>
                  <Switch
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) => setSettings({ ...settings, marketingEmails: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Admin Users
              </CardTitle>
              <CardDescription>Manage administrator accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Admin User</p>
                      <p className="text-sm text-gray-600">admin@solartech.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Super Admin</span>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="bg-primary hover:bg-primary/90">Add New Admin User</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() =>
                      toast({ title: "Enable 2FA", description: "Two-Factor Authentication setup process initiated." })
                    }
                  >
                    Enable 2FA
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session Timeout</p>
                    <p className="text-sm text-gray-600">Automatically log out after inactivity</p>
                  </div>
                  <Select defaultValue="60">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Login Attempts</p>
                    <p className="text-sm text-gray-600">Block account after failed login attempts</p>
                  </div>
                  <Select defaultValue="5">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="10">10 attempts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    className="mr-2 bg-transparent"
                    onClick={() =>
                      toast({ title: "Change Password", description: "Password change form would open here." })
                    }
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      toast({ title: "View Activity Log", description: "Displaying account activity log." })
                    }
                  >
                    View Activity Log
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
