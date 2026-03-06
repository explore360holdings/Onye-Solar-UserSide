// File: app/cart/page.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, ShoppingBag, ArrowLeft, Truck, Shield, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/useCart"
import { useToast } from "@/components/ui/use-toast"
import { usePromo } from "@/hooks/use-promo"

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart()
  const { toast } = useToast()
  
  // FIX: Pass the cart total to the usePromo hook so it can calculate the discount
  const { promoCode, setPromoCode, handleApply, discount, isPending, promoError } = usePromo(total);

  const shipping = total > 500 ? 0 : 49.99
  const tax = total * 0.08
  // The finalTotal will now react to the discount from the hook
  const finalTotal = total + shipping + tax - discount

  const handleClearCart = () => {
    clearCart()
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any solar products to your cart yet. Start shopping to build your perfect
              solar energy system!
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/products" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">{items.length} items in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Cart Items</CardTitle>
                <Button variant="outline" size="sm" onClick={handleClearCart}>
                  Clear Cart
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-primary font-bold text-lg">₦{item.price.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right min-w-[80px]">
                        <p className="font-bold">₦{(item.price * item.quantity).toLocaleString()}</p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-medium">Free Shipping</h3>
                      <p className="text-sm text-gray-600">On orders over $500</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-medium">25 Year Warranty</h3>
                      <p className="text-sm text-gray-600">On all solar panels</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-medium">Secure Payment</h3>
                      <p className="text-sm text-gray-600">SSL encrypted checkout</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>

                {/* Promo Code */}
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Promo code" 
                      value={promoCode} 
                      onChange={(e) => setPromoCode(e.target.value)} 
                    />
                    <Button 
                      variant="outline" 
                      // FIX: The onClick now calls the new handleApply function
                      onClick={handleApply} 
                      disabled={isPending}
                    >
                      {isPending ? "Applying..." : "Apply"}
                    </Button>
                  </div>
                  {promoError && (
                    <p className="text-xs text-red-600">
                      {(promoError as Error).message}
                    </p>
                  )}
                  <p className="text-xs text-gray-600">Try: SOLAR20 or WELCOME10</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Link href="/checkout" className="block">
                    <Button className="w-full bg-accent text-black hover:bg-accent/90 font-semibold py-3">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link href="/products" className="block">
                    <Button variant="outline" className="w-full bg-transparent">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {/* Security Badge */}
                <div className="text-center pt-4">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>Secure SSL Encrypted Checkout</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// // app/checkout/page.tsx
// "use client"

// import { useState } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { Minus, Plus, X, ShoppingBag, ArrowLeft, Truck, Shield, CreditCard } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Separator } from "@/components/ui/separator"
// import { useCart } from "@/hooks/useCart"
// import { useToast } from "@/components/ui/use-toast"
// import { usePromo } from "@/hooks/use-promo" // New hook for promo code logic

// export default function CartPage() {
//   const { items, updateQuantity, removeItem, total, clearCart } = useCart()
//   const { toast } = useToast()
  
//   // Consume the new usePromo hook
//   const { promoCode, setPromoCode, handleApply, discount, isPending, promoError } = usePromo()

//   const shipping = total > 500 ? 0 : 49.99
//   const tax = total * 0.08
//   const finalTotal = total + shipping + tax - discount

//   const handleClearCart = () => {
//     clearCart()
//     toast({
//       title: "Cart cleared",
//       description: "All items have been removed from your cart.",
//     })
//   }

//   if (items.length === 0) {
//     return (
//       <div className="min-h-screen pt-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="text-center py-16">
//             <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
//             <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
//             <p className="text-gray-600 mb-8 max-w-md mx-auto">
//               Looks like you haven't added any solar products to your cart yet. Start shopping to build your perfect
//               solar energy system!
//             </p>
//             <Link href="/products">
//               <Button size="lg" className="bg-primary hover:bg-primary/90">
//                 <ArrowLeft className="w-5 h-5 mr-2" />
//                 Continue Shopping
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen pt-20 bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <Link href="/products" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Continue Shopping
//           </Link>
//           <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
//           <p className="text-gray-600 mt-2">{items.length} items in your cart</p>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Cart Items */}
//           <div className="lg:col-span-2 space-y-4">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between">
//                 <CardTitle>Cart Items</CardTitle>
//                 <Button variant="outline" size="sm" onClick={handleClearCart}>
//                   Clear Cart
//                 </Button>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {items.map((item) => (
//                   <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
//                     <div className="relative w-20 h-20 rounded-lg overflow-hidden">
//                       <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
//                     </div>

//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
//                       <p className="text-primary font-bold text-lg">${item.price.toLocaleString()}</p>
//                     </div>

//                     <div className="flex items-center space-x-3">
//                       <div className="flex items-center border border-gray-300 rounded-lg">
//                         <button
//                           onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
//                           className="p-2 hover:bg-gray-100 transition-colors"
//                         >
//                           <Minus className="w-4 h-4" />
//                         </button>
//                         <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
//                           {item.quantity}
//                         </span>
//                         <button
//                           onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                           className="p-2 hover:bg-gray-100 transition-colors"
//                         >
//                           <Plus className="w-4 h-4" />
//                         </button>
//                       </div>

//                       <div className="text-right min-w-[80px]">
//                         <p className="font-bold">${(item.price * item.quantity).toLocaleString()}</p>
//                       </div>

//                       <button
//                         onClick={() => removeItem(item.id)}
//                         className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>

//             {/* Features */}
//             <Card>
//               <CardContent className="pt-6">
//                 <div className="grid md:grid-cols-3 gap-6">
//                   <div className="flex items-center space-x-3">
//                     <Truck className="w-8 h-8 text-primary" />
//                     <div>
//                       <h3 className="font-medium">Free Shipping</h3>
//                       <p className="text-sm text-gray-600">On orders over $500</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <Shield className="w-8 h-8 text-primary" />
//                     <div>
//                       <h3 className="font-medium">25 Year Warranty</h3>
//                       <p className="text-sm text-gray-600">On all solar panels</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <CreditCard className="w-8 h-8 text-primary" />
//                     <div>
//                       <h3 className="font-medium">Secure Payment</h3>
//                       <p className="text-sm text-gray-600">SSL encrypted checkout</p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <Card className="sticky top-24">
//               <CardHeader>
//                 <CardTitle>Order Summary</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span>Subtotal</span>
//                     <span>${total.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Shipping</span>
//                     <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Tax</span>
//                     <span>${tax.toFixed(2)}</span>
//                   </div>
//                   {discount > 0 && (
//                     <div className="flex justify-between text-green-600">
//                       <span>Discount</span>
//                       <span>-${discount.toFixed(2)}</span>
//                     </div>
//                   )}
//                 </div>

//                 <Separator />

//                 <div className="flex justify-between font-bold text-lg">
//                   <span>Total</span>
//                   <span>${finalTotal.toFixed(2)}</span>
//                 </div>

//                 {/* Promo Code */}
//                 <div className="space-y-2">
//                   <div className="flex space-x-2">
//                     <Input 
//                       placeholder="Promo code" 
//                       value={promoCode} 
//                       onChange={(e) => setPromoCode(e.target.value)} 
//                     />
//                     <Button 
//                       variant="outline" 
//                       onClick={() => handleApply(promoCode)} 
//                       disabled={isPending}
//                     >
//                       {isPending ? "Applying..." : "Apply"}
//                     </Button>
//                   </div>
//                   {promoError && (
//                     <p className="text-xs text-red-600">
//                       {(promoError as Error).message}
//                     </p>
//                   )}
//                   <p className="text-xs text-gray-600">Try: SOLAR20 or WELCOME10</p>
//                 </div>

//                 <Separator />

//                 <div className="space-y-3">
//                   <Link href="/checkout" className="block">
//                     <Button className="w-full bg-accent text-black hover:bg-accent/90 font-semibold py-3">
//                       Proceed to Checkout
//                     </Button>
//                   </Link>
//                   <Link href="/products" className="block">
//                     <Button variant="outline" className="w-full bg-transparent">
//                       Continue Shopping
//                     </Button>
//                   </Link>
//                 </div>

//                 {/* Security Badge */}
//                 <div className="text-center pt-4">
//                   <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
//                     <Shield className="w-4 h-4" />
//                     <span>Secure SSL Encrypted Checkout</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // "use client"

// // import { useState } from "react"
// // import Image from "next/image"
// // import Link from "next/link"
// // import { Minus, Plus, X, ShoppingBag, ArrowLeft, Truck, Shield, CreditCard } from "lucide-react"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Input } from "@/components/ui/input"
// // import { Separator } from "@/components/ui/separator"
// // import { useCart } from "@/hooks/useCart"
// // import { useToast } from "@/hooks/use-toast"

// // export default function CartPage() {
// //   const { items, updateQuantity, removeItem, total, clearCart } = useCart()
// //   const { toast } = useToast()
// //   const [promoCode, setPromoCode] = useState("")
// //   const [discount, setDiscount] = useState(0)

// //   const shipping = total > 500 ? 0 : 49.99
// //   const tax = total * 0.08
// //   const finalTotal = total + shipping + tax - discount

// //   const handleApplyPromo = () => {
// //     // Mock promo code logic
// //     if (promoCode.toLowerCase() === "solar20") {
// //       setDiscount(total * 0.2)
// //       toast({
// //         title: "Promo code applied!",
// //         description: "You saved 20% on your order.",
// //       })
// //     } else if (promoCode.toLowerCase() === "welcome10") {
// //       setDiscount(total * 0.1)
// //       toast({
// //         title: "Promo code applied!",
// //         description: "You saved 10% on your order.",
// //       })
// //     } else {
// //       toast({
// //         title: "Invalid promo code",
// //         description: "Please check your promo code and try again.",
// //         variant: "destructive",
// //       })
// //     }
// //   }

// //   const handleClearCart = () => {
// //     clearCart()
// //     toast({
// //       title: "Cart cleared",
// //       description: "All items have been removed from your cart.",
// //     })
// //   }

// //   if (items.length === 0) {
// //     return (
// //       <div className="min-h-screen pt-20 bg-gray-50">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //           <div className="text-center py-16">
// //             <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
// //             <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
// //             <p className="text-gray-600 mb-8 max-w-md mx-auto">
// //               Looks like you haven't added any solar products to your cart yet. Start shopping to build your perfect
// //               solar energy system!
// //             </p>
// //             <Link href="/products">
// //               <Button size="lg" className="bg-primary hover:bg-primary/90">
// //                 <ArrowLeft className="w-5 h-5 mr-2" />
// //                 Continue Shopping
// //               </Button>
// //             </Link>
// //           </div>
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="min-h-screen pt-20 bg-gray-50">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         <div className="mb-8">
// //           <Link href="/products" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
// //             <ArrowLeft className="w-4 h-4 mr-2" />
// //             Continue Shopping
// //           </Link>
// //           <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
// //           <p className="text-gray-600 mt-2">{items.length} items in your cart</p>
// //         </div>

// //         <div className="grid lg:grid-cols-3 gap-8">
// //           {/* Cart Items */}
// //           <div className="lg:col-span-2 space-y-4">
// //             <Card>
// //               <CardHeader className="flex flex-row items-center justify-between">
// //                 <CardTitle>Cart Items</CardTitle>
// //                 <Button variant="outline" size="sm" onClick={handleClearCart}>
// //                   Clear Cart
// //                 </Button>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 {items.map((item) => (
// //                   <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
// //                     <div className="relative w-20 h-20 rounded-lg overflow-hidden">
// //                       <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
// //                     </div>

// //                     <div className="flex-1 min-w-0">
// //                       <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
// //                       <p className="text-primary font-bold text-lg">${item.price.toLocaleString()}</p>
// //                     </div>

// //                     <div className="flex items-center space-x-3">
// //                       <div className="flex items-center border border-gray-300 rounded-lg">
// //                         <button
// //                           onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
// //                           className="p-2 hover:bg-gray-100 transition-colors"
// //                         >
// //                           <Minus className="w-4 h-4" />
// //                         </button>
// //                         <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
// //                           {item.quantity}
// //                         </span>
// //                         <button
// //                           onClick={() => updateQuantity(item.id, item.quantity + 1)}
// //                           className="p-2 hover:bg-gray-100 transition-colors"
// //                         >
// //                           <Plus className="w-4 h-4" />
// //                         </button>
// //                       </div>

// //                       <div className="text-right min-w-[80px]">
// //                         <p className="font-bold">${(item.price * item.quantity).toLocaleString()}</p>
// //                       </div>

// //                       <button
// //                         onClick={() => removeItem(item.id)}
// //                         className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
// //                       >
// //                         <X className="w-4 h-4" />
// //                       </button>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </CardContent>
// //             </Card>

// //             {/* Features */}
// //             <Card>
// //               <CardContent className="pt-6">
// //                 <div className="grid md:grid-cols-3 gap-6">
// //                   <div className="flex items-center space-x-3">
// //                     <Truck className="w-8 h-8 text-primary" />
// //                     <div>
// //                       <h3 className="font-medium">Free Shipping</h3>
// //                       <p className="text-sm text-gray-600">On orders over $500</p>
// //                     </div>
// //                   </div>
// //                   <div className="flex items-center space-x-3">
// //                     <Shield className="w-8 h-8 text-primary" />
// //                     <div>
// //                       <h3 className="font-medium">25 Year Warranty</h3>
// //                       <p className="text-sm text-gray-600">On all solar panels</p>
// //                     </div>
// //                   </div>
// //                   <div className="flex items-center space-x-3">
// //                     <CreditCard className="w-8 h-8 text-primary" />
// //                     <div>
// //                       <h3 className="font-medium">Secure Payment</h3>
// //                       <p className="text-sm text-gray-600">SSL encrypted checkout</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>

// //           {/* Order Summary */}
// //           <div className="lg:col-span-1">
// //             <Card className="sticky top-24">
// //               <CardHeader>
// //                 <CardTitle>Order Summary</CardTitle>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 <div className="space-y-2">
// //                   <div className="flex justify-between">
// //                     <span>Subtotal</span>
// //                     <span>${total.toLocaleString()}</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span>Shipping</span>
// //                     <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span>Tax</span>
// //                     <span>${tax.toFixed(2)}</span>
// //                   </div>
// //                   {discount > 0 && (
// //                     <div className="flex justify-between text-green-600">
// //                       <span>Discount</span>
// //                       <span>-${discount.toFixed(2)}</span>
// //                     </div>
// //                   )}
// //                 </div>

// //                 <Separator />

// //                 <div className="flex justify-between font-bold text-lg">
// //                   <span>Total</span>
// //                   <span>${finalTotal.toFixed(2)}</span>
// //                 </div>

// //                 {/* Promo Code */}
// //                 <div className="space-y-2">
// //                   <div className="flex space-x-2">
// //                     <Input placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
// //                     <Button variant="outline" onClick={handleApplyPromo}>
// //                       Apply
// //                     </Button>
// //                   </div>
// //                   <p className="text-xs text-gray-600">Try: SOLAR20 or WELCOME10</p>
// //                 </div>

// //                 <Separator />

// //                 <div className="space-y-3">
// //                   <Link href="/checkout" className="block">
// //                     <Button className="w-full bg-accent text-black hover:bg-accent/90 font-semibold py-3">
// //                       Proceed to Checkout
// //                     </Button>
// //                   </Link>
// //                   <Link href="/products" className="block">
// //                     <Button variant="outline" className="w-full bg-transparent">
// //                       Continue Shopping
// //                     </Button>
// //                   </Link>
// //                 </div>

// //                 {/* Security Badge */}
// //                 <div className="text-center pt-4">
// //                   <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
// //                     <Shield className="w-4 h-4" />
// //                     <span>Secure SSL Encrypted Checkout</span>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }
