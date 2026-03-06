// File: /app/account/page.tsx
"use client";
import { useState, useEffect } from "react";
import {
  User as UserIcon,
  Package,
  MapPin,
  CreditCard,
  Heart,
  LogOut,
  LayoutDashboard,
  Eye,
  EyeOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

import {
  useUser,
  useUpdateProfile,
  useChangePassword,
  useOrders,
  useOrderDetails,
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  usePaymentMethods,
  useAddPaymentMethod,
  useUpdatePaymentMethod,
  useDeletePaymentMethod,
} from "@/hooks/account";
import { useLogout } from "@/hooks/useAuth";
import {
  User,
  Order,
  UserAddress,
  PaymentMethod,
  UpdateProfileData,
} from "@/components/types/auth";
import { useWishlist, WishlistItem } from "@/lib/wishlist-context";
import { useCart } from "@/hooks/useCart";

export default function AccountPage() {
  const [active, setActive] = useState("dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { data: user, isLoading, isError } = useUser();

  const { logout } = useLogout();

  function handleNav(key: string) {
    if (key === "logout") {
      setShowLogoutModal(true);
      return;
    }
    setActive(key);
  }

  function confirmLogout() {
    setShowLogoutModal(false);
    logout();
  }

  const NAV_ITEMS = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "orders", label: "Orders", icon: Package },
    { key: "addresses", label: "Addresses", icon: MapPin },
    { key: "payment", label: "Payment methods", icon: CreditCard },
    { key: "account", label: "Account details", icon: UserIcon },
    { key: "wishlist", label: "Wishlist", icon: Heart },
    { key: "logout", label: "Logout", icon: LogOut },
  ];

  if (isLoading)
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        Loading...
      </div>
    );
  if (isError || !user)
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center text-red-500">
        Error: Could not load user profile.
      </div>
    );

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-shrink-0 md:self-start md:sticky md:top-24">
            <div className="bg-white rounded-xl shadow p-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left font-medium ${active === item.key
                      ? "bg-green-100 text-green-700 shadow-sm"
                      : "hover:bg-green-50 hover:text-green-700 text-gray-700 hover:translate-x-1"
                    }`}
                  onClick={() => handleNav(item.key)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </div>
          </aside>
          <section className="flex-1 min-w-0">
            {active === "dashboard" && (
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  Hello <span className="text-green-700">{user.name}</span>
                </h1>
                <p className="text-gray-600 mb-6">
                  From your account dashboard you can view your recent orders,
                  manage your shipping and billing addresses, and edit your
                  password and account details.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AccountCard
                    icon={Package}
                    label="Orders"
                    onClick={() => setActive("orders")}
                  />
                  <AccountCard
                    icon={MapPin}
                    label="Addresses"
                    onClick={() => setActive("addresses")}
                  />
                  <AccountCard
                    icon={CreditCard}
                    label="Payment methods"
                    onClick={() => setActive("payment")}
                  />
                  <AccountCard
                    icon={UserIcon}
                    label="Account details"
                    onClick={() => setActive("account")}
                  />
                  <AccountCard
                    icon={Heart}
                    label="Wishlist"
                    onClick={() => setActive("wishlist")}
                  />
                  <AccountCard
                    icon={LogOut}
                    label="Logout"
                    onClick={() => handleNav("logout")}
                  />
                </div>
              </div>
            )}
            {active === "orders" && <OrdersScreen />}
            {active === "addresses" && <AddressesScreen />}
            {active === "payment" && <PaymentScreen />}
            {active === "account" && <AccountDetailsScreen user={user} />}
            {active === "wishlist" && <WishlistScreen />}
          </section>
        </div>
      </div>
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log out</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to log out?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmLogout}>
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AccountCard({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="flex flex-col items-center justify-center bg-white rounded-xl shadow p-6 hover:bg-green-50 transition-colors border border-transparent hover:border-green-200"
      onClick={onClick}
    >
      <Icon className="w-8 h-8 mb-2 text-gray-400" />
      <span className="font-medium text-gray-700">{label}</span>
    </button>
  );
}

function OrdersScreen() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const { data: orders, isLoading, isError, error } = useOrders();
  const { data: orderDetails } = useOrderDetails(selectedOrder);
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "new":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };
  if (isLoading)
    return <div className="text-gray-500 p-4">Loading orders...</div>;
  if (isError)
    return (
      <div className="text-red-500 p-4">
        Error loading orders: {(error as Error).message}
      </div>
    );
  if (!orders || orders.length === 0)
    return <div className="text-gray-500 p-4">You have no orders yet.</div>;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>View and track your recent orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold">
                      Order #{order._id.slice(-6)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ₦{order.totalAmount.toLocaleString()}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSelectedOrder(
                        selectedOrder === order._id ? null : order._id
                      )
                    }
                  >
                    <span className="mr-2">
                      {selectedOrder === order._id ? "Hide" : "View"} Details
                    </span>
                  </Button>
                </div>
              </div>
              {selectedOrder === order._id && orderDetails && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Order Items:</h4>
                    <div className="space-y-3">
                      {orderDetails.orderItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex gap-4 items-center border-b pb-3"
                        >
                          {item.product.image && (
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.qty} × ₦{item.product.price.toLocaleString()}
                            </p>
                          </div>
                          <p className="font-semibold">
                            ₦{item.price.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-3">
                    <div>
                      <h5 className="font-medium mb-2">Shipping Address:</h5>
                      <p className="text-sm text-gray-600">
                        {orderDetails.shippingAddress.street}<br />
                        {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}<br />
                        {orderDetails.shippingAddress.postalCode}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Payment:</h5>
                      <p className="text-sm text-gray-600">
                        Method: {orderDetails.paymentMethod}<br />
                        Status: {orderDetails.isPaid ? "Paid" : "Pending"}
                        {orderDetails.paidAt && <><br />Paid: {new Date(orderDetails.paidAt).toLocaleDateString()}</>}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AddressesScreen() {
  const [showModal, setShowModal] = useState(false);
  const [editAddress, setEditAddress] = useState<UserAddress | null>(null);
  const { data: addresses, isLoading, isError, error } = useAddresses();
  const { mutate: addAddress } = useAddAddress();
  const { mutate: updateAddress } = useUpdateAddress();
  const { mutate: deleteAddress } = useDeleteAddress();
  function handleEdit(address: UserAddress) {
    setEditAddress(address);
    setShowModal(true);
  }
  function handleAdd() {
    setEditAddress(null);
    setShowModal(true);
  }
  function handleSave(
    address: Omit<UserAddress, "_id" | "isDefault"> | UserAddress
  ) {
    if ("_id" in address) {
      updateAddress(address, { onSuccess: () => setShowModal(false) });
    } else {
      addAddress(address, { onSuccess: () => setShowModal(false) });
    }
  }
  function handleDelete(id: string) {
    deleteAddress(id);
  }
  if (isLoading)
    return <div className="text-gray-500 p-4">Loading addresses...</div>;
  if (isError)
    return (
      <div className="text-red-500 p-4">
        Error loading addresses: {(error as Error).message}
      </div>
    );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Addresses</CardTitle>
        <CardDescription>Manage your saved addresses</CardDescription>
      </CardHeader>
      <CardContent>
        {!addresses || addresses.length === 0 ? (
          <p className="text-gray-500 p-4">You have no saved addresses.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div key={address._id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{address.street}</h3>
                  {address.isDefault && (
                    <Badge variant="outline">Default</Badge>
                  )}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(address)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(address._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <Button className="mt-6" onClick={handleAdd}>
          Add New Address
        </Button>
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editAddress ? "Edit Address" : "Add Address"}
              </DialogTitle>
            </DialogHeader>
            <AddressForm
              address={editAddress}
              onSave={handleSave}
              onCancel={() => setShowModal(false)}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

type AddressFormData = Omit<UserAddress, "_id" | "isDefault">;
function AddressForm({
  address,
  onSave,
  onCancel,
}: {
  address: UserAddress | null;
  onSave: (a: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<AddressFormData>(
    address
      ? {
        street: address.street,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      }
      : { street: "", city: "", state: "", postalCode: "", country: "" }
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(address ? { ...form, _id: address._id } : form);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div>
        <Label htmlFor="street">Street Address</Label>
        <Input
          id="street"
          value={form.street}
          onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
          required
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            required
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={form.state}
            onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
            required
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            value={form.postalCode}
            onChange={(e) =>
              setForm((f) => ({ ...f, postalCode: e.target.value }))
            }
            required
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={form.country}
            onChange={(e) =>
              setForm((f) => ({ ...f, country: e.target.value }))
            }
            required
          />
        </div>
      </div>
      <DialogFooter className="pt-4">
        <Button type="submit">Save Address</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </DialogFooter>
    </form>
  );
}

function PaymentScreen() {
  const [showModal, setShowModal] = useState(false);
  const [editMethod, setEditMethod] = useState<PaymentMethod | null>(null);
  const { data: methods, isLoading, isError } = usePaymentMethods();
  const { mutate: addMethod } = useAddPaymentMethod();
  const { mutate: updateMethod } = useUpdatePaymentMethod();
  const { mutate: deleteMethod } = useDeletePaymentMethod();
  function handleEdit(method: PaymentMethod) {
    setEditMethod(method);
    setShowModal(true);
  }
  function handleAdd() {
    setEditMethod(null);
    setShowModal(true);
  }
  function handleSave(
    method: Omit<PaymentMethod, "id" | "isDefault"> | PaymentMethod
  ) {
    if ("id" in method) {
      updateMethod(method, { onSuccess: () => setShowModal(false) });
    } else {
      addMethod(method, { onSuccess: () => setShowModal(false) });
    }
  }
  function handleDelete(id: string) {
    deleteMethod(id);
  }
  if (isLoading)
    return <div className="text-gray-500 p-4">Loading payment methods...</div>;
  if (isError)
    return (
      <div className="text-red-500 p-4">Error loading payment methods.</div>
    );
  if (!methods || methods.length === 0)
    return (
      <div className="text-gray-500 p-4">
        You have no saved payment methods.
      </div>
    );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Manage your saved payment methods</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {methods.map((method) => (
            <div key={method.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">
                  {method.type} ending in {method.last4}
                </h3>
                {method.isDefault && <Badge variant="outline">Default</Badge>}
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Expires {method.exp}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(method)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(method.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-4" onClick={handleAdd}>
          Add New Payment Method
        </Button>
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editMethod ? "Edit Payment Method" : "Add Payment Method"}
              </DialogTitle>
            </DialogHeader>
            <PaymentForm
              method={editMethod}
              onSave={handleSave}
              onCancel={() => setShowModal(false)}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

type PaymentFormData = Omit<PaymentMethod, "id" | "isDefault">;
function PaymentForm({
  method,
  onSave,
  onCancel,
}: {
  method: PaymentMethod | null;
  onSave: (m: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<PaymentFormData>(
    method || { type: "Visa", last4: "", exp: "" }
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="pt-4">
        <Label>Card Type</Label>
        <Input
          value={form.type}
          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label>Last 4 Digits</Label>
        <Input
          value={form.last4}
          onChange={(e) => setForm((f) => ({ ...f, last4: e.target.value }))}
          required
          maxLength={4}
        />
      </div>
      <div>
        <Label>Expiry</Label>
        <Input
          value={form.exp}
          onChange={(e) => setForm((f) => ({ ...f, exp: e.target.value }))}
          required
          placeholder="MM/YY"
        />
      </div>
      <DialogFooter className="pt-4">
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </DialogFooter>
    </form>
  );
}

function AccountDetailsScreen({ user }: { user: User }) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<UpdateProfileData>({
    name: user.name,
    email: user.email,
  });
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  useEffect(() => {
    setForm({ name: user.name, email: user.email });
  }, [user]);
  function handleSave(e: React.FormEvent) {
    e.preventDefault();

    // Only save if we're in editing mode
    if (!isEditing) {
      return;
    }

    updateProfile(form, {
      onSuccess: () => {
        setIsEditing(false);
        toast({
          title: "Profile updated!",
          description: "Your details have been saved.",
        });
      },
      onError: (err: any) => {
        toast({
          title: "Update failed",
          description: err.message,
          variant: "destructive",
        });
      },
    });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
        <CardDescription>
          View and update your account information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSave}>
          <div>
            <Label>Full Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              disabled={!isEditing || isPending}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              disabled={!isEditing || isPending}
            />
          </div>
          <div className="flex gap-4">
            {isEditing ? (
              <>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </form>
        <Separator className="my-6" />
        <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
          Change Password
        </Button>
        <ChangePasswordModal
          open={showPasswordModal}
          onOpenChange={setShowPasswordModal}
        />
      </CardContent>
    </Card>
  );
}

function ChangePasswordModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { toast } = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutate: changePassword, isPending, reset } = useChangePassword();
  function handleChange(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!current || !next || !confirm) {
      setError("All fields are required.");
      return;
    }
    if (next.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    changePassword(
      { currentPassword: current, newPassword: next },
      {
        onSuccess: () => {
          toast({
            title: "Success!",
            description: "Password changed successfully.",
          });
          onOpenChange(false);
          reset();
          setCurrent("");
          setNext("");
          setConfirm("");
        },
        onError: (err: any) => {
          setError(err.message || "Failed to change password.");
        },
      }
    );
  }
  const handleCancel = () => {
    onOpenChange(false);
    reset();
    setError("");
    setCurrent("");
    setNext("");
    setConfirm("");
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form className="space-y-4 pt-4" onSubmit={handleChange}>
          <div className="relative space-y-2">
            <Label>Current Password</Label>
            <Input
              type={showCurrent ? "text" : "password"}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute bottom-2 right-3 text-gray-400 hover:text-gray-600"
            >
              {showCurrent ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="relative space-y-2">
            <Label>New Password</Label>
            <Input
              type={showNext ? "text" : "password"}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowNext(!showNext)}
              className="absolute bottom-2 right-3 text-gray-400 hover:text-gray-600"
            >
              {showNext ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="relative space-y-2">
            <Label>Confirm New Password</Label>
            <Input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute bottom-2 right-3 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function WishlistScreen() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();
  function handleAddToCart(item: WishlistItem) {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    });
    toast({
      title: "Added to cart",
      description: `${item.name} has been moved from your wishlist to your cart.`,
    });
    removeFromWishlist(item.id);
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Wishlist</CardTitle>
        <CardDescription>
          Your saved products for future purchase
        </CardDescription>
      </CardHeader>
      <CardContent>
        {wishlist.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold">Your wishlist is empty.</h3>
            <p>Add products you love to your wishlist to keep track of them.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 flex flex-col gap-2"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded object-cover"
                  />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-gray-600">
                      ₦{item.price.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-auto pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// // File: /app/account/page.tsx
// "use client"
// import { useState, useEffect } from "react"
// import { User as UserIcon, Package, MapPin, CreditCard, Heart, LogOut, LayoutDashboard, Eye, EyeOff } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { useToast } from "@/hooks/use-toast"
// import Image from "next/image"

// import {
//     useUser, useUpdateProfile, useChangePassword,
//     useOrders,
//     useAddresses, useAddAddress, useUpdateAddress, useDeleteAddress,
//     usePaymentMethods, useAddPaymentMethod, useUpdatePaymentMethod, useDeletePaymentMethod
// } from '@/hooks/account';
// import { useLogout } from "@/hooks/useAuth";
// import { User, Order, UserAddress, PaymentMethod, UpdateProfileData } from '@/components/types/auth';
// import { useWishlist, WishlistItem } from '@/lib/wishlist-context';
// import { useCart } from "@/hooks/useCart"

// export default function AccountPage() {
//     const [active, setActive] = useState("dashboard")
//     const [showLogoutModal, setShowLogoutModal] = useState(false)
//     const { data: user, isLoading, isError } = useUser();
//     const { logout } = useLogout();

//     function handleNav(key: string) {
//         if (key === "logout") {
//             setShowLogoutModal(true);
//             return;
//         }
//         setActive(key);
//     }

//     function confirmLogout() {
//         setShowLogoutModal(false);
//         logout();
//     }

//     const NAV_ITEMS = [ { key: "dashboard", label: "Dashboard", icon: LayoutDashboard }, { key: "orders", label: "Orders", icon: Package }, { key: "addresses", label: "Addresses", icon: MapPin }, { key: "payment", label: "Payment methods", icon: CreditCard }, { key: "account", label: "Account details", icon: UserIcon }, { key: "wishlist", label: "Wishlist", icon: Heart }, { key: "logout", label: "Logout", icon: LogOut }, ];

//     if (isLoading) return <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">Loading...</div>;
//     if (isError || !user) return <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center text-red-500">Error: Could not load user profile.</div>;

//     return (
//         <div className="min-h-screen pt-20 bg-gray-50">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 <div className="flex flex-col md:flex-row gap-8">
//                     <nav className="w-full md:w-64 flex-shrink-0 mb-6 md:mb-0">
//                         <ul className="bg-white rounded-xl shadow p-4 space-y-1">
//                             {NAV_ITEMS.map(item => (<li key={item.key}><button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left font-medium ${active === item.key ? "bg-green-100 text-green-700" : "hover:bg-gray-100 text-gray-700"}`} onClick={() => handleNav(item.key)}><item.icon className="w-5 h-5" />{item.label}</button></li>))}
//                         </ul>
//                     </nav>
//                     <section className="flex-1">
//                         {active === "dashboard" && <div><h1 className="text-2xl font-bold mb-2">Hello <span className="text-green-700">{user.name}</span></h1><p className="text-gray-600 mb-6">From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.</p><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><AccountCard icon={Package} label="Orders" onClick={() => setActive("orders")} /><AccountCard icon={MapPin} label="Addresses" onClick={() => setActive("addresses")} /><AccountCard icon={CreditCard} label="Payment methods" onClick={() => setActive("payment")} /><AccountCard icon={UserIcon} label="Account details" onClick={() => setActive("account")} /><AccountCard icon={Heart} label="Wishlist" onClick={() => setActive("wishlist")} /><AccountCard icon={LogOut} label="Logout" onClick={() => handleNav("logout")} /></div></div>}
//                         {active === "orders" && <OrdersScreen />}
//                         {active === "addresses" && <AddressesScreen />}
//                         {active === "payment" && <PaymentScreen />}
//                         {active === "account" && <AccountDetailsScreen user={user} />}
//                         {active === "wishlist" && <WishlistScreen />}
//                     </section>
//                 </div>
//             </div>
//             <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}><DialogContent><DialogHeader><DialogTitle>Log out</DialogTitle></DialogHeader><p>Are you sure you want to log out?</p><DialogFooter><Button variant="outline" onClick={() => setShowLogoutModal(false)}>Cancel</Button><Button variant="destructive" onClick={confirmLogout}>Log out</Button></DialogFooter></DialogContent></Dialog>
//         </div>
//     );
// }

