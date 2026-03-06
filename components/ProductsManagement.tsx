// File: /components/ProductsManagement.tsx
"use client"

import { useState, useMemo } from "react"
import { Search, Plus, Edit, Trash2, Eye, Package, Upload, Filter } from "lucide-react" // Added Filter icon
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { AddProductDialog } from "./AddProductDialog"

import { useProducts, useDeleteProduct, useBulkDeleteProducts } from "@/hooks/useProducts"
import { Product } from "@/components/types/product"

export function ProductsManagement() {
  // State for filters and selections
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const { toast } = useToast()
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)

  // Fetching real data with React Query hooks
  const { data: productsData, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useProducts()
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct()
  const { mutate: bulkDelete, isPending: isBulkDeleting } = useBulkDeleteProducts()

  const products = useMemo(() => productsData?.pages.flatMap(page => page) || [], [productsData]);

  // Client-side filtering logic
  const filteredProducts = useMemo(() => {
    const productsWithStatus = products.map(p => ({
        ...p,
        status: p.stock > 0 ? 'active' : 'inactive' as 'active' | 'inactive',
    }));

    return productsWithStatus.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
      const matchesStatus = statusFilter === "all" || product.status === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [products, searchTerm, categoryFilter, statusFilter])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map((p) => p._id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId])
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    }
  }
  
  const handleDeleteSelected = () => {
    bulkDelete({ ids: selectedProducts }, {
        onSuccess: (data) => {
            toast({ title: "Success", description: `${data.count} products deleted.` });
            setSelectedProducts([]);
        },
        onError: (error) => {
            toast({ title: "Error", description: error.message, variant: 'destructive' });
        }
    });
  };

  if (isLoading && !productsData) { // Only show full-page loader on initial load
    return (
        <div className="flex justify-center items-center h-96">
            <Package className="w-12 h-12 animate-pulse text-primary" />
            <p className="ml-4 text-lg text-gray-600">Loading Products...</p>
        </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-600 p-8 bg-red-50 rounded-lg">Failed to load products. Please try again later.</div>;
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-2">Manage your solar product inventory ({products.length} total)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Upload className="w-4 h-4 mr-2" />Import</Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsAddProductDialogOpen(true)}><Plus className="w-4 h-4 mr-2" />Add Product</Button>
        </div>
      </div>

      {/* --- Main Layout with Sidebar --- */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* --- Sidebar for Filters --- */}
        <aside className="w-full lg:w-1/4 xl:w-1/5">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Filter className="w-5 h-5" /><span>Filter & Sort</span></CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="search-admin" className="text-sm font-medium">Search</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input id="search-admin" placeholder="Product name..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="Solar Panels">Solar Panels</SelectItem>
                            <SelectItem value="Inverters">Inverters</SelectItem>
                            <SelectItem value="Batteries">Batteries</SelectItem>
                            <SelectItem value="Controllers">Controllers</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger><SelectValue placeholder="All Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
              </CardContent>
            </Card>
        </aside>

        {/* --- Main Content: Table and Actions --- */}
        <main className="w-full lg:flex-1 space-y-6">
          {selectedProducts.length > 0 && (
            <Card className="border-primary bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{selectedProducts.length} product(s) selected</span>
                  <div className="flex gap-2"><Button variant="outline" size="sm">Bulk Edit</Button><Button variant="outline" size="sm">Update Stock</Button><Button variant="destructive" size="sm" onClick={handleDeleteSelected} disabled={isBulkDeleting}>{isBulkDeleting ? 'Deleting...' : 'Delete Selected'}</Button></div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>Products ({filteredProducts.length} showing)</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b"><th className="text-left p-4"><input type="checkbox" onChange={(e) => handleSelectAll(e.target.checked)} checked={filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length} /></th><th className="text-left p-4 font-medium">Product</th><th className="text-left p-4 font-medium">Category</th><th className="text-left p-4 font-medium">Price</th><th className="text-left p-4 font-medium">Stock</th><th className="text-left p-4 font-medium">Status</th><th className="text-left p-4 font-medium">Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product._id} className="border-b hover:bg-gray-50">
                        <td className="p-4"><input type="checkbox" checked={selectedProducts.includes(product._id)} onChange={(e) => handleSelectProduct(product._id, e.target.checked)} /></td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Image src={product.images[0] || "/placeholder.svg"} alt={product.name} width={48} height={48} className="rounded-lg object-cover" />
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">{product.category}</td>
                        <td className="p-4 font-bold">₦{product.price.toLocaleString()}</td>
                        <td className="p-4"><span className={`font-medium ${ product.stock === 0 ? "text-red-600" : product.stock < 10 ? "text-orange-600" : "text-gray-900"}`}>{product.stock}</span></td>
                        <td className="p-4"><Badge variant={product.status === "active" ? "default" : "secondary"} className={product.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>{product.status}</Badge></td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm"><Eye className="w-4 h-4" /></Button>
                            <Button variant="outline" size="sm"><Edit className="w-4 h-4" /></Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => deleteProduct(product._id)} disabled={isDeleting}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {hasNextPage && (
                <div className="pt-4 text-center">
                    <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                        {isFetchingNextPage ? 'Loading more...' : 'Load More Products'}
                    </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
      <AddProductDialog isOpen={isAddProductDialogOpen} onClose={() => setIsAddProductDialogOpen(false)} />
    </div>
  )
}

// "use client"

// import { useState } from "react"
// import { Search, Plus, Edit, Trash2, Eye, Package, Upload } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import Image from "next/image"
// import { useToast } from "@/hooks/use-toast"
// import { AddProductDialog } from "./AddProductDialog"

// const mockProducts = [
//   {
//     id: "1",
//     name: "SolarMax Pro 400W Solar Panel",
//     sku: "SM-400W-PRO",
//     category: "Solar Panels",
//     price: 299,
//     stock: 45,
//     status: "active",
//     image: "/placeholder.svg?height=60&width=60",
//     featured: true,
//   },
//   {
//     id: "2",
//     name: "PowerTech 3000W Inverter",
//     sku: "PT-3000W-INV",
//     category: "Inverters",
//     price: 599,
//     stock: 23,
//     status: "active",
//     image: "/placeholder.svg?height=60&width=60",
//     featured: false,
//   },
//   {
//     id: "3",
//     name: "EcoSolar 200Ah Battery",
//     sku: "ES-200AH-BAT",
//     category: "Batteries",
//     price: 899,
//     stock: 8,
//     status: "active",
//     image: "/placeholder.svg?height=60&width=60",
//     featured: true,
//   },
//   {
//     id: "4",
//     name: "GreenEnergy MPPT Controller",
//     sku: "GE-MPPT-60A",
//     category: "Controllers",
//     price: 199,
//     stock: 0,
//     status: "inactive",
//     image: "/placeholder.svg?height=60&width=60",
//     featured: false,
//   },
// ]

// export function ProductsManagement() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [categoryFilter, setCategoryFilter] = useState("all")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [selectedProducts, setSelectedProducts] = useState<string[]>([])

//   const { toast } = useToast()
//   const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)

//   const filteredProducts = mockProducts.filter((product) => {
//     const matchesSearch =
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.sku.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
//     const matchesStatus = statusFilter === "all" || product.status === statusFilter
//     return matchesSearch && matchesCategory && matchesStatus
//   })

//   const handleSelectAll = (checked: boolean) => {
//     if (checked) {
//       setSelectedProducts(filteredProducts.map((p) => p.id))
//     } else {
//       setSelectedProducts([])
//     }
//   }

//   const handleSelectProduct = (productId: string, checked: boolean) => {
//     if (checked) {
//       setSelectedProducts([...selectedProducts, productId])
//     } else {
//       setSelectedProducts(selectedProducts.filter((id) => id !== productId))
//     }
//   }

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
//           <p className="text-gray-600 mt-2">Manage your solar product inventory</p>
//         </div>
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             onClick={() =>
//               toast({ title: "Import Products", description: "Import functionality would be triggered here." })
//             }
//           >
//             <Upload className="w-4 h-4 mr-2" />
//             Import
//           </Button>
//           <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsAddProductDialogOpen(true)}>
//             <Plus className="w-4 h-4 mr-2" />
//             Add Product
//           </Button>
//         </div>
//       </div>

//       {/* Filters */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input
//                 placeholder="Search products by name or SKU..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <Select value={categoryFilter} onValueChange={setCategoryFilter}>
//               <SelectTrigger className="w-48">
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
//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//               <SelectTrigger className="w-48">
//                 <SelectValue placeholder="All Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 <SelectItem value="active">Active</SelectItem>
//                 <SelectItem value="inactive">Inactive</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Bulk Actions */}
//       {selectedProducts.length > 0 && (
//         <Card className="border-primary bg-primary/5">
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">{selectedProducts.length} product(s) selected</span>
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() =>
//                     toast({ title: "Bulk Edit", description: `Editing ${selectedProducts.length} selected products.` })
//                   }
//                 >
//                   Bulk Edit
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() =>
//                     toast({
//                       title: "Update Stock",
//                       description: `Updating stock for ${selectedProducts.length} selected products.`,
//                     })
//                   }
//                 >
//                   Update Stock
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   size="sm"
//                   onClick={() =>
//                     toast({
//                       title: "Delete Selected",
//                       description: `Deleting ${selectedProducts.length} selected products.`,
//                     })
//                   }
//                 >
//                   Delete Selected
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Products Table */}
//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle>Products ({filteredProducts.length})</CardTitle>
//             <div className="flex gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => toast({ title: "Stock Alert", description: "Generating stock alert report." })}
//               >
//                 <Package className="w-4 h-4 mr-2" />
//                 Stock Alert
//               </Button>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   <th className="text-left py-3 px-4">
//                     <input
//                       type="checkbox"
//                       onChange={(e) => handleSelectAll(e.target.checked)}
//                       checked={selectedProducts.length === filteredProducts.length}
//                       className="rounded"
//                     />
//                   </th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-900">SKU</th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-900">Stock</th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredProducts.map((product) => (
//                   <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
//                     <td className="py-4 px-4">
//                       <input
//                         type="checkbox"
//                         checked={selectedProducts.includes(product.id)}
//                         onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
//                         className="rounded"
//                       />
//                     </td>
//                     <td className="py-4 px-4">
//                       <div className="flex items-center space-x-3">
//                         <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
//                           <Image
//                             src={product.image || "/placeholder.svg"}
//                             alt={product.name}
//                             fill
//                             className="object-cover"
//                           />
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-900">{product.name}</p>
//                           {product.featured && (
//                             <Badge variant="outline" className="mt-1 text-xs">
//                               Featured
//                             </Badge>
//                           )}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="py-4 px-4 text-gray-600 font-mono text-sm">{product.sku}</td>
//                     <td className="py-4 px-4 text-gray-600">{product.category}</td>
//                     <td className="py-4 px-4">
//                       <span className="font-bold text-gray-900">${product.price.toLocaleString()}</span>
//                     </td>
//                     <td className="py-4 px-4">
//                       <span
//                         className={`font-medium ${
//                           product.stock === 0
//                             ? "text-red-600"
//                             : product.stock < 10
//                               ? "text-orange-600"
//                               : "text-gray-900"
//                         }`}
//                       >
//                         {product.stock}
//                       </span>
//                       {product.stock < 10 && product.stock > 0 && (
//                         <Badge variant="outline" className="ml-2 text-xs text-orange-600 border-orange-600">
//                           Low Stock
//                         </Badge>
//                       )}
//                       {product.stock === 0 && (
//                         <Badge variant="destructive" className="ml-2 text-xs">
//                           Out of Stock
//                         </Badge>
//                       )}
//                     </td>
//                     <td className="py-4 px-4">
//                       <Badge
//                         variant={product.status === "active" ? "default" : "secondary"}
//                         className={
//                           product.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
//                         }
//                       >
//                         {product.status}
//                       </Badge>
//                     </td>
//                     <td className="py-4 px-4">
//                       <div className="flex gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() =>
//                             toast({ title: "View Product", description: `Viewing details for ${product.name}.` })
//                           }
//                         >
//                           <Eye className="w-4 h-4" />
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() =>
//                             toast({ title: "Edit Product", description: `Editing product ${product.name}.` })
//                           }
//                         >
//                           <Edit className="w-4 h-4" />
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           className="text-red-600 hover:text-red-700 bg-transparent"
//                           onClick={() =>
//                             toast({ title: "Delete Product", description: `Deleting product ${product.name}.` })
//                           }
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//       <AddProductDialog isOpen={isAddProductDialogOpen} onClose={() => setIsAddProductDialogOpen(false)} />
//     </div>
//   )
// }
