"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/useCart"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

import type { Product } from "@/components/types/product"
import { Skeleton } from "./ui/skeleton"

import { useAuthStore } from "@/components/store/authStore"
import { useWishlist, WishlistItem } from "@/lib/wishlist-context"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  const { token } = useAuthStore()
  const isLoggedIn = !!token
  const { toggleWishlist, isInWishlist } = useWishlist()

  const isWishlisted = isInWishlist(product._id)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAddingToCart(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })

    setIsAddingToCart(false)
  }

  // --- 4. Create the new wishlist handler with an auth check ---
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if the user is logged in
    if (!isLoggedIn) {
      toast({
        title: "Please Log In",
        description: "You must be logged in to add items to your wishlist.",
        variant: "destructive",
      });
      router.push('/login'); // Redirect to login page
      return; // Stop the function here
    }

    // If logged in, proceed to add/remove from wishlist
    const wishlistItem: WishlistItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    };
    
    const wasAdded = toggleWishlist(wishlistItem);
    
    toast({
      title: wasAdded ? "Added to Wishlist" : "Removed from Wishlist",
      description: wasAdded 
        ? `${product.name} has been added to your wishlist.`
        : `${product.name} has been removed from your wishlist.`,
    });
  };

  return (
    <Link href={`/products/${product._id}`}>
      <div className="card-hover bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full group cursor-pointer">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {/* {product.featured && <Badge className="bg-accent text-black font-medium">Featured</Badge>} */}
            {/* {product.discount && <Badge variant="destructive">-{product.discount}%</Badge>} */}
          </div>

          {/* --- 5. Wire up the functional wishlist button --- */}
          <button 
            onClick={handleWishlistToggle}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
            aria-label="Toggle Wishlist"
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${
                isWishlisted ? "text-red-500 fill-current" : "text-gray-600 hover:text-red-500"
              }`} 
            />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            {/* <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge> */}
            {/* {product.wattage && ( ... )} */}
          </div>

          <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-primary">₦{product.price.toLocaleString()}</span>
            {product.stock > 0 ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                In Stock
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-600 border-red-600">
                Out of Stock
              </Badge>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock === 0}
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl"
          >
            {isAddingToCart ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </>
            )}
          </Button>
        </div>
      </div>
    </Link>
  )
}

// The skeleton component remains unchanged.
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full">
      <Skeleton className="relative aspect-square w-full" />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-3" />
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-8" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
        </div>
      </div>
    </div>
  );
}


// // File: /components/ProductCard.tsx
// "use client"

// import type React from "react"
// import { useState } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { Star, ShoppingCart, Heart, Zap } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { useCart } from "@/hooks/useCart"
// import { useToast } from "@/hooks/use-toast"

// // --- FIX 1: Import the correct Product type from its definitive source ---
// import type { Product } from "@/components/types/product"
// import { Skeleton } from "./ui/skeleton" // Make sure you've added this via shadcn-ui

// interface ProductCardProps {
//   product: Product
// }

// export function ProductCard({ product }: ProductCardProps) {
//   const [isHovered, setIsHovered] = useState(false)
//   const [isAddingToCart, setIsAddingToCart] = useState(false)
//   const { addItem } = useCart()
//   const { toast } = useToast()

//   const handleAddToCart = async (e: React.MouseEvent) => {
//     e.preventDefault()
//     e.stopPropagation()

//     setIsAddingToCart(true)
//     await new Promise((resolve) => setTimeout(resolve, 500))

//     addItem({
//       // --- FIX 2: Use the correct property names from your API-driven Product type ---
//       id: product._id, // Use _id
//       name: product.name,
//       price: product.price,
//       image: product.images[0], // Use the first image from the images array
//       quantity: 1,
//     })

//     toast({
//       title: "Added to cart",
//       description: `${product.name} has been added to your cart.`,
//     })

//     setIsAddingToCart(false)
//   }

//   // This is a placeholder since your API doesn't have rating/reviews
//   const renderStars = (rating: number = 4) => {
//     return Array.from({ length: 5 }).map((_, i) => (
//       <Star
//         key={i}
//         className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
//       />
//     ))
//   }

//   return (
//     // Your API doesn't provide a 'slug', so we link using the product's _id
//     <Link href={`/products/${product._id}`}>
//       <div
//         className="card-hover bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full group cursor-pointer"
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         {/* Image */}
//         <div className="relative aspect-square overflow-hidden">
//           <Image
//             src={product.images[0] || "/placeholder.svg"} // Use first image
//             alt={product.name}
//             fill
//             className="object-cover transition-transform duration-300 group-hover:scale-105"
//           />

//           {/* Badges - Assuming you might add these fields later */}
//           <div className="absolute top-4 left-4 flex flex-col gap-2">
//             {/* {product.featured && <Badge className="bg-accent text-black font-medium">Featured</Badge>} */}
//             {/* {product.discount && <Badge variant="destructive">-{product.discount}%</Badge>} */}
//           </div>

//           <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
//             <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
//           </button>

//           <div
//             className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
//               isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
//             }`}
//           >
//             <Button
//               onClick={handleAddToCart}
//               disabled={isAddingToCart}
//               className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl"
//             >
//               {isAddingToCart ? (
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               ) : (
//                 <>
//                   <ShoppingCart className="w-4 h-4 mr-2" />
//                   Add to Cart
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           <div className="flex items-center gap-2 mb-2">
//             {/* <Badge variant="outline" className="text-xs">
//               {product.category}
//             </Badge> */}
//             {/* Assuming you might add wattage later */}
//             {/* {product.wattage && ( ... )} */}
//           </div>

//           <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
//             {product.name}
//           </h3>

//           <div className="flex items-center gap-2 mb-3">
//             <div className="flex items-center">{renderStars()}</div>
//             <span className="text-sm text-gray-500">(12)</span> {/* Placeholder reviews */}
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <span className="text-2xl font-bold text-primary">${product.price.toLocaleString()}</span>
//               {/* {product.originalPrice && ( ... )} */}
//             </div>
//             {product.stock > 0 ? (
//               <Badge variant="outline" className="text-green-600 border-green-600">
//                 In Stock
//               </Badge>
//             ) : (
//               <Badge variant="outline" className="text-red-600 border-red-600">
//                 Out of Stock
//               </Badge>
//             )}
//           </div>
//         </div>
//       </div>
//     </Link>
//   )
// }

// // --- FIX 3: ADD AND EXPORT THE MISSING SKELETON COMPONENT ---

// export function ProductCardSkeleton() {
//   return (
//     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full">
//       {/* Image Skeleton */}
//       <Skeleton className="relative aspect-square w-full" />
      
//       {/* Content Skeleton */}
//       <div className="p-6">
//         <div className="flex items-center gap-2 mb-2">
//           <Skeleton className="h-5 w-20" />
//         </div>
//         <Skeleton className="h-6 w-full mb-2" />
//         <Skeleton className="h-6 w-3/4 mb-3" />
//         <div className="flex items-center gap-2 mb-3">
//           <Skeleton className="h-4 w-24" />
//           <Skeleton className="h-4 w-8" />
//         </div>
//         <div className="flex items-center justify-between">
//           <Skeleton className="h-8 w-1/3" />
//           <Skeleton className="h-6 w-1/4" />
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client"

// import type React from "react"

// import { useState } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { Star, ShoppingCart, Heart, Zap } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { useCart } from "@/hooks/useCart"
// import { useToast } from "@/hooks/use-toast"
// import type { Product } from "@/hooks/useProducts"

// interface ProductCardProps {
//   product: Product
// }

// export function ProductCard({ product }: ProductCardProps) {
//   const [isHovered, setIsHovered] = useState(false)
//   const [isAddingToCart, setIsAddingToCart] = useState(false)
//   const { addItem } = useCart()
//   const { toast } = useToast()

//   const handleAddToCart = async (e: React.MouseEvent) => {
//     e.preventDefault()
//     e.stopPropagation()

//     setIsAddingToCart(true)

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 500))

