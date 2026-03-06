// File: /app/checkout/page.tsx
"use client";

import { useCheckout } from "@/hooks/useCheckout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const {
    items,
    total,
    shippingCost,
    finalTotal,
    billing,
    setBilling,
    shipping,
    setShipping,
    shipDiff,
    setShipDiff,
    error,
    isPending,
    handlePlaceOrder,
  } = useCheckout();

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Billing & Shipping Forms */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Billing Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" value={billing.firstName} onChange={e => setBilling(b => ({ ...b, firstName: e.target.value }))} /></div>
                  <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" value={billing.lastName} onChange={e => setBilling(b => ({ ...b, lastName: e.target.value }))} /></div>
                </div>
                <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={billing.email} onChange={e => setBilling(b => ({ ...b, email: e.target.value }))} /></div>
                <div><Label htmlFor="street">Street Address</Label><Input id="street" value={billing.street} onChange={e => setBilling(b => ({ ...b, street: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><Label htmlFor="city">City</Label><Input id="city" value={billing.city} onChange={e => setBilling(b => ({ ...b, city: e.target.value }))} /></div>
                    <div><Label htmlFor="state">State</Label><Input id="state" value={billing.state} onChange={e => setBilling(b => ({ ...b, state: e.target.value }))} /></div>
                </div>
                {/* --- FIX: ADDED THE MISSING POSTAL CODE INPUT --- */}
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" value={billing.postalCode} onChange={e => setBilling(b => ({ ...b, postalCode: e.target.value }))} />
                </div>
              </CardContent>
            </Card>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="shipDiff" checked={shipDiff} onCheckedChange={c => setShipDiff(Boolean(c))} />
              <Label htmlFor="shipDiff">Ship to a different address?</Label>
            </div>

            {shipDiff && (
                <Card>
                    <CardHeader><CardTitle>Shipping Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label htmlFor="shipFirstName">First Name</Label><Input id="shipFirstName" value={shipping.firstName} onChange={e => setShipping(s => ({ ...s, firstName: e.target.value }))} /></div>
                            <div><Label htmlFor="shipLastName">Last Name</Label><Input id="shipLastName" value={shipping.lastName} onChange={e => setShipping(s => ({ ...s, lastName: e.target.value }))} /></div>
                        </div>
                        <div><Label htmlFor="shipStreet">Street Address</Label><Input id="shipStreet" value={shipping.street} onChange={e => setShipping(s => ({ ...s, street: e.target.value }))} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label htmlFor="shipCity">City</Label><Input id="shipCity" value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} /></div>
                            <div><Label htmlFor="shipState">State</Label><Input id="shipState" value={shipping.state} onChange={e => setShipping(s => ({ ...s, state: e.target.value }))} /></div>
                        </div>
                        {/* --- FIX: ADDED THE MISSING POSTAL CODE INPUT FOR SHIPPING --- */}
                        <div>
                          <Label htmlFor="shipPostalCode">Postal Code</Label>
                          <Input id="shipPostalCode" value={shipping.postalCode} onChange={e => setShipping(s => ({ ...s, postalCode: e.target.value }))} />
                        </div>
                    </CardContent>
                </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Your Order</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {items.map(item => (<div key={item.id} className="flex items-center justify-between"><div className="flex items-center gap-4"><div className="relative w-16 h-16 rounded-lg overflow-hidden border"><Image src={item.image || ''} alt={item.name} fill className="object-cover" /></div><div><p className="font-semibold">{item.name}</p><p className="text-sm text-gray-600">Qty: {item.quantity}</p></div></div><p className="font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p></div>))}
                <Separator />
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>₦{total.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>₦{shippingCost.toLocaleString()}</span></div>
                <Separator />
                <div className="flex justify-between font-bold text-lg"><span className="text-gray-900">Total</span><span className="text-primary">₦{finalTotal.toLocaleString()}</span></div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isPending}>
                    {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : 'Proceed to Payment'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}



// // File: /app/checkout/page.tsx
// "use client";

// import { useCheckout } from "@/hooks/useCheckout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import Image from "next/image";
// import { Loader2 } from "lucide-react";

// export default function CheckoutPage() {
//   const {
//     items, total, shippingCost, finalTotal, billing, setBilling,
//     shipping, setShipping, shipDiff, setShipDiff, error, isPending, handlePlaceOrder,
//   } = useCheckout();

//   return (
//     <div className="min-h-screen pt-20 bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
//         <div className="grid lg:grid-cols-2 gap-12">
//           <div className="space-y-6">
//             <Card>
//               <CardHeader><CardTitle>Billing Details</CardTitle></CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" value={billing.firstName} onChange={e => setBilling(b => ({ ...b, firstName: e.target.value }))} /></div>
//                   <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" value={billing.lastName} onChange={e => setBilling(b => ({ ...b, lastName: e.target.value }))} /></div>
//                 </div>
//                 <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={billing.email} onChange={e => setBilling(b => ({ ...b, email: e.target.value }))} /></div>
//                 <div><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" value={billing.phone} onChange={e => setBilling(b => ({ ...b, phone: e.target.value }))} /></div>
                
//                 {/* --- FIX: The Label and Input now correctly use 'street' --- */}
//                 <div>
//                   <Label htmlFor="street">Street Address</Label>
//                   <Input id="street" value={billing.street} onChange={e => setBilling(b => ({ ...b, street: e.target.value }))} />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                     <div><Label htmlFor="city">City</Label><Input id="city" value={billing.city} onChange={e => setBilling(b => ({ ...b, city: e.target.value }))} /></div>
//                     <div><Label htmlFor="state">State</Label><Input id="state" value={billing.state} onChange={e => setBilling(b => ({ ...b, state: e.target.value }))} /></div>
//                 </div>
//               </CardContent>
//             </Card>
//             <div className="flex items-center space-x-2">
//               <Checkbox id="shipDiff" checked={shipDiff} onCheckedChange={c => setShipDiff(Boolean(c))} />
//               <Label htmlFor="shipDiff">Ship to a different address?</Label>
//             </div>
//             {shipDiff && (
//                 <Card>
//                     <CardHeader><CardTitle>Shipping Details</CardTitle></CardHeader>
//                     <CardContent className="space-y-4">
//                         <div className="grid grid-cols-2 gap-4">
//                             <div><Label htmlFor="shipFirstName">First Name</Label><Input id="shipFirstName" value={shipping.firstName} onChange={e => setShipping(s => ({ ...s, firstName: e.target.value }))} /></div>
//                             <div><Label htmlFor="shipLastName">Last Name</Label><Input id="shipLastName" value={shipping.lastName} onChange={e => setShipping(s => ({ ...s, lastName: e.target.value }))} /></div>
//                         </div>
//                         {/* --- FIX: The Shipping form also uses 'street' --- */}
//                         <div>
//                           <Label htmlFor="shipStreet">Street Address</Label>
//                           <Input id="shipStreet" value={shipping.street} onChange={e => setShipping(s => ({ ...s, street: e.target.value }))} />
//                         </div>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div><Label htmlFor="shipCity">City</Label><Input id="shipCity" value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} /></div>
//                             <div><Label htmlFor="shipState">State</Label><Input id="shipState" value={shipping.state} onChange={e => setShipping(s => ({ ...s, state: e.target.value }))} /></div>
//                         </div>
//                     </CardContent>
//                 </Card>
//             )}
//           </div>
//           <div className="space-y-6">
//             <Card>
//               <CardHeader><CardTitle>Your Order</CardTitle></CardHeader>
//               <CardContent className="space-y-4">
//                 {items.map(item => (<div key={item.id} className="flex items-center justify-between"><div className="flex items-center gap-4"><div className="relative w-16 h-16 rounded-lg overflow-hidden border"><Image src={item.image || ''} alt={item.name} fill className="object-cover" /></div><div><p className="font-semibold">{item.name}</p><p className="text-sm text-gray-600">Qty: {item.quantity}</p></div></div><p className="font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p></div>))}
//                 <Separator />
//                 <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>₦{total.toLocaleString()}</span></div>
//                 <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>₦{shippingCost.toLocaleString()}</span></div>
//                 <Separator />
//                 <div className="flex justify-between font-bold text-lg"><span className="text-gray-900">Total</span><span className="text-primary">₦{finalTotal.toLocaleString()}</span></div>
//                 {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//                 <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isPending}>
//                     {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : 'Proceed to Payment'}
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // / File: /app/checkout/page.tsx
// // "use client";

// // import { useCheckout } from "@/hooks/useCheckout";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Checkbox } from "@/components/ui/checkbox";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Separator } from "@/components/ui/separator";
// // import Image from "next/image";
// // import { Loader2 } from "lucide-react";

// // export default function CheckoutPage() {
// //   const {
// //     items,
// //     total,
// //     shippingCost,
// //     finalTotal,
// //     billing,
// //     setBilling,
// //     shipping,
// //     setShipping,
// //     shipDiff,
// //     setShipDiff,
// //     error,
// //     isPending,
// //     handlePlaceOrder,
// //   } = useCheckout();

// //   return (
// //     <div className="min-h-screen pt-20 bg-gray-50">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
// //         <div className="grid lg:grid-cols-2 gap-12">
// //           {/* Billing & Shipping Forms */}
// //           <div className="space-y-6">
// //             <Card>
// //               <CardHeader><CardTitle>Billing Details</CardTitle></CardHeader>
// //               <CardContent className="space-y-4">
// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" value={billing.firstName} onChange={e => setBilling(b => ({ ...b, firstName: e.target.value }))} /></div>
// //                   <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" value={billing.lastName} onChange={e => setBilling(b => ({ ...b, lastName: e.target.value }))} /></div>
// //                 </div>
// //                 <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={billing.email} onChange={e => setBilling(b => ({ ...b, email: e.target.value }))} /></div>
// //                 <div><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" value={billing.phone} onChange={e => setBilling(b => ({ ...b, phone: e.target.value }))} /></div>
                
// //                 {/* --- FIX: The Label and Input now correctly use 'street' --- */}
// //                 <div>
// //                   <Label htmlFor="street">Street Address</Label>
// //                   <Input 
// //                     id="street" 
// //                     value={billing.street} 
// //                     onChange={e => setBilling(b => ({ ...b, street: e.target.value }))} 
// //                   />
// //                 </div>

// //                 <div className="grid grid-cols-2 gap-4">
// //                     <div><Label htmlFor="city">City</Label><Input id="city" value={billing.city} onChange={e => setBilling(b => ({ ...b, city: e.target.value }))} /></div>
// //                     <div><Label htmlFor="state">State</Label><Input id="state" value={billing.state} onChange={e => setBilling(b => ({ ...b, state: e.target.value }))} /></div>
// //                 </div>
// //               </CardContent>
// //             </Card>
            
// //             <div className="flex items-center space-x-2">
// //               <Checkbox id="shipDiff" checked={shipDiff} onCheckedChange={c => setShipDiff(Boolean(c))} />
// //               <Label htmlFor="shipDiff">Ship to a different address?</Label>
// //             </div>

// //             {shipDiff && (
// //                 <Card>
// //                     <CardHeader><CardTitle>Shipping Details</CardTitle></CardHeader>
// //                     <CardContent className="space-y-4">
// //                         <div className="grid grid-cols-2 gap-4">
// //                             <div><Label htmlFor="shipFirstName">First Name</Label><Input id="shipFirstName" value={shipping.firstName} onChange={e => setShipping(s => ({ ...s, firstName: e.target.value }))} /></div>
// //                             <div><Label htmlFor="shipLastName">Last Name</Label><Input id="shipLastName" value={shipping.lastName} onChange={e => setShipping(s => ({ ...s, lastName: e.target.value }))} /></div>
// //                         </div>
// //                         {/* --- FIX: The Shipping form also uses 'street' --- */}
// //                         <div>
// //                           <Label htmlFor="shipStreet">Street Address</Label>
// //                           <Input 
// //                             id="shipStreet" 
// //                             value={shipping.street} 
// //                             onChange={e => setShipping(s => ({ ...s, street: e.target.value }))} 
// //                           />
// //                         </div>
// //                         <div className="grid grid-cols-2 gap-4">
// //                             <div><Label htmlFor="shipCity">City</Label><Input id="shipCity" value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} /></div>
// //                             <div><Label htmlFor="shipState">State</Label><Input id="shipState" value={shipping.state} onChange={e => setShipping(s => ({ ...s, state: e.target.value }))} /></div>
// //                         </div>
// //                     </CardContent>
// //                 </Card>
// //             )}
// //           </div>

// //           {/* Order Summary */}
// //           <div className="space-y-6">
// //             <Card>
// //               <CardHeader><CardTitle>Your Order</CardTitle></CardHeader>
// //               <CardContent className="space-y-4">
// //                 {items.map(item => (<div key={item.id} className="flex items-center justify-between"><div className="flex items-center gap-4"><div className="relative w-16 h-16 rounded-lg overflow-hidden border"><Image src={item.image || ''} alt={item.name} fill className="object-cover" /></div><div><p className="font-semibold">{item.name}</p><p className="text-sm text-gray-600">Qty: {item.quantity}</p></div></div><p className="font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p></div>))}
// //                 <Separator />
// //                 <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>₦{total.toLocaleString()}</span></div>
// //                 <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>₦{shippingCost.toLocaleString()}</span></div>
// //                 <Separator />
// //                 <div className="flex justify-between font-bold text-lg"><span className="text-gray-900">Total</span><span className="text-primary">₦{finalTotal.toLocaleString()}</span></div>
// //                 {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
// //                 <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isPending}>
// //                     {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : 'Proceed to Payment'}
// //                 </Button>
// //               </CardContent>
// //             </Card>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // // File: /app/checkout/page.tsx
// // // "use client";

// // // import { useCheckout } from "@/hooks/useCheckout";
// // // import { Button } from "@/components/ui/button";
// // // import { Input } from "@/components/ui/input";
// // // import { Label } from "@/components/ui/label";
// // // import { Checkbox } from "@/components/ui/checkbox";
// // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // // import { Separator } from "@/components/ui/separator";
// // // import Image from "next/image";
// // // import { Loader2 } from "lucide-react";

// // // export default function CheckoutPage() {
// // //   const {
// // //     items,
// // //     total,
// // //     shippingCost,
// // //     finalTotal,
// // //     billing,
// // //     setBilling,
// // //     // --- Import the shipping state handlers ---
// // //     shipping,
// // //     setShipping,
// // //     shipDiff,
// // //     setShipDiff,
// // //     error,
// // //     isPending,
// // //     handlePlaceOrder,
// // //   } = useCheckout();

// // //   return (
// // //     <div className="min-h-screen pt-20 bg-gray-50">
// // //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// // //         <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
// // //         <div className="grid lg:grid-cols-2 gap-12">
// // //           {/* Billing & Shipping Forms */}
// // //           <div className="space-y-6">
// // //             <Card>
// // //               <CardHeader><CardTitle>Billing Details</CardTitle></CardHeader>
// // //               <CardContent className="space-y-4">
// // //                 <div className="grid grid-cols-2 gap-4">
// // //                   <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" value={billing.firstName} onChange={e => setBilling(b => ({ ...b, firstName: e.target.value }))} /></div>
// // //                   <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" value={billing.lastName} onChange={e => setBilling(b => ({ ...b, lastName: e.target.value }))} /></div>
// // //                 </div>
// // //                 <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={billing.email} onChange={e => setBilling(b => ({ ...b, email: e.target.value }))} /></div>
// // //                 <div><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" value={billing.phone} onChange={e => setBilling(b => ({ ...b, phone: e.target.value }))} /></div>
// // //                 <div><Label htmlFor="address">Address</Label><Input id="address" value={billing.address} onChange={e => setBilling(b => ({ ...b, address: e.target.value }))} /></div>
// // //                 <div className="grid grid-cols-2 gap-4">
// // //                     <div><Label htmlFor="city">City</Label><Input id="city" value={billing.city} onChange={e => setBilling(b => ({ ...b, city: e.target.value }))} /></div>
// // //                     <div><Label htmlFor="state">State</Label><Input id="state" value={billing.state} onChange={e => setBilling(b => ({ ...b, state: e.target.value }))} /></div>
// // //                 </div>
// // //               </CardContent>
// // //             </Card>
            
// // //             <div className="flex items-center space-x-2">
// // //               <Checkbox id="shipDiff" checked={shipDiff} onCheckedChange={c => setShipDiff(Boolean(c))} />
// // //               <Label htmlFor="shipDiff">Ship to a different address?</Label>
// // //             </div>

// // //             {/* --- FIX: ADD THE FULL SHIPPING FORM HERE --- */}
// // //             {shipDiff && (
// // //                 <Card>
// // //                     <CardHeader><CardTitle>Shipping Details</CardTitle></CardHeader>
// // //                     <CardContent className="space-y-4">
// // //                         <div className="grid grid-cols-2 gap-4">
// // //                             <div><Label htmlFor="shipFirstName">First Name</Label><Input id="shipFirstName" value={shipping.firstName} onChange={e => setShipping(s => ({ ...s, firstName: e.target.value }))} /></div>
// // //                             <div><Label htmlFor="shipLastName">Last Name</Label><Input id="shipLastName" value={shipping.lastName} onChange={e => setShipping(s => ({ ...s, lastName: e.target.value }))} /></div>
// // //                         </div>
// // //                         <div><Label htmlFor="shipAddress">Address</Label><Input id="shipAddress" value={shipping.address} onChange={e => setShipping(s => ({ ...s, address: e.target.value }))} /></div>
// // //                         <div className="grid grid-cols-2 gap-4">
// // //                             <div><Label htmlFor="shipCity">City</Label><Input id="shipCity" value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} /></div>
// // //                             <div><Label htmlFor="shipState">State</Label><Input id="shipState" value={shipping.state} onChange={e => setShipping(s => ({ ...s, state: e.target.value }))} /></div>
// // //                         </div>
// // //                     </CardContent>
// // //                 </Card>
// // //             )}
// // //           </div>

// // //           {/* Order Summary */}
// // //           <div className="space-y-6">
// // //             <Card>
// // //               <CardHeader><CardTitle>Your Order</CardTitle></CardHeader>
// // //               <CardContent className="space-y-4">
// // //                 {items.map(item => (<div key={item.id} className="flex items-center justify-between"><div className="flex items-center gap-4"><div className="relative w-16 h-16 rounded-lg overflow-hidden border"><Image src={item.image || ''} alt={item.name} fill className="object-cover" /></div><div><p className="font-semibold">{item.name}</p><p className="text-sm text-gray-600">Qty: {item.quantity}</p></div></div><p className="font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p></div>))}
// // //                 <Separator />
// // //                 <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>₦{total.toLocaleString()}</span></div>
// // //                 <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>₦{shippingCost.toLocaleString()}</span></div>
// // //                 <Separator />
// // //                 <div className="flex justify-between font-bold text-lg"><span className="text-gray-900">Total</span><span className="text-primary">₦{finalTotal.toLocaleString()}</span></div>
// // //                 {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
// // //                 <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isPending}>
// // //                     {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : 'Proceed to Payment'}
// // //                 </Button>
// // //               </CardContent>
// // //             </Card>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }


// // // // // File: /app/checkout/page.tsx
// // // // "use client";

// // // // import { useCheckout } from "@/hooks/useCheckout";
// // // // import { Button } from "@/components/ui/button";
// // // // import { Input } from "@/components/ui/input";
// // // // import { Label } from "@/components/ui/label";
// // // // import { Checkbox } from "@/components/ui/checkbox";
// // // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // // // import { Separator } from "@/components/ui/separator";
// // // // import Image from "next/image";
// // // // import { Loader2 } from "lucide-react";

// // // // export default function CheckoutPage() {
// // // //   const {
// // // //     items,
// // // //     total,
// // // //     shippingCost,
// // // //     finalTotal,
// // // //     billing,
// // // //     setBilling,
// // // //     // --- Import the shipping state handlers ---
// // // //     shipping,
// // // //     setShipping,
// // // //     shipDiff,
// // // //     setShipDiff,
// // // //     error,
// // // //     isPending,
// // // //     handlePlaceOrder,
// // // //   } = useCheckout();

// // // //   return (
// // // //     <div className="min-h-screen pt-20 bg-gray-50">
// // // //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// // // //         <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
// // // //         <div className="grid lg:grid-cols-2 gap-12">
// // // //           {/* Billing & Shipping Forms */}
// // // //           <div className="space-y-6">
// // // //             <Card>
// // // //               <CardHeader><CardTitle>Billing Details</CardTitle></CardHeader>
// // // //               <CardContent className="space-y-4">
// // // //                 <div className="grid grid-cols-2 gap-4">
// // // //                   <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" value={billing.firstName} onChange={e => setBilling(b => ({ ...b, firstName: e.target.value }))} /></div>
// // // //                   <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" value={billing.lastName} onChange={e => setBilling(b => ({ ...b, lastName: e.target.value }))} /></div>
// // // //                 </div>
// // // //                 <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={billing.email} onChange={e => setBilling(b => ({ ...b, email: e.target.value }))} /></div>
// // // //                 <div><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" value={billing.phone} onChange={e => setBilling(b => ({ ...b, phone: e.target.value }))} /></div>
// // // //                 <div><Label htmlFor="address">Address</Label><Input id="address" value={billing.address} onChange={e => setBilling(b => ({ ...b, address: e.target.value }))} /></div>
// // // //                 <div className="grid grid-cols-2 gap-4">
// // // //                     <div><Label htmlFor="city">City</Label><Input id="city" value={billing.city} onChange={e => setBilling(b => ({ ...b, city: e.target.value }))} /></div>
// // // //                     <div><Label htmlFor="state">State</Label><Input id="state" value={billing.state} onChange={e => setBilling(b => ({ ...b, state: e.target.value }))} /></div>
// // // //                 </div>
// // // //               </CardContent>
// // // //             </Card>
            
// // // //             <div className="flex items-center space-x-2">
// // // //               <Checkbox id="shipDiff" checked={shipDiff} onCheckedChange={c => setShipDiff(Boolean(c))} />
// // // //               <Label htmlFor="shipDiff">Ship to a different address?</Label>
// // // //             </div>

// // // //             {/* --- FIX: ADD THE FULL SHIPPING FORM HERE --- */}
// // // //             {shipDiff && (
// // // //                 <Card>
// // // //                     <CardHeader><CardTitle>Shipping Details</CardTitle></CardHeader>
// // // //                     <CardContent className="space-y-4">
// // // //                         <div className="grid grid-cols-2 gap-4">
// // // //                             <div><Label htmlFor="shipFirstName">First Name</Label><Input id="shipFirstName" value={shipping.firstName} onChange={e => setShipping(s => ({ ...s, firstName: e.target.value }))} /></div>
// // // //                             <div><Label htmlFor="shipLastName">Last Name</Label><Input id="shipLastName" value={shipping.lastName} onChange={e => setShipping(s => ({ ...s, lastName: e.target.value }))} /></div>
// // // //                         </div>
// // // //                         <div><Label htmlFor="shipAddress">Address</Label><Input id="shipAddress" value={shipping.address} onChange={e => setShipping(s => ({ ...s, address: e.target.value }))} /></div>
// // // //                         <div className="grid grid-cols-2 gap-4">
// // // //                             <div><Label htmlFor="shipCity">City</Label><Input id="shipCity" value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} /></div>
// // // //                             <div><Label htmlFor="shipState">State</Label><Input id="shipState" value={shipping.state} onChange={e => setShipping(s => ({ ...s, state: e.target.value }))} /></div>
// // // //                         </div>
// // // //                     </CardContent>
// // // //                 </Card>
// // // //             )}
// // // //           </div>

// // // //           {/* Order Summary */}
// // // //           <div className="space-y-6">
// // // //             <Card>
// // // //               <CardHeader><CardTitle>Your Order</CardTitle></CardHeader>
// // // //               <CardContent className="space-y-4">
// // // //                 {items.map(item => (<div key={item.id} className="flex items-center justify-between"><div className="flex items-center gap-4"><div className="relative w-16 h-16 rounded-lg overflow-hidden border"><Image src={item.image || ''} alt={item.name} fill className="object-cover" /></div><div><p className="font-semibold">{item.name}</p><p className="text-sm text-gray-600">Qty: {item.quantity}</p></div></div><p className="font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p></div>))}
// // // //                 <Separator />
// // // //                 <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>₦{total.toLocaleString()}</span></div>
// // // //                 <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>₦{shippingCost.toLocaleString()}</span></div>
// // // //                 <Separator />
// // // //                 <div className="flex justify-between font-bold text-lg"><span className="text-gray-900">Total</span><span className="text-primary">₦{finalTotal.toLocaleString()}</span></div>
// // // //                 {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
// // // //                 <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isPending}>
// // // //                     {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : 'Proceed to Payment'}
// // // //                 </Button>
// // // //               </CardContent>
// // // //             </Card>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // // File: /app/checkout/page.tsx
// // // // "use client";

// // // // import { useCheckout } from "@/hooks/useCheckout";
// // // // import { Button } from "@/components/ui/button";
// // // // import { Input } from "@/components/ui/input";
// // // // import { Label } from "@/components/ui/label";
// // // // import { Checkbox } from "@/components/ui/checkbox";
// // // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // // // import { Separator } from "@/components/ui/separator";
// // // // import Image from "next/image";
// // // // import { Loader2 } from "lucide-react";

// // // // export default function CheckoutPage() {
// // // //   // The hook is now much simpler to use!
// // // //   const {
// // // //     items,
// // // //     total,
// // // //     shippingCost,
// // // //     finalTotal,
// // // //     billing,
// // // //     setBilling,
// // // //     shipDiff,
// // // //     setShipDiff,
// // // //     error,
// // // //     isPending,
// // // //     handlePlaceOrder, // We only need one handler function now
// // // //   } = useCheckout();

// // // //   // The 'confirm' and 'success' steps are now handled by the Paystack redirect
// // // //   // so we only need to render the main form.
// // // //   return (
// // // //     <div className="min-h-screen pt-20 bg-gray-50">
// // // //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// // // //         <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
// // // //         <div className="grid lg:grid-cols-2 gap-12">
// // // //           {/* Billing & Shipping Forms */}
// // // //           <div className="space-y-6">
// // // //             <Card>
// // // //               <CardHeader><CardTitle>Billing Details</CardTitle></CardHeader>
// // // //               <CardContent className="space-y-4">
// // // //                 <div className="grid grid-cols-2 gap-4">
// // // //                   <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" value={billing.firstName} onChange={e => setBilling(b => ({ ...b, firstName: e.target.value }))} /></div>
// // // //                   <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" value={billing.lastName} onChange={e => setBilling(b => ({ ...b, lastName: e.target.value }))} /></div>
// // // //                 </div>
// // // //                 <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={billing.email} onChange={e => setBilling(b => ({ ...b, email: e.target.value }))} /></div>
// // // //                 <div><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" value={billing.phone} onChange={e => setBilling(b => ({ ...b, phone: e.target.value }))} /></div>
// // // //                 <div><Label htmlFor="address">Address</Label><Input id="address" value={billing.address} onChange={e => setBilling(b => ({ ...b, address: e.target.value }))} /></div>
// // // //                 <div className="grid grid-cols-2 gap-4">
// // // //                     <div><Label htmlFor="city">City</Label><Input id="city" value={billing.city} onChange={e => setBilling(b => ({ ...b, city: e.target.value }))} /></div>
// // // //                     <div><Label htmlFor="state">State</Label><Input id="state" value={billing.state} onChange={e => setBilling(b => ({ ...b, state: e.target.value }))} /></div>
// // // //                 </div>
// // // //               </CardContent>
// // // //             </Card>
// // // //             <div className="flex items-center space-x-2">
// // // //               <Checkbox id="shipDiff" checked={shipDiff} onCheckedChange={c => setShipDiff(Boolean(c))} />
// // // //               <Label htmlFor="shipDiff">Ship to a different address?</Label>
// // // //             </div>
// // // //             {/* You can add the full shipping form here if needed */}
// // // //           </div>

// // // //           {/* Order Summary */}
// // // //           <div className="space-y-6">
// // // //             <Card>
// // // //               <CardHeader><CardTitle>Your Order</CardTitle></CardHeader>
// // // //               <CardContent className="space-y-4">
// // // //                 {items.map(item => (<div key={item.id} className="flex items-center justify-between"><div className="flex items-center gap-4"><div className="relative w-16 h-16 rounded-lg overflow-hidden border"><Image src={item.image || ''} alt={item.name} fill className="object-cover" /></div><div><p className="font-semibold">{item.name}</p><p className="text-sm text-gray-600">Qty: {item.quantity}</p></div></div><p className="font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p></div>))}
// // // //                 <Separator />
// // // //                 <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>₦{total.toLocaleString()}</span></div>
// // // //                 <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>₦{shippingCost.toLocaleString()}</span></div>
// // // //                 <Separator />
// // // //                 <div className="flex justify-between font-bold text-lg"><span className="text-gray-900">Total</span><span className="text-primary">₦{finalTotal.toLocaleString()}</span></div>
// // // //                 {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
// // // //                 {/* The button now calls the single handler */}
// // // //                 <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isPending}>
// // // //                     {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : 'Proceed to Payment'}
// // // //                 </Button>
// // // //               </CardContent>
// // // //             </Card>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // // // File: /app/checkout/page.tsx
// // // // // "use client";

// // // // // import { useCheckout } from "@/hooks/useCheckout";
// // // // // import { Button } from "@/components/ui/button";
// // // // // import { Input } from "@/components/ui/input";
// // // // // import { Label } from "@/components/ui/label";
// // // // // import { Checkbox } from "@/components/ui/checkbox";
// // // // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // // // // import { Separator } from "@/components/ui/separator";
// // // // // import Image from "next/image";
// // // // // import Link from "next/link";
// // // // // import { CheckCircle } from "lucide-react";

// // // // // export default function CheckoutPage() {
// // // // //   const {
// // // // //     items,
// // // // //     total,
// // // // //     shippingCost,
// // // // //     finalTotal,
// // // // //     step,
// // // // //     billing,
// // // // //     setBilling,
// // // // //     shipping,
// // // // //     setShipping,
// // // // //     shipDiff,
// // // // //     setShipDiff,
// // // // //     error,
// // // // //     orderNumber,
// // // // //     isPending,
// // // // //     handlePlaceOrder,
// // // // //     handlePayNow,
// // // // //     handleCancelOrder,
// // // // //   } = useCheckout();

// // // // //   if (step === 'success') {
// // // // //     return (
// // // // //       <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
// // // // //         <Card className="w-full max-w-lg text-center p-8">
// // // // //             <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
// // // // //             <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
// // // // //             <p className="text-gray-600 mb-4">Thank you for your purchase. Your order number is <span className="font-semibold text-primary">{orderNumber}</span>.</p>
// // // // //             <Link href="/account/orders"><Button>View My Orders</Button></Link>
// // // // //         </Card>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   if (step === 'confirm') {
// // // // //     return (
// // // // //         <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
// // // // //             <Card className="w-full max-w-2xl">
// // // // //                 <CardHeader>
// // // // //                     <CardTitle>Confirm Your Order</CardTitle>
// // // // //                 </CardHeader>
// // // // //                 <CardContent className="space-y-6">
// // // // //                     <p>Please review your order details below before proceeding to payment.</p>
// // // // //                     <div className="border rounded-lg p-4 space-y-2">
// // // // //                         <div className="flex justify-between"><span className="text-gray-600">Order Number:</span> <span className="font-semibold">{orderNumber}</span></div>
// // // // //                         <div className="flex justify-between"><span className="text-gray-600">Total Amount:</span> <span className="font-semibold text-primary text-lg">₦{finalTotal.toLocaleString()}</span></div>
// // // // //                     </div>
// // // // //                     <div className="flex justify-end gap-4">
// // // // //                         <Button variant="outline" onClick={handleCancelOrder}>Edit Order</Button>
// // // // //                         <Button onClick={handlePayNow} disabled={isPending}>
// // // // //                             {isPending ? 'Processing...' : 'Pay with Paystack'}
// // // // //                         </Button>
// // // // //                     </div>
// // // // //                 </CardContent>
// // // // //             </Card>
// // // // //         </div>
// // // // //     )
// // // // //   }

// // // // //   return (
// // // // //     <div className="min-h-screen pt-20 bg-gray-50">
// // // // //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// // // // //         <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
// // // // //         <div className="grid lg:grid-cols-2 gap-12">
// // // // //           <div className="space-y-6">
// // // // //             <Card>
// // // // //               <CardHeader><CardTitle>Billing Details</CardTitle></CardHeader>
// // // // //               <CardContent className="space-y-4">
// // // // //                 <div className="grid grid-cols-2 gap-4">
// // // // //                   <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" value={billing.firstName} onChange={e => setBilling(b => ({ ...b, firstName: e.target.value }))} /></div>
// // // // //                   <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" value={billing.lastName} onChange={e => setBilling(b => ({ ...b, lastName: e.target.value }))} /></div>
// // // // //                 </div>
// // // // //                 <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={billing.email} onChange={e => setBilling(b => ({ ...b, email: e.target.value }))} /></div>
// // // // //                 <div><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" value={billing.phone} onChange={e => setBilling(b => ({ ...b, phone: e.target.value }))} /></div>
// // // // //                 <div><Label htmlFor="address">Address</Label><Input id="address" value={billing.address} onChange={e => setBilling(b => ({ ...b, address: e.target.value }))} /></div>
// // // // //                 <div className="grid grid-cols-2 gap-4">
// // // // //                     <div><Label htmlFor="city">City</Label><Input id="city" value={billing.city} onChange={e => setBilling(b => ({ ...b, city: e.target.value }))} /></div>
// // // // //                     <div><Label htmlFor="state">State</Label><Input id="state" value={billing.state} onChange={e => setBilling(b => ({ ...b, state: e.target.value }))} /></div>
// // // // //                 </div>
// // // // //               </CardContent>
// // // // //             </Card>
// // // // //             <div className="flex items-center space-x-2">
// // // // //               <Checkbox id="shipDiff" checked={shipDiff} onCheckedChange={c => setShipDiff(Boolean(c))} />
// // // // //               <Label htmlFor="shipDiff">Ship to a different address?</Label>
// // // // //             </div>
// // // // //             {shipDiff && (<Card><CardHeader><CardTitle>Shipping Details</CardTitle></CardHeader><CardContent className="space-y-4">{/* Shipping form goes here */}</CardContent></Card>)}
// // // // //           </div>
// // // // //           <div className="space-y-6">
// // // // //             <Card>
// // // // //               <CardHeader><CardTitle>Your Order</CardTitle></CardHeader>
// // // // //               <CardContent className="space-y-4">
// // // // //                 {items.map(item => (<div key={item.id} className="flex items-center justify-between"><div className="flex items-center gap-4"><div className="relative w-16 h-16 rounded-lg overflow-hidden border"><Image src={item.image || ''} alt={item.name} fill className="object-cover" /></div><div><p className="font-semibold">{item.name}</p><p className="text-sm text-gray-600">Qty: {item.quantity}</p></div></div><p className="font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p></div>))}
// // // // //                 <Separator />
// // // // //                 <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>₦{total.toLocaleString()}</span></div>
// // // // //                 <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>₦{shippingCost.toLocaleString()}</span></div>
// // // // //                 <Separator />
// // // // //                 <div className="flex justify-between font-bold text-lg"><span className="text-gray-900">Total</span><span className="text-primary">₦{finalTotal.toLocaleString()}</span></div>
// // // // //                 {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
// // // // //                 <Button className="w-full" size="lg" onClick={handlePlaceOrder}>Place Order</Button>
// // // // //               </CardContent>
// // // // //             </Card>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // // // File: /app/checkout/page.tsx
// // // // // // "use client";

// // // // // // import { useCheckout } from "@/hooks/useCheckout";
// // // // // // import { Button } from "@/components/ui/button";
// // // // // // import { Input } from "@/components/ui/input";
// // // // // // import { Label } from "@/components/ui/label";
// // // // // // import { Checkbox } from "@/components/ui/checkbox";
// // // // // // import { Textarea } from "@/components/ui/textarea";
// // // // // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // // // // // import { Separator } from "@/components/ui/separator";
// // // // // // import Image from "next/image";
// // // // // // import Link from "next/link";
// // // // // // import { CheckCircle } from "lucide-react";

// // // // // // // This is the actual React Component that will be rendered for the page.
// // // // // // export default function CheckoutPage() {
// // // // // //   const {
// // // // // //     items,
// // // // // //     total,
// // // // // //     shippingCost,
// // // // // //     finalTotal,
// // // // // //     step,
// // // // // //     billing,
// // // // // //     setBilling,
// // // // // //     shipping,
// // // // // //     setShipping,
// // // // // //     shipDiff,
// // // // // //     setShipDiff,
// // // // // //     error,
// // // // // //     orderNumber,
// // // // // //     isPending,
// // // // // //     handlePlaceOrder,
// // // // // //     handlePayNow,
// // // // // //     handleCancelOrder,
// // // // // //   } = useCheckout();

// // // // // //   if (step === 'success') {
// // // // // //     return (
// // // // // //       <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
// // // // // //         <Card className="w-full max-w-lg text-center p-8">
// // // // // //             <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
// // // // // //             <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
// // // // // //             <p className="text-gray-600 mb-4">Thank you for your purchase. Your order number is <span className="font-semibold text-primary">{orderNumber}</span>.</p>
// // // // // //             <Link href="/account/orders"><Button>View My Orders</Button></Link>
// // // // // //         </Card>
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   if (step === 'confirm') {
// // // // // //     return (
// // // // // //         <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
// // // // // //             <Card className="w-full max-w-2xl">
// // // // // //                 <CardHeader>
// // // // // //                     <CardTitle>Confirm Your Order</CardTitle>
// // // // // //                 </CardHeader>
// // // // // //                 <CardContent className="space-y-6">
// // // // // //                     <p>Please review your order details below before proceeding to payment.</p>
// // // // // //                     <div className="border rounded-lg p-4 space-y-2">
// // // // // //                         <div className="flex justify-between"><span className="text-gray-600">Order Number:</span> <span className="font-semibold">{orderNumber}</span></div>
// // // // // //                         <div className="flex justify-between"><span className="text-gray-600">Total Amount:</span> <span className="font-semibold text-primary text-lg">${finalTotal.toLocaleString()}</span></div>
// // // // // //                     </div>
// // // // // //                     <div className="flex justify-end gap-4">
// // // // // //                         <Button variant="outline" onClick={handleCancelOrder}>Edit Order</Button>
// // // // // //                         <Button onClick={handlePayNow} disabled={isPending}>
// // // // // //                             {isPending ? 'Processing...' : 'Pay with Paystack'}
// // // // // //                         </Button>
// // // // // //                     </div>
// // // // // //                 </CardContent>
// // // // // //             </Card>
// // // // // //         </div>
// // // // // //     )
// // // // // //   }

// // // // // //   // The main checkout form
// // // // // //   return (
// // // // // //     <div className="min-h-screen pt-20 bg-gray-50">
// // // // // //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// // // // // //         <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
// // // // // //         <div className="grid lg:grid-cols-2 gap-12">
// // // // // //           {/* Billing & Shipping Forms */}
// // // // // //           <div className="space-y-6">
// // // // // //             <Card>
// // // // // //               <CardHeader><CardTitle>Billing Details</CardTitle></CardHeader>
// // // // // //               <CardContent className="space-y-4">
// // // // // //                 {/* Form fields for billing */}
// // // // // //                 <div className="grid grid-cols-2 gap-4">
// // // // // //                   <div><Label>First Name</Label><Input value={billing.firstName} onChange={e => setBilling(b => ({ ...b, firstName: e.target.value }))} /></div>
// // // // // //                   <div><Label>Last Name</Label><Input value={billing.lastName} onChange={e => setBilling(b => ({ ...b, lastName: e.target.value }))} /></div>
// // // // // //                 </div>
// // // // // //                 <div><Label>Email</Label><Input type="email" value={billing.email} onChange={e => setBilling(b => ({ ...b, email: e.target.value }))} /></div>
// // // // // //                 <div><Label>Phone</Label><Input type="tel" value={billing.phone} onChange={e => setBilling(b => ({ ...b, phone: e.target.value }))} /></div>
// // // // // //                 <div><Label>Address</Label><Input value={billing.address} onChange={e => setBilling(b => ({ ...b, address: e.target.value }))} /></div>
// // // // // //               </CardContent>
// // // // // //             </Card>
            
// // // // // //             <div className="flex items-center space-x-2">
// // // // // //               <Checkbox id="shipDiff" checked={shipDiff} onCheckedChange={c => setShipDiff(Boolean(c))} />
// // // // // //               <Label htmlFor="shipDiff">Ship to a different address?</Label>
// // // // // //             </div>

// // // // // //             {shipDiff && (
// // // // // //                 <Card>
// // // // // //                     <CardHeader><CardTitle>Shipping Details</CardTitle></CardHeader>
// // // // // //                     <CardContent className="space-y-4">
// // // // // //                         {/* Form fields for shipping */}
// // // // // //                     </CardContent>
// // // // // //                 </Card>
// // // // // //             )}
// // // // // //           </div>

// // // // // //           {/* Order Summary */}
// // // // // //           <div className="space-y-6">
// // // // // //             <Card>
// // // // // //               <CardHeader><CardTitle>Your Order</CardTitle></CardHeader>
// // // // // //               <CardContent className="space-y-4">
// // // // // //                 {items.map(item => (
// // // // // //                     <div key={item.id} className="flex items-center justify-between">
// // // // // //                         <div className="flex items-center gap-4">
// // // // // //                             <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
// // // // // //                                 <Image src={item.image || ''} alt={item.name} fill className="object-cover" />
// // // // // //                             </div>
// // // // // //                             <div>
// // // // // //                                 <p className="font-semibold">{item.name}</p>
// // // // // //                                 <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
// // // // // //                             </div>
// // // // // //                         </div>
// // // // // //                         <p className="font-semibold">${(item.price * item.quantity).toLocaleString()}</p>
// // // // // //                     </div>
// // // // // //                 ))}
// // // // // //                 <Separator />
// // // // // //                 <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>${total.toLocaleString()}</span></div>
// // // // // //                 <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>${shippingCost.toLocaleString()}</span></div>
// // // // // //                 <Separator />
// // // // // //                 <div className="flex justify-between font-bold text-lg"><span className="text-gray-900">Total</span><span className="text-primary">${finalTotal.toLocaleString()}</span></div>
// // // // // //                 {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
// // // // // //                 <Button className="w-full" size="lg" onClick={handlePlaceOrder}>Place Order</Button>
// // // // // //               </CardContent>
// // // // // //             </Card>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // }


// // // // // // // "use client"

// // // // // // // import { useState, useEffect } from "react";
// // // // // // // import { useCart, CartItem } from "@/hooks/useCart";
// // // // // // // import { useToast } from "@/hooks/use-toast";
// // // // // // // import { useRouter } from "next/navigation";
// // // // // // // import { useMutation } from "@tanstack/react-query";

// // // // // // // export type CheckoutStep = 'form' | 'confirm' | 'success';

// // // // // // // // Define the types for your billing and shipping objects
// // // // // // // interface AddressDetails {
// // // // // // //   firstName: string;
// // // // // // //   lastName: string;
// // // // // // //   company: string;
// // // // // // //   country: string;
// // // // // // //   address: string;
// // // // // // //   address2: string;
// // // // // // //   city: string;
// // // // // // //   state: string;
// // // // // // //   phone: string;
// // // // // // //   email: string;
// // // // // // //   notes?: string; // notes field is optional for billing
// // // // // // // }

// // // // // // // // NOTE: This interface is for shipping, which does not have notes
// // // // // // // interface ShippingDetails {
// // // // // // //   firstName: string;
// // // // // // //   lastName: string;
// // // // // // //   address: string;
// // // // // // //   address2: string;
// // // // // // //   city: string;
// // // // // // //   state: string;
// // // // // // //   country: string;
// // // // // // //   phone: string;
// // // // // // // }

// // // // // // // // Define the complete structure of the payload sent to the API
// // // // // // // interface CheckoutPayload {
// // // // // // //   items: CartItem[];
// // // // // // //   billing: Omit<AddressDetails, 'notes'>; // Billing sent to API has no notes
// // // // // // //   shipping: ShippingDetails;
// // // // // // //   paymentMethod: string;
// // // // // // //   total: number;
// // // // // // //   orderNumber: string | null;
// // // // // // // }

// // // // // // // // Mock user data for a pre-filled form
// // // // // // // const mockUser = {
// // // // // // //   isLoggedIn: true,
// // // // // // //   firstName: "IDOKO",
// // // // // // //   lastName: "TOCHUKWU",
// // // // // // //   email: "victorvector608@gmail.com",
// // // // // // //   phone: "+2348025383208",
// // // // // // //   address: "Ajegunle apapa lagos",
// // // // // // //   address2: "No.59 ekundayo street ajeromi ifelodun L.G.A",
// // // // // // //   city: "Ajegunle",
// // // // // // //   state: "Lagos",
// // // // // // //   country: "Nigeria",
// // // // // // //   company: "",
// // // // // // // };

// // // // // // // // This is the function that makes the API call using the native `fetch` API.
// // // // // // // const createCheckoutSession = async (payload: CheckoutPayload) => {
// // // // // // //   const response = await fetch('/api/checkout', {
// // // // // // //     method: 'POST',
// // // // // // //     headers: {
// // // // // // //       'Content-Type': 'application/json',
// // // // // // //     },
// // // // // // //     body: JSON.stringify(payload),
// // // // // // //   });

// // // // // // //   if (!response.ok) {
// // // // // // //     const errorData = await response.json();
// // // // // // //     throw new Error(errorData.error || 'Failed to create checkout session.');
// // // // // // //   }

// // // // // // //   return response.json();
// // // // // // // };

// // // // // // // export const useCheckout = () => {
// // // // // // //   const { items, total, clearCart } = useCart();
// // // // // // //   const { toast } = useToast();
// // // // // // //   const router = useRouter();

// // // // // // //   const [step, setStep] = useState<CheckoutStep>('form');
// // // // // // //   const [billing, setBilling] = useState<AddressDetails>({
// // // // // // //     firstName: mockUser.isLoggedIn ? mockUser.firstName : "",
// // // // // // //     lastName: mockUser.isLoggedIn ? mockUser.lastName : "",
// // // // // // //     company: mockUser.isLoggedIn ? mockUser.company : "",
// // // // // // //     country: mockUser.isLoggedIn ? mockUser.country : "Nigeria",
// // // // // // //     address: mockUser.isLoggedIn ? mockUser.address : "",
// // // // // // //     address2: mockUser.isLoggedIn ? mockUser.address2 : "",
// // // // // // //     city: mockUser.isLoggedIn ? mockUser.city : "",
// // // // // // //     state: mockUser.isLoggedIn ? mockUser.state : "",
// // // // // // //     phone: mockUser.isLoggedIn ? mockUser.phone : "",
// // // // // // //     email: mockUser.isLoggedIn ? mockUser.email : "",
// // // // // // //     notes: "",
// // // // // // //   });
// // // // // // //   const [createAccount, setCreateAccount] = useState(false);
// // // // // // //   const [shipDiff, setShipDiff] = useState(false);
// // // // // // //   const [shipping, setShipping] = useState<ShippingDetails>({
// // // // // // //     firstName: "",
// // // // // // //     lastName: "",
// // // // // // //     address: "",
// // // // // // //     address2: "",
// // // // // // //     city: "",
// // // // // // //     state: "",
// // // // // // //     country: "Nigeria",
// // // // // // //     phone: "",
// // // // // // //   });
// // // // // // //   const [selectedPayment, setSelectedPayment] = useState("card");
// // // // // // //   const [localError, setLocalError] = useState("");
// // // // // // //   const [orderNumber, setOrderNumber] = useState<string | null>(null);

// // // // // // //   const { 
// // // // // // //     mutate, 
// // // // // // //     isPending, 
// // // // // // //     isSuccess, 
// // // // // // //     isError, 
// // // // // // //     error 
// // // // // // //   } = useMutation({
// // // // // // //     mutationFn: createCheckoutSession,
// // // // // // //     onSuccess: (data) => {
// // // // // // //       if (data.redirectUrl) {
// // // // // // //         window.location.href = data.redirectUrl;
// // // // // // //       } else {
// // // // // // //         toast({
// // // // // // //           title: "Order Placed",
// // // // // // //           description: "Your order has been placed successfully.",
// // // // // // //         });
// // // // // // //         setStep('success');
// // // // // // //         clearCart();
// // // // // // //       }
// // // // // // //     },
// // // // // // //     onError: (err) => {
// // // // // // //       toast({
// // // // // // //         title: "Payment Failed",
// // // // // // //         description: err.message || "An unexpected error occurred. Please try again.",
// // // // // // //         variant: "destructive",
// // // // // // //       });
// // // // // // //       setStep('form');
// // // // // // //     },
// // // // // // //   });

// // // // // // //   useEffect(() => {
// // // // // // //     if (!shipDiff) {
// // // // // // //       setShipping({
// // // // // // //         firstName: billing.firstName,
// // // // // // //         lastName: billing.lastName,
// // // // // // //         address: billing.address,
// // // // // // //         address2: billing.address2,
// // // // // // //         city: billing.city,
// // // // // // //         state: billing.state,
// // // // // // //         country: billing.country,
// // // // // // //         phone: billing.phone,
// // // // // // //       });
// // // // // // //     }
// // // // // // //   }, [shipDiff, billing]);

// // // // // // //   const shippingCost = 5000;
// // // // // // //   const finalTotal = total + shippingCost;

// // // // // // //   const handlePlaceOrder = () => {
// // // // // // //     setLocalError("");
// // // // // // //     if (!isBillingValid()) {
// // // // // // //       setLocalError("Please fill out all required billing fields.");
// // // // // // //       return;
// // // // // // //     }
// // // // // // //     if (shipDiff && !isShippingValid()) {
// // // // // // //       setLocalError("Please fill out all required shipping fields.");
// // // // // // //       return;
// // // // // // //     }
// // // // // // //     if (items.length === 0) {
// // // // // // //       setLocalError("Your cart is empty.");
// // // // // // //       router.push('/cart');
// // // // // // //       return;
// // // // // // //     }
// // // // // // //     setOrderNumber((Math.floor(Math.random() * 90000) + 10000).toString());
// // // // // // //     setStep('confirm');
// // // // // // //   };

// // // // // // //   const handlePayNow = () => {
// // // // // // //     const payload: CheckoutPayload = {
// // // // // // //       items,
// // // // // // //       // Create a new object from billing without the optional `notes` field
// // // // // // //       billing: {
// // // // // // //         firstName: billing.firstName,
// // // // // // //         lastName: billing.lastName,
// // // // // // //         company: billing.company,
// // // // // // //         country: billing.country,
// // // // // // //         address: billing.address,
// // // // // // //         address2: billing.address2,
// // // // // // //         city: billing.city,
// // // // // // //         state: billing.state,
// // // // // // //         phone: billing.phone,
// // // // // // //         email: billing.email,
// // // // // // //       },
// // // // // // //       // Correctly assign shipping details based on `shipDiff`
// // // // // // //       shipping: shipDiff ? shipping : {
// // // // // // //         firstName: billing.firstName,
// // // // // // //         lastName: billing.lastName,
// // // // // // //         address: billing.address,
// // // // // // //         address2: billing.address2,
// // // // // // //         city: billing.city,
// // // // // // //         state: billing.state,
// // // // // // //         country: billing.country,
// // // // // // //         phone: billing.phone,
// // // // // // //       },
// // // // // // //       paymentMethod: selectedPayment,
// // // // // // //       total: finalTotal,
// // // // // // //       orderNumber,
// // // // // // //     };
// // // // // // //     mutate(payload);
// // // // // // //   };
  
// // // // // // //   const handleCancelOrder = () => {
// // // // // // //     setStep('form');
// // // // // // //     setOrderNumber(null);
// // // // // // //   };

// // // // // // //   const isBillingValid = () => {
// // // // // // //     return billing.firstName.trim() !== "" && billing.lastName.trim() !== "" && billing.address.trim() !== "" && billing.city.trim() !== "" && billing.state.trim() !== "" && billing.phone.trim() !== "" && billing.email.trim() !== "";
// // // // // // //   };

// // // // // // //   const isShippingValid = () => {
// // // // // // //     return shipping.firstName.trim() !== "" && shipping.lastName.trim() !== "" && shipping.address.trim() !== "" && shipping.city.trim() !== "" && shipping.state.trim() !== "" && shipping.phone.trim() !== "";
// // // // // // //   };
  
// // // // // // //   const displayError = localError || (isError && (error as any).message) || null;

// // // // // // //   return {
// // // // // // //     items,
// // // // // // //     total,
// // // // // // //     shippingCost,
// // // // // // //     finalTotal,
// // // // // // //     step,
// // // // // // //     billing,
// // // // // // //     setBilling,
// // // // // // //     shipping,
// // // // // // //     setShipping,
// // // // // // //     createAccount,
// // // // // // //     setCreateAccount,
// // // // // // //     shipDiff,
// // // // // // //     setShipDiff,
// // // // // // //     selectedPayment,
// // // // // // //     setSelectedPayment,
// // // // // // //     error: displayError,
// // // // // // //     orderNumber,
// // // // // // //     isPending,
// // // // // // //     isSuccess,
// // // // // // //     handlePlaceOrder,
// // // // // // //     handlePayNow,
// // // // // // //     handleCancelOrder,
// // // // // // //   };
// // // // // // // };

// // // // // // // // // hooks/useCheckout.ts

// // // // // // // // import { useState, useEffect } from "react";
// // // // // // // // import { useCart, CartItem } from "@/hooks/useCart"; // Assuming CartItem is exported from useCart
// // // // // // // // import { useToast } from "@/hooks/use-toast";
// // // // // // // // import { useRouter } from "next/navigation";
// // // // // // // // import { useMutation } from "@tanstack/react-query";

// // // // // // // // export type CheckoutStep = 'form' | 'confirm' | 'success';

// // // // // // // // // Define the types for your billing and shipping objects
// // // // // // // // interface AddressDetails {
// // // // // // // //   firstName: string;
// // // // // // // //   lastName: string;
// // // // // // // //   company: string;
// // // // // // // //   country: string;
// // // // // // // //   address: string;
// // // // // // // //   address2: string;
// // // // // // // //   city: string;
// // // // // // // //   state: string;
// // // // // // // //   phone: string;
// // // // // // // //   email: string;
// // // // // // // //   notes?: string;
// // // // // // // // }

// // // // // // // // interface ShippingDetails {
// // // // // // // //   firstName: string;
// // // // // // // //   lastName: string;
// // // // // // // //   address: string;
// // // // // // // //   address2: string;
// // // // // // // //   city: string;
// // // // // // // //   state: string;
// // // // // // // //   country: string;
// // // // // // // //   phone: string;
// // // // // // // // }

// // // // // // // // // Define the complete structure of the payload sent to the API
// // // // // // // // interface CheckoutPayload {
// // // // // // // //   items: CartItem[];
// // // // // // // //   billing: AddressDetails;
// // // // // // // //   shipping: ShippingDetails;
// // // // // // // //   paymentMethod: string;
// // // // // // // //   total: number;
// // // // // // // //   orderNumber: string | null;
// // // // // // // // }

// // // // // // // // // Mock user data for a pre-filled form
// // // // // // // // const mockUser = {
// // // // // // // //   isLoggedIn: true,
// // // // // // // //   firstName: "IDOKO",
// // // // // // // //   lastName: "TOCHUKWU",
// // // // // // // //   email: "victorvector608@gmail.com",
// // // // // // // //   phone: "+2348025383208",
// // // // // // // //   address: "Ajegunle apapa lagos",
// // // // // // // //   address2: "No.59 ekundayo street ajeromi ifelodun L.G.A",
// // // // // // // //   city: "Ajegunle",
// // // // // // // //   state: "Lagos",
// // // // // // // //   country: "Nigeria",
// // // // // // // //   company: "",
// // // // // // // // };

// // // // // // // // // This is the function that makes the API call using the native `fetch` API.
// // // // // // // // // We've now given the `payload` parameter a clear type: CheckoutPayload
// // // // // // // // const createCheckoutSession = async (payload: CheckoutPayload) => {
// // // // // // // //   const response = await fetch('/api/checkout', {
// // // // // // // //     method: 'POST',
// // // // // // // //     headers: {
// // // // // // // //       'Content-Type': 'application/json',
// // // // // // // //     },
// // // // // // // //     body: JSON.stringify(payload),
// // // // // // // //   });

// // // // // // // //   if (!response.ok) {
// // // // // // // //     const errorData = await response.json();
// // // // // // // //     throw new Error(errorData.error || 'Failed to create checkout session.');
// // // // // // // //   }

// // // // // // // //   return response.json();
// // // // // // // // };

// // // // // // // // export const useCheckout = () => {
// // // // // // // //   const { items, total, clearCart } = useCart();
// // // // // // // //   const { toast } = useToast();
// // // // // // // //   const router = useRouter();

// // // // // // // //   const [step, setStep] = useState<CheckoutStep>('form');
// // // // // // // //   const [billing, setBilling] = useState<AddressDetails>({
// // // // // // // //     firstName: mockUser.isLoggedIn ? mockUser.firstName : "",
// // // // // // // //     lastName: mockUser.isLoggedIn ? mockUser.lastName : "",
// // // // // // // //     company: mockUser.isLoggedIn ? mockUser.company : "",
// // // // // // // //     country: mockUser.isLoggedIn ? mockUser.country : "Nigeria",
// // // // // // // //     address: mockUser.isLoggedIn ? mockUser.address : "",
// // // // // // // //     address2: mockUser.isLoggedIn ? mockUser.address2 : "",
// // // // // // // //     city: mockUser.isLoggedIn ? mockUser.city : "",
// // // // // // // //     state: mockUser.isLoggedIn ? mockUser.state : "",
// // // // // // // //     phone: mockUser.isLoggedIn ? mockUser.phone : "",
// // // // // // // //     email: mockUser.isLoggedIn ? mockUser.email : "",
// // // // // // // //     notes: "",
// // // // // // // //   });
// // // // // // // //   const [createAccount, setCreateAccount] = useState(false);
// // // // // // // //   const [shipDiff, setShipDiff] = useState(false);
// // // // // // // //   const [shipping, setShipping] = useState<ShippingDetails>({
// // // // // // // //     firstName: "",
// // // // // // // //     lastName: "",
// // // // // // // //     address: "",
// // // // // // // //     address2: "",
// // // // // // // //     city: "",
// // // // // // // //     state: "",
// // // // // // // //     country: "Nigeria",
// // // // // // // //     phone: "",
// // // // // // // //   });
// // // // // // // //   const [selectedPayment, setSelectedPayment] = useState("card");
// // // // // // // //   const [localError, setLocalError] = useState("");
// // // // // // // //   const [orderNumber, setOrderNumber] = useState<string | null>(null);

// // // // // // // //   const { 
// // // // // // // //     mutate, 
// // // // // // // //     isPending, 
// // // // // // // //     isSuccess, 
// // // // // // // //     isError, 
// // // // // // // //     error 
// // // // // // // //   } = useMutation({
// // // // // // // //     mutationFn: createCheckoutSession,
// // // // // // // //     onSuccess: (data) => {
// // // // // // // //       if (data.redirectUrl) {
// // // // // // // //         window.location.href = data.redirectUrl;
// // // // // // // //       } else {
// // // // // // // //         toast({
// // // // // // // //           title: "Order Placed",
// // // // // // // //           description: "Your order has been placed successfully.",
// // // // // // // //         });
// // // // // // // //         setStep('success');
// // // // // // // //         clearCart();
// // // // // // // //       }
// // // // // // // //     },
// // // // // // // //     onError: (err) => {
// // // // // // // //       toast({
// // // // // // // //         title: "Payment Failed",
// // // // // // // //         description: err.message || "An unexpected error occurred. Please try again.",
// // // // // // // //         variant: "destructive",
// // // // // // // //       });
// // // // // // // //       setStep('form');
// // // // // // // //     },
// // // // // // // //   });

// // // // // // // //   useEffect(() => {
// // // // // // // //     if (!shipDiff) {
// // // // // // // //       setShipping({
// // // // // // // //         firstName: billing.firstName,
// // // // // // // //         lastName: billing.lastName,
// // // // // // // //         address: billing.address,
// // // // // // // //         address2: billing.address2,
// // // // // // // //         city: billing.city,
// // // // // // // //         state: billing.state,
// // // // // // // //         country: billing.country,
// // // // // // // //         phone: billing.phone,
// // // // // // // //       });
// // // // // // // //     }
// // // // // // // //   }, [shipDiff, billing]);

// // // // // // // //   const shippingCost = 5000;
// // // // // // // //   const finalTotal = total + shippingCost;

// // // // // // // //   const handlePlaceOrder = () => {
// // // // // // // //     setLocalError("");
// // // // // // // //     if (!isBillingValid()) {
// // // // // // // //       setLocalError("Please fill out all required billing fields.");
// // // // // // // //       return;
// // // // // // // //     }
// // // // // // // //     if (shipDiff && !isShippingValid()) {
// // // // // // // //       setLocalError("Please fill out all required shipping fields.");
// // // // // // // //       return;
// // // // // // // //     }
// // // // // // // //     if (items.length === 0) {
// // // // // // // //       setLocalError("Your cart is empty.");
// // // // // // // //       router.push('/cart');
// // // // // // // //       return;
// // // // // // // //     }
// // // // // // // //     setOrderNumber((Math.floor(Math.random() * 90000) + 10000).toString());
// // // // // // // //     setStep('confirm');
// // // // // // // //   };

// // // // // // // //   const handlePayNow = () => {
// // // // // // // //     // The payload is now a strongly typed object
// // // // // // // //     const payload: CheckoutPayload = {
// // // // // // // //       items,
// // // // // // // //       billing: billing as AddressDetails, // Explicitly cast billing if needed
// // // // // // // //       shipping: (shipDiff ? shipping : billing) as ShippingDetails, // Explicitly cast if needed
// // // // // // // //       paymentMethod: selectedPayment,
// // // // // // // //       total: finalTotal,
// // // // // // // //       orderNumber,
// // // // // // // //     };
// // // // // // // //     mutate(payload);
// // // // // // // //   };
  
// // // // // // // //   const handleCancelOrder = () => {
// // // // // // // //     setStep('form');
// // // // // // // //     setOrderNumber(null);
// // // // // // // //   };

// // // // // // // //   const isBillingValid = () => {
// // // // // // // //     return billing.firstName.trim() !== "" && billing.lastName.trim() !== "" && billing.address.trim() !== "" && billing.city.trim() !== "" && billing.state.trim() !== "" && billing.phone.trim() !== "" && billing.email.trim() !== "";
// // // // // // // //   };

// // // // // // // //   const isShippingValid = () => {
// // // // // // // //     return shipping.firstName.trim() !== "" && shipping.lastName.trim() !== "" && shipping.address.trim() !== "" && shipping.city.trim() !== "" && shipping.state.trim() !== "" && shipping.phone.trim() !== "";
// // // // // // // //   };
  
// // // // // // // //   const displayError = localError || (isError && (error as any).message) || null;

// // // // // // // //   return {
// // // // // // // //     items,
// // // // // // // //     total,
// // // // // // // //     shippingCost,
// // // // // // // //     finalTotal,
// // // // // // // //     step,
// // // // // // // //     billing,
// // // // // // // //     setBilling,
// // // // // // // //     shipping,
// // // // // // // //     setShipping,
// // // // // // // //     createAccount,
// // // // // // // //     setCreateAccount,
// // // // // // // //     shipDiff,
// // // // // // // //     setShipDiff,
// // // // // // // //     selectedPayment,
// // // // // // // //     setSelectedPayment,
// // // // // // // //     error: displayError,
// // // // // // // //     orderNumber,
// // // // // // // //     isPending,
// // // // // // // //     isSuccess,
// // // // // // // //     handlePlaceOrder,
// // // // // // // //     handlePayNow,
// // // // // // // //     handleCancelOrder,
// // // // // // // //   };
// // // // // // // // };