// function AccountCard({ icon: Icon, label, onClick }: { icon: React.ElementType, label: string, onClick: () => void }) {
//     return (<button className="flex flex-col items-center justify-center bg-white rounded-xl shadow p-6 hover:bg-green-50 transition-colors border border-transparent hover:border-green-200" onClick={onClick}><Icon className="w-8 h-8 mb-2 text-gray-400" /><span className="font-medium text-gray-700">{label}</span></button>);
// }

// function OrdersScreen() {
//     const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
//     const { data: orders, isLoading, isError, error } = useOrders();
//     const getStatusColor = (status: string): string => { switch (status.toLowerCase()) { case "delivered": return "bg-green-100 text-green-800"; case "shipped": return "bg-blue-100 text-blue-800"; case "processing": return "bg-yellow-100 text-yellow-800"; case "new": return "bg-gray-100 text-gray-800"; default: return "bg-red-100 text-red-800"; } };
//     if (isLoading) return <div className="text-gray-500 p-4">Loading orders...</div>;
//     if (isError) return <div className="text-red-500 p-4">Error loading orders: {(error as Error).message}</div>;
//     if (!orders || orders.length === 0) return <div className="text-gray-500 p-4">You have no orders yet.</div>;
//     return (<Card><CardHeader><CardTitle>Order History</CardTitle><CardDescription>View and track your recent orders</CardDescription></CardHeader><CardContent><div className="space-y-4">{orders.map((order) => (<div key={order._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"><div className="flex items-center justify-between mb-3"><div className="flex items-center gap-4"><div><h3 className="font-semibold">Order #{order._id.slice(-6)}</h3><p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p></div><Badge className={getStatusColor(order.status)}>{order.status}</Badge></div><div className="text-right"><p className="font-semibold">₦{order.totalAmount.toLocaleString()}</p><Button variant="outline" size="sm" onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}><span className="mr-2">{selectedOrder === order._id ? "Hide" : "View"} Details</span></Button></div></div>{selectedOrder === order._id && (<div className="mt-4 pt-4 border-t"><h4 className="font-medium mb-3">Order Items:</h4><div className="space-y-2">{order.orderItems.map((item, idx) => (<div key={idx} className="flex justify-between items-center"><div><p className="font-medium">Product ID: {item.product}</p><p className="text-sm text-gray-600">Quantity: {item.qty}</p></div><p className="font-semibold">₦{item.price.toLocaleString()}</p></div>))}</div></div>)}</div>))}</div></CardContent></Card>);
// }