//     addItem({
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       image: product.image,
//       quantity: 1,
//     })

//     toast({
//       title: "Added to cart",
//       description: `${product.name} has been added to your cart.`,
//     })

//     setIsAddingToCart(false)
//   }

//   const renderStars = (rating: number) => {
//     return Array.from({ length: 5 }).map((_, i) => (
//       <Star
//         key={i}
//         className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
//       />
//     ))
//   }

//   return (
//     <Link href={`/products/${product.slug}`}>
//       <div
//         className="card-hover bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full group cursor-pointer"
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         {/* Image */}
//         <div className="relative aspect-square overflow-hidden">
//           <Image
//             src={product.image || "/placeholder.svg"}
//             alt={product.name}
//             fill
//             className="object-cover transition-transform duration-300 group-hover:scale-105"
//           />

//           {/* Badges */}
//           <div className="absolute top-4 left-4 flex flex-col gap-2">
//             {product.featured && <Badge className="bg-accent text-black font-medium">Featured</Badge>}
//             {product.discount && <Badge variant="destructive">-{product.discount}%</Badge>}
//           </div>

//           {/* Wishlist button */}
//           <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
//             <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
//           </button>

//           {/* Quick add to cart */}
//           <div
//             className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
//               isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
//             }`}
//           >
//             <Button
//               onClick={handleAddToCart}
//               disabled={isAddingToCart}
//               className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl"
//             >
//               {isAddingToCart ? (
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               ) : (
//                 <>
//                   <ShoppingCart className="w-4 h-4 mr-2" />
//                   Add to Cart
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           <div className="flex items-center gap-2 mb-2">
//             <Badge variant="outline" className="text-xs">
//               {product.category}
//             </Badge>
//             {product.wattage && (
//               <div className="flex items-center text-xs text-gray-500">
//                 <Zap className="w-3 h-3 mr-1" />
//                 {product.wattage}W
//               </div>
//             )}
//           </div>

//           <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
//             {product.name}
//           </h3>

//           <div className="flex items-center gap-2 mb-3">
//             <div className="flex items-center">{renderStars(product.rating)}</div>
//             <span className="text-sm text-gray-500">({product.reviews})</span>
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <span className="text-2xl font-bold text-primary">${product.price.toLocaleString()}</span>
//               {product.originalPrice && (
//                 <span className="text-lg text-gray-400 line-through">${product.originalPrice.toLocaleString()}</span>
//               )}
//             </div>
//             {product.inStock ? (
//               <Badge variant="outline" className="text-green-600 border-green-600">
//                 In Stock
//               </Badge>
//             ) : (
//               <Badge variant="outline" className="text-red-600 border-red-600">
//                 Out of Stock
//               </Badge>
//             )}
//           </div>
//         </div>
//       </div>
//     </Link>
//   )
// }
