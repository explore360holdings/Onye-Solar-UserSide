
"use client"

import { useMemo, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2, SlidersHorizontal, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"
import { FilterSidebar, FilterState } from "@/components/FilterSidebar"
import { useActiveBrands } from "@/hooks/useBrands"

import { useProducts } from "@/hooks/useProducts"
import { Product } from "@/components/types/product"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const { data: brands } = useActiveBrands()
  
  // --- State for filters is now managed here ---
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    minPrice: 0,
    maxPrice: 10000,
    brand: "",
    inStock: false,
  });
  const [sort, setSort] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Handle URL query parameters for brand filtering
  useEffect(() => {
    const brandId = searchParams.get('brand')
    if (brandId && brands) {
      const brand = brands.find(b => b._id === brandId)
      if (brand) {
        setFilters(prev => ({ ...prev, brand: brand.name }))
      }
    }
  }, [searchParams, brands])

  // The useProducts hook now receives all filters
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts({ ...filters, sort });

  // Flatten the paginated data into a single array
  const products = useMemo(() => data?.pages.flatMap(page => page) || [], [data]);

  const handleFiltersChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  if (error) return <div className="text-center text-red-500 p-8">Error: {error.message}</div>

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Our Solar Products</h1>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Power your life with our range of high-efficiency solar panels, inverters, and energy solutions.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-full lg:w-1/4 xl:w-1/5">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </aside>

          {/* Mobile Filter Overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setShowMobileFilters(false)}>
              <div className="fixed inset-y-0 left-0 w-80 bg-white z-50 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <FilterSidebar
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClose={() => setShowMobileFilters(false)}
                />
              </div>
            </div>
          )}
          
          <main className="w-full lg:flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowMobileFilters(true)} 
                    className="lg:hidden"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-600">
                      Showing <span className="font-semibold">{products.length}</span> results
                    </p>
                    {filters.brand && (
                      <p className="text-xs text-primary font-medium">
                        Filtered by: {filters.brand}
                      </p>
                    )}
                  </div>
                </div>
                <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product: Product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800">No Products Found</h2>
                <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}

            <div className="mt-12 text-center">
              {hasNextPage && (
                <Button size="lg" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                  {isFetchingNextPage ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...</>) : ('Load More Products')}
                </Button>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}   


// // File: /app/products/page.tsx
// "use client"

// import { useMemo, useState } from "react"
// import { Filter, Loader2, Plus, SlidersHorizontal } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"

// import { useProducts } from "@/hooks/useProducts"
// import { Product } from "@/components/types/product"
// import { AddProductDialog } from "@/components/AddProductDialog"

// export default function ProductsPage() {
//   const [filters, setFilters] = useState({ sort: "featured", category: "all" })
//   const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)

//   const {
//     data,
//     error,
//     isLoading,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//   } = useProducts({ limit: 12 });

//   const products = useMemo(() => data?.pages.flatMap(page => page) || [], [data]);

//   if (error) return <div className="text-center text-red-500 p-8">Error: {error.message}</div>

//   return (
//     <div className="min-h-screen pt-20 bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
//             <p className="text-gray-600 mt-2">Explore our range of high-quality solar solutions.</p>
//           </div>
//           <Button onClick={() => setIsAddProductDialogOpen(true)}>
//             <Plus className="w-4 h-4 mr-2" />
//             Add New Product
//           </Button>
//         </div>

//         {/* Filters */}
//         <Card className="mb-8">
//           <CardContent className="pt-6 flex flex-col md:flex-row items-center gap-4">
//             <div className="relative w-full md:w-auto md:flex-1">
//               <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input placeholder="Filter products..." className="pl-10" />
//             </div>
//             <Select value={filters.category} onValueChange={(value) => setFilters(f => ({ ...f, category: value }))}>
//               <SelectTrigger className="w-full md:w-48">
//                 <SelectValue placeholder="All Categories" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Categories</SelectItem>
//                 <SelectItem value="Solar Panels">Solar Panels</SelectItem>
//                 <SelectItem value="Inverters">Inverters</SelectItem>
//                 <SelectItem value="Batteries">Batteries</SelectItem>
//                 <SelectItem value="Controllers">Controllers</SelectItem>
//               </SelectContent>
//             </Select>
//             <Select value={filters.sort} onValueChange={(value) => setFilters(f => ({ ...f, sort: value }))}>
//               <SelectTrigger className="w-full md:w-48">
//                 <SlidersHorizontal className="w-4 h-4 mr-2" />
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="featured">Featured</SelectItem>
//                 <SelectItem value="price-asc">Price: Low to High</SelectItem>
//                 <SelectItem value="price-desc">Price: High to Low</SelectItem>
//               </SelectContent>
//             </Select>
//           </CardContent>
//         </Card>

