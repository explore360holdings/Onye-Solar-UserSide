"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { ShoppingCart, Heart, Share2, Shield, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShareDialog } from "@/components/ShareDialog"
import { useProduct } from "@/hooks/useProducts"
import { useCart } from "@/hooks/useCart"
import { useWishlist, WishlistItem } from "@/lib/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)

  const { data: product, isLoading } = useProduct(slug)
  const { addItem } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  const handleAddToCart = async () => {
    if (!product) return

    setIsAddingToCart(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
    })

    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} added to your cart.`,
    })

    setIsAddingToCart(false)
    setQuantity(1)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    if (product && newQuantity > product.stock) {
      toast({
        title: "Stock limit reached",
        description: `Only ${product.stock} items available`,
        variant: "destructive"
      })
      return
    }
    setQuantity(newQuantity)
  }

  const handleToggleWishlist = () => {
    if (!product) return

    const wishlistItem: WishlistItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    }

    const wasAdded = toggleWishlist(wishlistItem)

    toast({
      title: wasAdded ? "Added to Wishlist" : "Removed from Wishlist",
      description: wasAdded
        ? `${product.name} has been added to your wishlist.`
        : `${product.name} has been removed from your wishlist.`,
    })
  }

  const handleShare = async () => {
    if (!product) return

    const shareData = {
      title: product.name,
      text: `Check out ${product.name} - ₦${product.price}`,
      url: window.location.href,
    }

    console.log('Share clicked, showing dialog')
    // Always show dialog for better UX
    setShowShareDialog(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link href="/products"><Button>Back to Products</Button></Link>
        </div>
      </div>
    )
  }

  const categoryName = typeof product.category === 'string'
    ? product.category
    : (product.category as any)?.name || 'Products'

  const brandName = typeof product.brand === 'string'
    ? product.brand
    : (product.brand as any)?.name || null

  const isInStock = product.stock > 0

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${categoryName}`} className="hover:text-primary transition-colors">{categoryName}</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? "border-primary" : "border-gray-200"}`}
                >
                  <Image src={image || "/placeholder.svg"} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{categoryName}</Badge>
                {brandName && <Badge variant="outline" className="bg-blue-50">{brandName}</Badge>}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">₦{product.price.toLocaleString()}</span>
                {isInStock ? (
                  <Badge className="bg-green-100 text-green-700 border-green-300">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-200">
              <div className="text-center">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-medium">25 Years</div>
                <div className="text-sm text-gray-600">Warranty</div>
              </div>
              <div className="text-center">
                <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-medium">Free</div>
                <div className="text-sm text-gray-600">Shipping</div>
              </div>
            </div>

            {isInStock && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="font-medium">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-6 py-2 border-x border-gray-300 min-w-[60px] text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl"
                    size="lg"
                  >
                    {isAddingToCart ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <ShoppingCart className="w-5 h-5 mr-2" />
                    )}
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-6 rounded-xl"
                    onClick={handleToggleWishlist}
                  >
                    <Heart
                      className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : ''}`}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-6 rounded-xl"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8">
              <div className="prose max-w-none">
                <h3 className="text-2xl font-bold mb-4">Product Overview</h3>
                <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

                {product.features && product.features.length > 0 && (
                  <>
                    <h4 className="text-xl font-semibold mb-3">Key Features</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {product.features.map((feature: string, index: number) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="specs" className="mt-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Technical Specifications</h3>
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                          <span className="font-medium text-gray-900">{key}:</span>
                          <span className="text-gray-700">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No specifications available</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        productName={product.name}
        productUrl={typeof window !== 'undefined' ? window.location.href : ''}
        productPrice={product.price}
      />
    </div>
  )
}