// function AddressesScreen() {
//     const [showModal, setShowModal] = useState(false);
//     const [editAddress, setEditAddress] = useState<UserAddress | null>(null);
//     const { data: addresses, isLoading, isError, error } = useAddresses();
//     const { mutate: addAddress } = useAddAddress();
//     const { mutate: updateAddress } = useUpdateAddress();
//     const { mutate: deleteAddress } = useDeleteAddress();
//     function handleEdit(address: UserAddress) { setEditAddress(address); setShowModal(true); }
//     function handleAdd() { setEditAddress(null); setShowModal(true); }
//     function handleSave(address: Omit<UserAddress, '_id' | 'isDefault'> | UserAddress) { if ('_id' in address) { updateAddress(address, { onSuccess: () => setShowModal(false) }); } else { addAddress(address, { onSuccess: () => setShowModal(false) }); } }
//     function handleDelete(id: string) { deleteAddress(id); }
//     if (isLoading) return <div className="text-gray-500 p-4">Loading addresses...</div>;
//     if (isError) return <div className="text-red-500 p-4">Error loading addresses: {(error as Error).message}</div>;
//     return (<Card><CardHeader><CardTitle>Addresses</CardTitle><CardDescription>Manage your saved addresses</CardDescription></CardHeader><CardContent>{!addresses || addresses.length === 0 ? (<p className="text-gray-500 p-4">You have no saved addresses.</p>) : (<div className="grid md:grid-cols-2 gap-4">{addresses.map((address) => (<div key={address._id} className="border rounded-lg p-4"><div className="flex items-center justify-between mb-2"><h3 className="font-semibold">{address.street}</h3>{address.isDefault && <Badge variant="outline">Default</Badge>}</div><div className="text-sm text-gray-600 space-y-1"><p>{address.city}, {address.state} {address.postalCode}</p><p>{address.country}</p></div><div className="flex gap-2 mt-4"><Button variant="outline" size="sm" onClick={() => handleEdit(address)}>Edit</Button><Button variant="outline" size="sm" onClick={() => handleDelete(address._id)}>Delete</Button></div></div>))}</div>)}<Button className="mt-6" onClick={handleAdd}>Add New Address</Button><Dialog open={showModal} onOpenChange={setShowModal}><DialogContent><DialogHeader><DialogTitle>{editAddress ? "Edit Address" : "Add Address"}</DialogTitle></DialogHeader><AddressForm address={editAddress} onSave={handleSave} onCancel={() => setShowModal(false)} /></DialogContent></Dialog></CardContent></Card>);
// }