//         {/* Products Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {isLoading ? (
//             Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
//           ) : (
//             products.map((product: Product) => (
//               <ProductCard key={product._id} product={product} />
//             ))
//           )}
//         </div>

//         {/* Load More Button */}
//         <div className="mt-12 text-center">
//           {hasNextPage && (
//             <Button
//               size="lg"
//               onClick={() => fetchNextPage()}
//               disabled={isFetchingNextPage}
//             >
//               {isFetchingNextPage ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Loading...
//                 </>
//               ) : (
//                 'Load More Products'
//               )}
//             </Button>
//           )}
//           {!isLoading && !hasNextPage && (
//              <p className="text-gray-500">You've reached the end of the list.</p>
//           )}
//         </div>
//       </div>
//       <AddProductDialog isOpen={isAddProductDialogOpen} onClose={() => setIsAddProductDialogOpen(false)} />
//     </div>
//   )
// }



// // File: /app/products/[slug]/page.tsx
// "use client"

// import { useState } from "react"
// import { useParams } from "next/navigation"
// import Image from "next/image"
// import { Star, ShoppingCart, Heart, Share2, Zap, Shield, Truck } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { useProduct } from "@/hooks/useProducts"
// import { useCart } from "@/hooks/useCart"
// import { useToast } from "@/hooks/use-toast"
// import Link from "next/link"

// export default function ProductDetailPage() {
//   const params = useParams()
//   const slug = params.slug as string
//   const [selectedImage, setSelectedImage] = useState(0)
//   const [quantity, setQuantity] = useState(1)
//   const [isAddingToCart, setIsAddingToCart] = useState(false)

//   const { data: product, isLoading } = useProduct(slug)
//   const { addItem } = useCart()
//   const { toast } = useToast()

//   const handleAddToCart = async () => {
//     if (!product) return

//     setIsAddingToCart(true)
//     await new Promise((resolve) => setTimeout(resolve, 500))

//     addItem({
//       id: product._id,
//       name: product.name,
//       price: product.price,
//       image: product.images[0],
//       quantity,
//     })

//     toast({
//       title: "Added to cart",
//       description: `${quantity}x ${product.name} added to your cart.`,
//     })

//     setIsAddingToCart(false)
//   }
  
//   // Skeleton UI
//   if (isLoading) {
//     return (
//       <div className="min-h-screen pt-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="grid lg:grid-cols-2 gap-12">
//             <div className="space-y-4">
//               <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
//               <div className="grid grid-cols-4 gap-4">
//                 {Array.from({ length: 4 }).map((_, i) => (
//                   <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
//                 ))}
//               </div>
//             </div>
//             <div className="space-y-6">
//               <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
//               <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
//               <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
//               <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen pt-20 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
//           <Link href="/products"><Button>Back to Products</Button></Link>
//         </div>
//       </div>
//     )
//   }

//   const renderStars = (rating: number) => {
//     return Array.from({ length: 5 }).map((_, i) => (
//       <Star
//         key={i}
//         className={`w-5 h-5 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
//       />
//     ))
//   }

//   return (
//     <div className="min-h-screen pt-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Breadcrumb */}
//         <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
//           <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
//           <span>/</span>
//           <Link href={`/products?category=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
//           <span>/</span>
//           <span className="text-gray-900">{product.name}</span>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-12">
//           {/* Images */}
//           <div className="space-y-4">
//             <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
//               <Image src={product.images[selectedImage] || "/placeholder.svg"} alt={product.name} fill className="object-cover" priority />
//               {product.discount && <Badge className="absolute top-4 left-4 bg-red-500 text-white">-{product.discount}% OFF</Badge>}
//             </div>
//             <div className="grid grid-cols-4 gap-4">
//               {product.images.map((image: string, index: number) => (
//                 <button key={index} onClick={() => setSelectedImage(index)} className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? "border-primary" : "border-gray-200"}`}><Image src={image || "/placeholder.svg"} alt={`${product.name} ${index + 1}`} fill className="object-cover" /></button>
//               ))}
//             </div>
//           </div>