// type AddressFormData = Omit<UserAddress, '_id' | 'isDefault'>;
// function AddressForm({ address, onSave, onCancel }: { address: UserAddress | null, onSave: (a: any) => void, onCancel: () => void }) {
//     const [form, setForm] = useState<AddressFormData>(address ? { street: address.street, city: address.city, state: address.state, postalCode: address.postalCode, country: address.country } : { street: "", city: "", state: "", postalCode: "", country: "" });
//     const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(address ? { ...form, _id: address._id } : form); };
//     return (
//         <form onSubmit={handleSubmit} className="space-y-4 pt-4">
//             <div><Label htmlFor="street">Street Address</Label><Input id="street" value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} required /></div>
//             <div className="flex gap-4"><div className="flex-1"><Label htmlFor="city">City</Label><Input id="city" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required /></div><div className="flex-1"><Label htmlFor="state">State</Label><Input id="state" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} required /></div></div>
//             <div className="flex gap-4"><div className="flex-1"><Label htmlFor="postalCode">Postal Code</Label><Input id="postalCode" value={form.postalCode} onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))} required /></div><div className="flex-1"><Label htmlFor="country">Country</Label><Input id="country" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} required /></div></div>
//             <DialogFooter className="pt-4"><Button type="submit">Save Address</Button><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button></DialogFooter>
//         </form>
//     );
// }

// function PaymentScreen() {
//     const [showModal, setShowModal] = useState(false);
//     const [editMethod, setEditMethod] = useState<PaymentMethod | null>(null);
//     const { data: methods, isLoading, isError } = usePaymentMethods();
//     const { mutate: addMethod } = useAddPaymentMethod();
//     const { mutate: updateMethod } = useUpdatePaymentMethod();
//     const { mutate: deleteMethod } = useDeletePaymentMethod();
//     function handleEdit(method: PaymentMethod) { setEditMethod(method); setShowModal(true); }
//     function handleAdd() { setEditMethod(null); setShowModal(true); }
//     function handleSave(method: Omit<PaymentMethod, 'id' | 'isDefault'> | PaymentMethod) { if ('id' in method) { updateMethod(method, { onSuccess: () => setShowModal(false) }); } else { addMethod(method, { onSuccess: () => setShowModal(false) }); } }
//     function handleDelete(id: string) { deleteMethod(id); }
//     if (isLoading) return <div className="text-gray-500 p-4">Loading payment methods...</div>;
//     if (isError) return <div className="text-red-500 p-4">Error loading payment methods.</div>;
//     if (!methods || methods.length === 0) return <div className="text-gray-500 p-4">You have no saved payment methods.</div>;
//     return (<Card><CardHeader><CardTitle>Payment Methods</CardTitle><CardDescription>Manage your saved payment methods</CardDescription></CardHeader><CardContent><div className="grid md:grid-cols-2 gap-4">{methods.map((method) => (<div key={method.id} className="border rounded-lg p-4"><div className="flex items-center justify-between mb-2"><h3 className="font-semibold">{method.type} ending in {method.last4}</h3>{method.isDefault && <Badge variant="outline">Default</Badge>}</div><div className="text-sm text-gray-600 space-y-1"><p>Expires {method.exp}</p></div><div className="flex gap-2 mt-4"><Button variant="outline" size="sm" onClick={() => handleEdit(method)}>Edit</Button><Button variant="outline" size="sm" onClick={() => handleDelete(method.id)}>Delete</Button></div></div>))}</div><Button className="mt-4" onClick={handleAdd}>Add New Payment Method</Button><Dialog open={showModal} onOpenChange={setShowModal}><DialogContent><DialogHeader><DialogTitle>{editMethod ? "Edit Payment Method" : "Add Payment Method"}</DialogTitle></DialogHeader><PaymentForm method={editMethod} onSave={handleSave} onCancel={() => setShowModal(false)} /></DialogContent></Dialog></CardContent></Card>);
// }

// type PaymentFormData = Omit<PaymentMethod, 'id' | 'isDefault'>;
// function PaymentForm({ method, onSave, onCancel }: { method: PaymentMethod | null, onSave: (m: any) => void, onCancel: () => void }) {
//     const [form, setForm] = useState<PaymentFormData>(method || { type: "Visa", last4: "", exp: "" });
//     const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(form); };
//     return (<form onSubmit={handleSubmit} className="space-y-4"><div className="pt-4"><Label>Card Type</Label><Input value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} required /></div><div><Label>Last 4 Digits</Label><Input value={form.last4} onChange={e => setForm(f => ({ ...f, last4: e.target.value }))} required maxLength={4} /></div><div><Label>Expiry</Label><Input value={form.exp} onChange={e => setForm(f => ({ ...f, exp: e.target.value }))} required placeholder="MM/YY" /></div><DialogFooter className="pt-4"><Button type="submit">Save</Button><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button></DialogFooter></form>);
// }

// function AccountDetailsScreen({ user }: { user: User }) {
//     const { toast } = useToast();
//     const [isEditing, setIsEditing] = useState(false);
//     const [form, setForm] = useState<UpdateProfileData>({ name: user.name, email: user.email, phone: user.phone || '', });
//     const { mutate: updateProfile, isPending } = useUpdateProfile();
//     const [showPasswordModal, setShowPasswordModal] = useState(false);
//     useEffect(() => { setForm({ name: user.name, email: user.email, phone: user.phone || '', }); }, [user]);
//     function handleSave(e: React.FormEvent) { e.preventDefault(); updateProfile(form, { onSuccess: () => { setIsEditing(false); toast({ title: "Profile updated!", description: "Your details have been saved." }); }, onError: (err: any) => { toast({ title: "Update failed", description: err.message, variant: "destructive" }); } }); }
//     return (
//         <Card>
//             <CardHeader><CardTitle>Account Details</CardTitle><CardDescription>View and update your account information</CardDescription></CardHeader>
//             <CardContent>
//                 <form className="space-y-4" onSubmit={handleSave}>
//                     <div><Label>Full Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} disabled={!isEditing || isPending} /></div>
//                     <div><Label>Email</Label><Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} disabled={!isEditing || isPending} /></div>
//                     <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} disabled={!isEditing || isPending} /></div>
//                     <div className="flex gap-4">{isEditing ? (<><Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Changes"}</Button><Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button></>) : (<Button type="button" onClick={() => setIsEditing(true)}>Edit Profile</Button>)}</div>
//                 </form>
//                 <Separator className="my-6" /><Button variant="outline" onClick={() => setShowPasswordModal(true)}>Change Password</Button>
//                 <ChangePasswordModal open={showPasswordModal} onOpenChange={setShowPasswordModal} />
//             </CardContent>
//         </Card>
//     );
// }

// function ChangePasswordModal({ open, onOpenChange }: { open: boolean, onOpenChange: (v: boolean) => void }) {
//     const { toast } = useToast();
//     const [current, setCurrent] = useState("");
//     const [next, setNext] = useState("");
//     const [confirm, setConfirm] = useState("");
//     const [error, setError] = useState("");
//     const [showCurrent, setShowCurrent] = useState(false);
//     const [showNext, setShowNext] = useState(false);
//     const [showConfirm, setShowConfirm] = useState(false);
//     const { mutate: changePassword, isPending, reset } = useChangePassword();

//     function handleChange(e: React.FormEvent) {
//         e.preventDefault();
//         setError("");
//         if (!current || !next || !confirm) { setError("All fields are required."); return; }
//         if (next.length < 6) { setError("New password must be at least 6 characters."); return; }
//         if (next !== confirm) { setError("New passwords do not match."); return; }
//         changePassword({ currentPassword: current, newPassword: next }, {
//             onSuccess: () => { toast({ title: "Success!", description: "Password changed successfully." }); onOpenChange(false); reset(); setCurrent(""); setNext(""); setConfirm(""); },
//             onError: (err: any) => { setError(err.message || "Failed to change password."); }
//         });
//     }

//     const handleCancel = () => { onOpenChange(false); reset(); setError(""); setCurrent(""); setNext(""); setConfirm(""); };

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent>
//                 <DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader>
//                 <form className="space-y-4 pt-4" onSubmit={handleChange}>
//                     <div className="relative space-y-2">
//                         <Label>Current Password</Label>
//                         <Input type={showCurrent ? "text" : "password"} value={current} onChange={e => setCurrent(e.target.value)} required autoFocus />
//                         <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute bottom-2 right-3 text-gray-400 hover:text-gray-600">{showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
//                     </div>
//                     <div className="relative space-y-2">
//                         <Label>New Password</Label>
//                         <Input type={showNext ? "text" : "password"} value={next} onChange={e => setNext(e.target.value)} required />
//                         <button type="button" onClick={() => setShowNext(!showNext)} className="absolute bottom-2 right-3 text-gray-400 hover:text-gray-600">{showNext ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
//                     </div>
//                     <div className="relative space-y-2">
//                         <Label>Confirm New Password</Label>
//                         <Input type={showConfirm ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)} required />
//                         <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute bottom-2 right-3 text-gray-400 hover:text-gray-600">{showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
//                     </div>
//                     {error && <div className="text-red-600 text-sm">{error}</div>}
//                     <DialogFooter className="pt-4"><Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button><Button type="submit" disabled={isPending}>{isPending ? "Changing..." : "Change Password"}</Button></DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// }

// function WishlistScreen() {
//     const { wishlist, removeFromWishlist } = useWishlist();
//     const { addItem } = useCart();
//     const { toast } = useToast();

//     function handleAddToCart(item: WishlistItem) {
//         addItem({
//             id: item.id,
//             name: item.name,
//             price: item.price,
//             image: item.image,
//             quantity: 1,
//         });
//         toast({
//             title: "Added to cart",
//             description: `${item.name} has been moved from your wishlist to your cart.`,
//         });
//         removeFromWishlist(item.id);
//     }

//     return (
//         <Card>
//             <CardHeader><CardTitle>My Wishlist</CardTitle><CardDescription>Your saved products for future purchase</CardDescription></CardHeader>
//             <CardContent>
//                 {wishlist.length === 0 ? (<div className="text-center text-gray-500 py-16"><Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" /><h3 className="text-lg font-semibold">Your wishlist is empty.</h3><p>Add products you love to your wishlist to keep track of them.</p></div>) : (
//                     <div className="grid md:grid-cols-2 gap-4">
//                         {wishlist.map((item) => (
//                             <div key={item.id} className="border rounded-lg p-4 flex flex-col gap-2">
//                                 <div className="flex items-center gap-4">
//                                     <Image src={item.image} alt={item.name} width={64} height={64} className="rounded object-cover" />
//                                     <div><div className="font-medium">{item.name}</div><div className="text-gray-600">₦{item.price.toLocaleString()}</div></div>
//                                 </div>
//                                 <div className="flex gap-2 mt-auto pt-2">
//                                     <Button variant="outline" size="sm" onClick={() => handleAddToCart(item)}>Add to Cart</Button>
//                                     <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => removeFromWishlist(item.id)}>Remove</Button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </CardContent>
//         </Card>
//     );
// }

// // // File: /app/account/page.tsx
// // "use client"
// // import { useState, useEffect } from "react"
// // import { User as UserIcon, Package, MapPin, CreditCard, Heart, LogOut, LayoutDashboard, Eye, EyeOff } from "lucide-react"