//           {/* Product Info */}
//           <div className="space-y-6">
//             <div>
//               <div className="flex items-center gap-2 mb-2">
//                 <Badge variant="outline">{product.category}</Badge>
//                 {product.features && <Badge className="bg-accent text-black">Featured</Badge>}
//               </div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="flex items-center">{renderStars(product.rating || 0)}</div>
//                 <span className="text-gray-600">({product.reviews || 0} reviews)</span>
//               </div>
//               <div className="flex items-center gap-4 mb-6">
//                 <span className="text-3xl font-bold text-primary">${product.price.toLocaleString()}</span>
//                 {product.originalPrice && <span className="text-xl text-gray-400 line-through">${product.originalPrice.toLocaleString()}</span>}
//               </div>
//             </div>

//             <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-200">
//               {product.wattage && <div className="text-center"><Zap className="w-8 h-8 text-primary mx-auto mb-2" /><div className="font-medium">{product.wattage}W</div><div className="text-sm text-gray-600">Power Output</div></div>}
//               <div className="text-center"><Shield className="w-8 h-8 text-primary mx-auto mb-2" /><div className="font-medium">25 Years</div><div className="text-sm text-gray-600">Warranty</div></div>
//               <div className="text-center"><Truck className="w-8 h-8 text-primary mx-auto mb-2" /><div className="font-medium">Free</div><div className="text-sm text-gray-600">Shipping</div></div>
//             </div>

//             <div className="space-y-4">
//               <div className="flex items-center gap-4"><label className="font-medium">Quantity:</label><div className="flex items-center border border-gray-300 rounded-lg"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-100 transition-colors">-</button><span className="px-4 py-2 border-x border-gray-300">{quantity}</span><button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-gray-100 transition-colors">+</button></div></div>
//               <div className="flex gap-4">
//                 <Button onClick={handleAddToCart} disabled={isAddingToCart || !product.inStock} className="flex-1 bg-accent text-black hover:bg-accent/90 font-semibold py-3 rounded-2xl" size="lg">
//                   {isAddingToCart ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" /> : <ShoppingCart className="w-5 h-5 mr-2" />}
//                   {product.inStock ? "Add to Cart" : "Out of Stock"}
//                 </Button>
//                 <Button variant="outline" size="lg" className="px-6 rounded-2xl bg-transparent"><Heart className="w-5 h-5" /></Button>
//                 <Button variant="outline" size="lg" className="px-6 rounded-2xl bg-transparent"><Share2 className="w-5 h-5" /></Button>
//               </div>
//               {product.inStock && <p className="text-green-600 text-sm">✓ In stock and ready to ship</p>}
//             </div>
//           </div>
//         </div>

//         {/* --- The Complete and Corrected Tabs Section --- */}
//         <div className="mt-16">
//           <Tabs defaultValue="overview" className="w-full">
//             <TabsList className="grid w-full grid-cols-3">
//               <TabsTrigger value="overview">Overview</TabsTrigger>
//               <TabsTrigger value="specs">Specifications</TabsTrigger>
//               <TabsTrigger value="reviews">Reviews</TabsTrigger>
//             </TabsList>

//             <TabsContent value="overview" className="mt-8">
//               <div className="prose max-w-none">
//                 <h3 className="text-2xl font-bold mb-4">Product Overview</h3>
//                 <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
                
//                 {product.features && product.features.length > 0 && (
//                     <>
//                         <h4 className="text-xl font-semibold mb-3">Key Features</h4>
//                         <ul className="list-disc list-inside space-y-2 text-gray-700">
//                             {product.features.map((feature: string, index: number) => (
//                                 <li key={index}>{feature}</li>
//                             ))}
//                         </ul>
//                     </>
//                 )}
//               </div>
//             </TabsContent>

//             <TabsContent value="specs" className="mt-8">
//               <div className="grid md:grid-cols-2 gap-8">
//                 <div>
//                   <h3 className="text-2xl font-bold mb-4">Technical Specifications</h3>
//                   <div className="space-y-3">
//                     {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
//                       <div key={key} className="flex justify-between py-2 border-b border-gray-200">
//                         <span className="font-medium text-gray-900">{key}:</span>
//                         <span className="text-gray-700">{value as string}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <div>
//                   <h4 className="text-xl font-semibold mb-4">Dimensions & Weight</h4>
//                   <div className="bg-gray-50 rounded-lg p-6">
//                     <div className="space-y-2">
//                       <div className="flex justify-between"><span>Length:</span><span>{product.dimensions?.length || "N/A"}</span></div>
//                       <div className="flex justify-between"><span>Width:</span><span>{product.dimensions?.width || "N/A"}</span></div>
//                       <div className="flex justify-between"><span>Height:</span><span>{product.dimensions?.height || "N/A"}</span></div>
//                       <div className="flex justify-between"><span>Weight:</span><span>{product.weight || "N/A"}</span></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>