// // import { Button } from "@/components/ui/button"
// // import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { Badge } from "@/components/ui/badge"
// // import { Separator } from "@/components/ui/separator"
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// // import { useToast } from "@/hooks/use-toast"
// // import Image from "next/image"

// // import {
// //     useUser, useUpdateProfile, useChangePassword,
// //     useOrders,
// //     useAddresses, useAddAddress, useUpdateAddress, useDeleteAddress,
// //     usePaymentMethods, useAddPaymentMethod, useUpdatePaymentMethod, useDeletePaymentMethod
// // } from '@/hooks/account';
// // import { useLogout } from "@/hooks/useAuth";
// // import { User, Order, UserAddress, PaymentMethod, UpdateProfileData } from '@/components/types/auth';
// // import { useWishlist, WishlistItem } from '@/lib/wishlist-context';
// // import { useCart } from "@/hooks/useCart"

// // export default function AccountPage() {
// //     const [active, setActive] = useState("dashboard")
// //     const [showLogoutModal, setShowLogoutModal] = useState(false)
// //     const { data: user, isLoading, isError } = useUser();
// //     const { logout } = useLogout();

// //     function handleNav(key: string) {
// //         if (key === "logout") {
// //             setShowLogoutModal(true);
// //             return;
// //         }
// //         setActive(key);
// //     }

// //     function confirmLogout() {
// //         setShowLogoutModal(false);
// //         logout();
// //     }

// //     const NAV_ITEMS = [ { key: "dashboard", label: "Dashboard", icon: LayoutDashboard }, { key: "orders", label: "Orders", icon: Package }, { key: "addresses", label: "Addresses", icon: MapPin }, { key: "payment", label: "Payment methods", icon: CreditCard }, { key: "account", label: "Account details", icon: UserIcon }, { key: "wishlist", label: "Wishlist", icon: Heart }, { key: "logout", label: "Logout", icon: LogOut }, ];

// //     if (isLoading) return <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">Loading...</div>;
// //     if (isError || !user) return <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center text-red-500">Error: Could not load user profile.</div>;

// //     return (
// //         <div className="min-h-screen pt-20 bg-gray-50">
// //             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //                 <div className="flex flex-col md:flex-row gap-8">
// //                     <nav className="w-full md:w-64 flex-shrink-0 mb-6 md:mb-0">
// //                         <ul className="bg-white rounded-xl shadow p-4 space-y-1">
// //                             {NAV_ITEMS.map(item => (<li key={item.key}><button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left font-medium ${active === item.key ? "bg-green-100 text-green-700" : "hover:bg-gray-100 text-gray-700"}`} onClick={() => handleNav(item.key)}><item.icon className="w-5 h-5" />{item.label}</button></li>))}
// //                         </ul>
// //                     </nav>
// //                     <section className="flex-1">
// //                         {active === "dashboard" && <div><h1 className="text-2xl font-bold mb-2">Hello <span className="text-green-700">{user.name}</span></h1><p className="text-gray-600 mb-6">From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.</p><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><AccountCard icon={Package} label="Orders" onClick={() => setActive("orders")} /><AccountCard icon={MapPin} label="Addresses" onClick={() => setActive("addresses")} /><AccountCard icon={CreditCard} label="Payment methods" onClick={() => setActive("payment")} /><AccountCard icon={UserIcon} label="Account details" onClick={() => setActive("account")} /><AccountCard icon={Heart} label="Wishlist" onClick={() => setActive("wishlist")} /><AccountCard icon={LogOut} label="Logout" onClick={() => handleNav("logout")} /></div></div>}
// //                         {active === "orders" && <OrdersScreen />}
// //                         {active === "addresses" && <AddressesScreen />}
// //                         {active === "payment" && <PaymentScreen />}
// //                         {active === "account" && <AccountDetailsScreen user={user} />}
// //                         {active === "wishlist" && <WishlistScreen />}
// //                     </section>
// //                 </div>
// //             </div>
// //             <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}><DialogContent><DialogHeader><DialogTitle>Log out</DialogTitle></DialogHeader><p>Are you sure you want to log out?</p><DialogFooter><Button variant="outline" onClick={() => setShowLogoutModal(false)}>Cancel</Button><Button variant="destructive" onClick={confirmLogout}>Log out</Button></DialogFooter></DialogContent></Dialog>
// //         </div>
// //     );
// // }

// // function AccountCard({ icon: Icon, label, onClick }: { icon: React.ElementType, label: string, onClick: () => void }) {
// //     return (<button className="flex flex-col items-center justify-center bg-white rounded-xl shadow p-6 hover:bg-green-50 transition-colors border border-transparent hover:border-green-200" onClick={onClick}><Icon className="w-8 h-8 mb-2 text-gray-400" /><span className="font-medium text-gray-700">{label}</span></button>);
// // }

// // function OrdersScreen() {
// //     const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
// //     const { data: orders, isLoading, isError, error } = useOrders();
// //     const getStatusColor = (status: string): string => { switch (status.toLowerCase()) { case "delivered": return "bg-green-100 text-green-800"; case "shipped": return "bg-blue-100 text-blue-800"; case "processing": return "bg-yellow-100 text-yellow-800"; case "new": return "bg-gray-100 text-gray-800"; default: return "bg-red-100 text-red-800"; } };
// //     if (isLoading) return <div className="text-gray-500 p-4">Loading orders...</div>;
// //     if (isError) return <div className="text-red-500 p-4">Error loading orders: {(error as Error).message}</div>;
// //     if (!orders || orders.length === 0) return <div className="text-gray-500 p-4">You have no orders yet.</div>;
// //     return (<Card><CardHeader><CardTitle>Order History</CardTitle><CardDescription>View and track your recent orders</CardDescription></CardHeader><CardContent><div className="space-y-4">{orders.map((order) => (<div key={order._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"><div className="flex items-center justify-between mb-3"><div className="flex items-center gap-4"><div><h3 className="font-semibold">Order #{order._id.slice(-6)}</h3><p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p></div><Badge className={getStatusColor(order.status)}>{order.status}</Badge></div><div className="text-right"><p className="font-semibold">₦{order.totalAmount.toLocaleString()}</p><Button variant="outline" size="sm" onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}><span className="mr-2">{selectedOrder === order._id ? "Hide" : "View"} Details</span></Button></div></div>{selectedOrder === order._id && (<div className="mt-4 pt-4 border-t"><h4 className="font-medium mb-3">Order Items:</h4><div className="space-y-2">{order.orderItems.map((item, idx) => (<div key={idx} className="flex justify-between items-center"><div><p className="font-medium">Product ID: {item.product}</p><p className="text-sm text-gray-600">Quantity: {item.qty}</p></div><p className="font-semibold">₦{item.price.toLocaleString()}</p></div>))}</div></div>)}</div>))}</div></CardContent></Card>);
// // }

// // function AddressesScreen() {
// //     const [showModal, setShowModal] = useState(false);
// //     const [editAddress, setEditAddress] = useState<UserAddress | null>(null);
// //     const { data: addresses, isLoading, isError, error } = useAddresses();
// //     const { mutate: addAddress } = useAddAddress();
// //     const { mutate: updateAddress } = useUpdateAddress();
// //     const { mutate: deleteAddress } = useDeleteAddress();
// //     function handleEdit(address: UserAddress) { setEditAddress(address); setShowModal(true); }
// //     function handleAdd() { setEditAddress(null); setShowModal(true); }
// //     function handleSave(address: Omit<UserAddress, '_id' | 'isDefault'> | UserAddress) { if ('_id' in address) { updateAddress(address, { onSuccess: () => setShowModal(false) }); } else { addAddress(address, { onSuccess: () => setShowModal(false) }); } }
// //     function handleDelete(id: string) { deleteAddress(id); }
// //     if (isLoading) return <div className="text-gray-500 p-4">Loading addresses...</div>;
// //     if (isError) return <div className="text-red-500 p-4">Error loading addresses: {(error as Error).message}</div>;
// //     return (<Card><CardHeader><CardTitle>Addresses</CardTitle><CardDescription>Manage your saved addresses</CardDescription></CardHeader><CardContent>{!addresses || addresses.length === 0 ? (<p className="text-gray-500 p-4">You have no saved addresses.</p>) : (<div className="grid md:grid-cols-2 gap-4">{addresses.map((address) => (<div key={address._id} className="border rounded-lg p-4"><div className="flex items-center justify-between mb-2"><h3 className="font-semibold">{address.street}</h3>{address.isDefault && <Badge variant="outline">Default</Badge>}</div><div className="text-sm text-gray-600 space-y-1"><p>{address.city}, {address.state} {address.postalCode}</p><p>{address.country}</p></div><div className="flex gap-2 mt-4"><Button variant="outline" size="sm" onClick={() => handleEdit(address)}>Edit</Button><Button variant="outline" size="sm" onClick={() => handleDelete(address._id)}>Delete</Button></div></div>))}</div>)}<Button className="mt-6" onClick={handleAdd}>Add New Address</Button><Dialog open={showModal} onOpenChange={setShowModal}><DialogContent><DialogHeader><DialogTitle>{editAddress ? "Edit Address" : "Add Address"}</DialogTitle></DialogHeader><AddressForm address={editAddress} onSave={handleSave} onCancel={() => setShowModal(false)} /></DialogContent></Dialog></CardContent></Card>);
// // }

// // type AddressFormData = Omit<UserAddress, '_id' | 'isDefault'>;
// // function AddressForm({ address, onSave, onCancel }: { address: UserAddress | null, onSave: (a: any) => void, onCancel: () => void }) {
// //     const [form, setForm] = useState<AddressFormData>(address ? { street: address.street, city: address.city, state: address.state, postalCode: address.postalCode, country: address.country } : { street: "", city: "", state: "", postalCode: "", country: "" });
// //     const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(address ? { ...form, _id: address._id } : form); };
// //     return (
// //         <form onSubmit={handleSubmit} className="space-y-4 pt-4">
// //             <div><Label htmlFor="street">Street Address</Label><Input id="street" value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} required /></div>
// //             <div className="flex gap-4"><div className="flex-1"><Label htmlFor="city">City</Label><Input id="city" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required /></div><div className="flex-1"><Label htmlFor="state">State</Label><Input id="state" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} required /></div></div>
// //             <div className="flex gap-4"><div className="flex-1"><Label htmlFor="postalCode">Postal Code</Label><Input id="postalCode" value={form.postalCode} onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))} required /></div><div className="flex-1"><Label htmlFor="country">Country</Label><Input id="country" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} required /></div></div>
// //             <DialogFooter className="pt-4"><Button type="submit">Save Address</Button><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button></DialogFooter>
// //         </form>
// //     );
// // }

// // function PaymentScreen() {
// //     const [showModal, setShowModal] = useState(false);
// //     const [editMethod, setEditMethod] = useState<PaymentMethod | null>(null);
// //     const { data: methods, isLoading, isError } = usePaymentMethods();
// //     const { mutate: addMethod } = useAddPaymentMethod();
// //     const { mutate: updateMethod } = useUpdatePaymentMethod();
// //     const { mutate: deleteMethod } = useDeletePaymentMethod();
// //     function handleEdit(method: PaymentMethod) { setEditMethod(method); setShowModal(true); }
// //     function handleAdd() { setEditMethod(null); setShowModal(true); }
// //     function handleSave(method: Omit<PaymentMethod, 'id' | 'isDefault'> | PaymentMethod) { if ('id' in method) { updateMethod(method, { onSuccess: () => setShowModal(false) }); } else { addMethod(method, { onSuccess: () => setShowModal(false) }); } }
// //     function handleDelete(id: string) { deleteMethod(id); }
// //     if (isLoading) return <div className="text-gray-500 p-4">Loading payment methods...</div>;
// //     if (isError) return <div className="text-red-500 p-4">Error loading payment methods.</div>;
// //     if (!methods || methods.length === 0) return <div className="text-gray-500 p-4">You have no saved payment methods.</div>;
// //     return (<Card><CardHeader><CardTitle>Payment Methods</CardTitle><CardDescription>Manage your saved payment methods</CardDescription></CardHeader><CardContent><div className="grid md:grid-cols-2 gap-4">{methods.map((method) => (<div key={method.id} className="border rounded-lg p-4"><div className="flex items-center justify-between mb-2"><h3 className="font-semibold">{method.type} ending in {method.last4}</h3>{method.isDefault && <Badge variant="outline">Default</Badge>}</div><div className="text-sm text-gray-600 space-y-1"><p>Expires {method.exp}</p></div><div className="flex gap-2 mt-4"><Button variant="outline" size="sm" onClick={() => handleEdit(method)}>Edit</Button><Button variant="outline" size="sm" onClick={() => handleDelete(method.id)}>Delete</Button></div></div>))}</div><Button className="mt-4" onClick={handleAdd}>Add New Payment Method</Button><Dialog open={showModal} onOpenChange={setShowModal}><DialogContent><DialogHeader><DialogTitle>{editMethod ? "Edit Payment Method" : "Add Payment Method"}</DialogTitle></DialogHeader><PaymentForm method={editMethod} onSave={handleSave} onCancel={() => setShowModal(false)} /></DialogContent></Dialog></CardContent></Card>);
// // }

// // type PaymentFormData = Omit<PaymentMethod, 'id' | 'isDefault'>;
// // function PaymentForm({ method, onSave, onCancel }: { method: PaymentMethod | null, onSave: (m: any) => void, onCancel: () => void }) {
// //     const [form, setForm] = useState<PaymentFormData>(method || { type: "Visa", last4: "", exp: "" });
// //     const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(form); };
// //     return (<form onSubmit={handleSubmit} className="space-y-4"><div className="pt-4"><Label>Card Type</Label><Input value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} required /></div><div><Label>Last 4 Digits</Label><Input value={form.last4} onChange={e => setForm(f => ({ ...f, last4: e.target.value }))} required maxLength={4} /></div><div><Label>Expiry</Label><Input value={form.exp} onChange={e => setForm(f => ({ ...f, exp: e.target.value }))} required placeholder="MM/YY" /></div><DialogFooter className="pt-4"><Button type="submit">Save</Button><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button></DialogFooter></form>);
// // }