//             <TabsContent value="reviews" className="mt-8">
//               <div className="space-y-8">
//                 <div className="flex items-center gap-8">
//                   <div className="text-center">
//                     <div className="text-4xl font-bold text-primary mb-2">{product.rating || 0}</div>
//                     <div className="flex items-center justify-center mb-2">{renderStars(product.rating || 0)}</div>
//                     <div className="text-gray-600">{product.reviews || 0} reviews</div>
//                   </div>
//                   <div className="flex-1">
//                     {[5, 4, 3, 2, 1].map((stars) => (<div key={stars} className="flex items-center gap-2 mb-2"><span className="w-3">{stars}</span><Star className="w-4 h-4 text-yellow-400 fill-current" /><div className="flex-1 bg-gray-200 rounded-full h-2"><div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${Math.random() * 100}%` }}></div></div><span className="text-sm text-gray-600 w-12">{Math.floor(Math.random() * 50)}</span></div>))}
//                   </div>
//                 </div>
//                 <div className="space-y-6">
//                   {Array.from({ length: 3 }).map((_, index) => (<div key={index} className="border-b border-gray-200 pb-6"><div className="flex items-center gap-4 mb-3"><div className="w-10 h-10 bg-gray-300 rounded-full"></div><div><div className="font-medium">Customer {index + 1}</div><div className="flex items-center gap-2">{renderStars(5)}<span className="text-sm text-gray-600">2 days ago</span></div></div></div><p className="text-gray-700">Great product! Excellent quality and fast shipping. Would definitely recommend to others.</p></div>))}
//                 </div>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   )
// }

// // File: /app/products/page.tsx

// "use client"

// import { useMemo, useState } from "react"
// import { Loader2, SlidersHorizontal } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"
// import { FilterSidebar, FilterState } from "@/components/FilterSidebar" // <-- Import the sidebar

// import { useProducts } from "@/hooks/useProducts"
// import { Product } from "@/components/types/product"

// export default function ProductsPage() {
//   // --- State for filters is now managed here ---
//   const [filters, setFilters] = useState<FilterState>({
//     category: "all",
//     minPrice: 0,
//     maxPrice: 10000,
//     brand: "",
//     wattage: "all",
//     inStock: false,
//   });
//   const [sort, setSort] = useState("featured");

//   // The useProducts hook now receives all filters
//   const {
//     data,
//     error,
//     isLoading,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//   } = useProducts({ ...filters, sort });

//   // Flatten the paginated data into a single array
//   const products = useMemo(() => data?.pages.flatMap(page => page) || [], [data]);

//   const handleFiltersChange = (newFilters: Partial<FilterState>) => {
//     setFilters(prev => ({ ...prev, ...newFilters }));
//   };
  
//   if (error) return <div className="text-center text-red-500 p-8">Error: {error.message}</div>

//   return (
//     <div className="min-h-screen pt-20 bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Our Solar Products</h1>
//           <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
//             Power your life with our range of high-efficiency solar panels, inverters, and energy solutions.
//           </p>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">
          
//           <aside className="w-full lg:w-1/4 xl:w-1/5">
//             <FilterSidebar
//               filters={filters}
//               onFiltersChange={handleFiltersChange}
//             />
//           </aside>
          
//           <main className="w-full lg:flex-1">
//             <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
//                 <p className="text-sm text-gray-600">Showing <span className="font-semibold">{products.length}</span> results</p>
//                 <Select value={sort} onValueChange={setSort}>
//                     <SelectTrigger className="w-48">
//                         <SlidersHorizontal className="w-4 h-4 mr-2" />
//                         <SelectValue placeholder="Sort by" />
//                     </SelectTrigger>
//                     <SelectContent>
//                         <SelectItem value="featured">Featured</SelectItem>
//                         <SelectItem value="price-asc">Price: Low to High</SelectItem>
//                         <SelectItem value="price-desc">Price: High to Low</SelectItem>
//                     </SelectContent>
//                 </Select>
//             </div>