// // function AccountDetailsScreen({ user }: { user: User }) {
// //     const { toast } = useToast();
// //     const [isEditing, setIsEditing] = useState(false);
// //     const [form, setForm] = useState<UpdateProfileData>({ name: user.name, email: user.email, phone: user.phone || '', });
// //     const { mutate: updateProfile, isPending } = useUpdateProfile();
// //     const [showPasswordModal, setShowPasswordModal] = useState(false);
// //     useEffect(() => { setForm({ name: user.name, email: user.email, phone: user.phone || '', }); }, [user]);
// //     function handleSave(e: React.FormEvent) { e.preventDefault(); updateProfile(form, { onSuccess: () => { setIsEditing(false); toast({ title: "Profile updated!", description: "Your details have been saved." }); }, onError: (err: any) => { toast({ title: "Update failed", description: err.message, variant: "destructive" }); } }); }
// //     return (
// //         <Card>
// //             <CardHeader><CardTitle>Account Details</CardTitle><CardDescription>View and update your account information</CardDescription></CardHeader>
// //             <CardContent>
// //                 <form className="space-y-4" onSubmit={handleSave}>
// //                     <div><Label>Full Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} disabled={!isEditing || isPending} /></div>
// //                     <div><Label>Email</Label><Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} disabled={!isEditing || isPending} /></div>
// //                     <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} disabled={!isEditing || isPending} /></div>
// //                     <div className="flex gap-4">{isEditing ? (<><Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Changes"}</Button><Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button></>) : (<Button type="button" onClick={() => setIsEditing(true)}>Edit Profile</Button>)}</div>
// //                 </form>
// //                 <Separator className="my-6" /><Button variant="outline" onClick={() => setShowPasswordModal(true)}>Change Password</Button>
// //                 <ChangePasswordModal open={showPasswordModal} onOpenChange={setShowPasswordModal} />
// //             </CardContent>
// //         </Card>
// //     );
// // }

// // function ChangePasswordModal({ open, onOpenChange }: { open: boolean, onOpenChange: (v: boolean) => void }) {
// //     const { toast } = useToast();
// //     const [current, setCurrent] = useState("");
// //     const [next, setNext] = useState("");
// //     const [confirm, setConfirm] = useState("");
// //     const [error, setError] = useState("");
// //     const [showCurrent, setShowCurrent] = useState(false);
// //     const [showNext, setShowNext] = useState(false);
// //     const [showConfirm, setShowConfirm] = useState(false);
// //     const { mutate: changePassword, isPending, reset } = useChangePassword();

// //     function handleChange(e: React.FormEvent) {
// //         e.preventDefault();
// //         setError("");
// //         if (!current || !next || !confirm) { setError("All fields are required."); return; }
// //         if (next.length < 6) { setError("New password must be at least 6 characters."); return; }
// //         if (next !== confirm) { setError("New passwords do not match."); return; }
// //         changePassword({ currentPassword: current, newPassword: next }, {
// //             onSuccess: () => { toast({ title: "Success!", description: "Password changed successfully." }); onOpenChange(false); reset(); setCurrent(""); setNext(""); setConfirm(""); },
// //             onError: (err: any) => { setError(err.message || "Failed to change password."); }
// //         });
// //     }

// //     const handleCancel = () => { onOpenChange(false); reset(); setError(""); setCurrent(""); setNext(""); setConfirm(""); };

// //     return (
// //         <Dialog open={open} onOpenChange={onOpenChange}>
// //             <DialogContent>
// //                 <DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader>
// //                 <form className="space-y-4 pt-4" onSubmit={handleChange}>
// //                     <div className="relative space-y-2">
// //                         <Label>Current Password</Label>
// //                         <Input type={showCurrent ? "text" : "password"} value={current} onChange={e => setCurrent(e.target.value)} required autoFocus />
// //                         <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute bottom-2 right-3 text-gray-400 hover:text-gray-600">{showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
// //                     </div>
// //                     <div className="relative space-y-2">
// //                         <Label>New Password</Label>
// //                         <Input type={showNext ? "text" : "password"} value={next} onChange={e => setNext(e.target.value)} required />
// //                         <button type="button" onClick={() => setShowNext(!showNext)} className="absolute bottom-2 right-3 text-gray-400 hover:text-gray-600">{showNext ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
// //                     </div>
// //                     <div className="relative space-y-2">
// //                         <Label>Confirm New Password</Label>
// //                         <Input type={showConfirm ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)} required />
// //                         <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute bottom-2 right-3 text-gray-400 hover:text-gray-600">{showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
// //                     </div>
// //                     {error && <div className="text-red-600 text-sm">{error}</div>}
// //                     <DialogFooter className="pt-4"><Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button><Button type="submit" disabled={isPending}>{isPending ? "Changing..." : "Change Password"}</Button></DialogFooter>
// //                 </form>
// //             </DialogContent>
// //         </Dialog>
// //     );
// // }

// // function WishlistScreen() {
// //     const { wishlist, removeFromWishlist } = useWishlist();
// //     const { addItem } = useCart();
// //     const { toast } = useToast();

// //     function handleAddToCart(item: WishlistItem) {
// //         addItem({
// //             id: item.id,
// //             name: item.name,
// //             price: item.price,
// //             image: item.image,
// //             quantity: 1,
// //         });
// //         toast({
// //             title: "Added to cart",
// //             description: `${item.name} has been moved from your wishlist to your cart.`,
// //         });
// //         removeFromWishlist(item.id);
// //     }

// //     return (
// //         <Card>
// //             <CardHeader><CardTitle>My Wishlist</CardTitle><CardDescription>Your saved products for future purchase</CardDescription></CardHeader>
// //             <CardContent>
// //                 {wishlist.length === 0 ? (<div className="text-center text-gray-500 py-16"><Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" /><h3 className="text-lg font-semibold">Your wishlist is empty.</h3><p>Add products you love to your wishlist to keep track of them.</p></div>) : (
// //                     <div className="grid md:grid-cols-2 gap-4">
// //                         {wishlist.map((item) => (
// //                             <div key={item.id} className="border rounded-lg p-4 flex flex-col gap-2">
// //                                 <div className="flex items-center gap-4">
// //                                     <Image src={item.image} alt={item.name} width={64} height={64} className="rounded object-cover" />
// //                                     <div><div className="font-medium">{item.name}</div><div className="text-gray-600">₦{item.price.toLocaleString()}</div></div>
// //                                 </div>
// //                                 <div className="flex gap-2 mt-auto pt-2">
// //                                     <Button variant="outline" size="sm" onClick={() => handleAddToCart(item)}>Add to Cart</Button>
// //                                     <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => removeFromWishlist(item.id)}>Remove</Button>
// //                                 </div>
// //                             </div>
// //                         ))}
// //                     </div>
// //                 )}
// //             </CardContent>
// //         </Card>
// //     );
// // }