//             {isLoading ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {Array.from({ length: 9 }).map((_, i) => <ProductCardSkeleton key={i} />)}
//               </div>
//             ) : products.length > 0 ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {products.map((product: Product) => (
//                   <ProductCard key={product._id} product={product} />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-16 bg-white rounded-lg shadow-sm">
//                 <h2 className="text-2xl font-bold text-gray-800">No Products Found</h2>
//                 <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
//               </div>
//             )}

//             <div className="mt-12 text-center">
//               {hasNextPage && (
//                 <Button size="lg" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
//                   {isFetchingNextPage ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...</>) : ('Load More Products')}
//                 </Button>
//               )}
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   )
// }   


// // // File: /app/products/page.tsx
// // "use client"

// // import { useMemo, useState } from "react"
// // import { Filter, Loader2, Plus, SlidersHorizontal } from "lucide-react"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent } from "@/components/ui/card"
// // import { Input } from "@/components/ui/input"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"

// // import { useProducts } from "@/hooks/useProducts"
// // import { Product } from "@/components/types/product"
// // import { AddProductDialog } from "@/components/AddProductDialog"

// // export default function ProductsPage() {
// //   const [filters, setFilters] = useState({ sort: "featured", category: "all" })
// //   const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)

// //   const {
// //     data,
// //     error,
// //     isLoading,
// //     fetchNextPage,
// //     hasNextPage,
// //     isFetchingNextPage,
// //   } = useProducts({ limit: 12 });

// //   const products = useMemo(() => data?.pages.flatMap(page => page) || [], [data]);

// //   if (error) return <div className="text-center text-red-500 p-8">Error: {error.message}</div>

// //   return (
// //     <div className="min-h-screen pt-20 bg-gray-50">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         {/* Header */}
// //         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
// //           <div>
// //             <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
// //             <p className="text-gray-600 mt-2">Explore our range of high-quality solar solutions.</p>
// //           </div>
// //           <Button onClick={() => setIsAddProductDialogOpen(true)}>
// //             <Plus className="w-4 h-4 mr-2" />
// //             Add New Product
// //           </Button>
// //         </div>

// //         {/* Filters */}
// //         <Card className="mb-8">
// //           <CardContent className="pt-6 flex flex-col md:flex-row items-center gap-4">
// //             <div className="relative w-full md:w-auto md:flex-1">
// //               <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
// //               <Input placeholder="Filter products..." className="pl-10" />
// //             </div>
// //             <Select value={filters.category} onValueChange={(value) => setFilters(f => ({ ...f, category: value }))}>
// //               <SelectTrigger className="w-full md:w-48">
// //                 <SelectValue placeholder="All Categories" />
// //               </SelectTrigger>
// //               <SelectContent>
// //                 <SelectItem value="all">All Categories</SelectItem>
// //                 <SelectItem value="Solar Panels">Solar Panels</SelectItem>
// //                 <SelectItem value="Inverters">Inverters</SelectItem>
// //                 <SelectItem value="Batteries">Batteries</SelectItem>
// //                 <SelectItem value="Controllers">Controllers</SelectItem>
// //               </SelectContent>
// //             </Select>
// //             <Select value={filters.sort} onValueChange={(value) => setFilters(f => ({ ...f, sort: value }))}>
// //               <SelectTrigger className="w-full md:w-48">
// //                 <SlidersHorizontal className="w-4 h-4 mr-2" />
// //                 <SelectValue placeholder="Sort by" />
// //               </SelectTrigger>
// //               <SelectContent>
// //                 <SelectItem value="featured">Featured</SelectItem>
// //                 <SelectItem value="price-asc">Price: Low to High</SelectItem>
// //                 <SelectItem value="price-desc">Price: High to Low</SelectItem>
// //               </SelectContent>
// //             </Select>
// //           </CardContent>
// //         </Card>

// //         {/* Products Grid */}
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// //           {isLoading ? (
// //             Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
// //           ) : (
// //             products.map((product: Product) => (
// //               <ProductCard key={product._id} product={product} />
// //             ))
// //           )}
// //         </div>

// //         {/* Load More Button */}
// //         <div className="mt-12 text-center">
// //           {hasNextPage && (
// //             <Button
// //               size="lg"
// //               onClick={() => fetchNextPage()}
// //               disabled={isFetchingNextPage}
// //             >
// //               {isFetchingNextPage ? (
// //                 <>
// //                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //                   Loading...
// //                 </>
// //               ) : (
// //                 'Load More Products'
// //               )}
// //             </Button>
// //           )}
// //           {!isLoading && !hasNextPage && (
// //              <p className="text-gray-500">You've reached the end of the list.</p>
// //           )}
// //         </div>
// //       </div>
// //       <AddProductDialog isOpen={isAddProductDialogOpen} onClose={() => setIsAddProductDialogOpen(false)} />
// //     </div>
// //   )
// // }

// // "use client"

// // import { useState, useEffect, useMemo } from "react"
// // import { useSearchParams } from "next/navigation"
// // import { ProductCard } from "@/components/ProductCard"
// // import { FilterSidebar } from "@/components/FilterSidebar"
// // import { Button } from "@/components/ui/button"
// // import { useProducts } from "@/hooks/useProducts"
// // import { Filter, Grid, List } from "lucide-react"

// // export default function ProductsPage() {
// //   const searchParams = useSearchParams()
// //   const [showFilters, setShowFilters] = useState(false)
// //   const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
// //   const [filters, setFilters] = useState({
// //     category: "",
// //     minPrice: 0,
// //     maxPrice: 10000,
// //     brand: "",
// //     wattage: "",
// //     inStock: false,
// //   })

// //   // Memoize filters to prevent unnecessary re-renders
// //   const memoizedFilters = useMemo(() => filters, Object.values(filters))

// //   const { data: products, isLoading, hasMore, loadMore } = useProducts(memoizedFilters)

// //   useEffect(() => {
// //     const category = searchParams.get("category")
// //     if (category && category !== filters.category) {
// //       setFilters((prev) => ({ ...prev, category }))
// //     }
// //   }, [searchParams, filters.category])

// //   if (isLoading && !products?.length) {
// //     return (
// //       <div className="min-h-screen pt-20">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //           <div className="flex gap-8">
// //             <div className="w-64 hidden lg:block">
// //               <div className="bg-gray-100 rounded-2xl h-96 loading-skeleton"></div>
// //             </div>
// //             <div className="flex-1">
// //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                 {Array.from({ length: 9 }).map((_, i) => (
// //                   <div key={i} className="bg-gray-100 rounded-2xl h-80 loading-skeleton"></div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="min-h-screen pt-20">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         {/* Header */}
// //         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
// //           <div>
// //             <h1 className="text-3xl font-bold text-gray-900 mb-2">
// //               {filters.category
// //                 ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1).replace("-", " ")}`
// //                 : "All Products"}
// //             </h1>
// //             <p className="text-gray-600">{products?.length || 0} products found</p>
// //           </div>

// //           <div className="flex items-center gap-4 mt-4 md:mt-0">
// //             {/* Mobile filter toggle */}
// //             <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
// //               <Filter className="w-4 h-4 mr-2" />
// //               Filters
// //             </Button>

// //             {/* View mode toggle */}
// //             <div className="flex border rounded-lg">
// //               <Button
// //                 variant={viewMode === "grid" ? "default" : "ghost"}
// //                 size="sm"
// //                 onClick={() => setViewMode("grid")}
// //                 className="rounded-r-none"
// //               >
// //                 <Grid className="w-4 h-4" />
// //               </Button>
// //               <Button
// //                 variant={viewMode === "list" ? "default" : "ghost"}
// //                 size="sm"
// //                 onClick={() => setViewMode("list")}
// //                 className="rounded-l-none"
// //               >
// //                 <List className="w-4 h-4" />
// //               </Button>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="flex gap-8">
// //           {/* Sidebar */}
// //           <div className={`w-64 ${showFilters ? "block" : "hidden"} lg:block`}>
// //             <FilterSidebar filters={filters} onFiltersChange={setFilters} onClose={() => setShowFilters(false)} />
// //           </div>

// //           {/* Products */}
// //           <div className="flex-1">
// //             <div
// //               className={`grid gap-6 ${
// //                 viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
// //               }`}
// //             >
// //               {products?.map((product) => (
// //                 <ProductCard key={product.id} product={product} />
// //               ))}
// //             </div>

// //             {/* Load More */}
// //             {hasMore && (
// //               <div className="text-center mt-12">
// //                 <Button onClick={loadMore} disabled={isLoading} size="lg" className="px-8">
// //                   {isLoading ? "Loading..." : "Load More Products"}
// //                 </Button>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }