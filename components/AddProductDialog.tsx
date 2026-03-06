// File: /components/AddProductDialog.tsx
"use client"

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAddProduct } from "@/hooks/useProducts";
import { CreateProductData } from "@/components/types/product"; // This now imports the CORRECT type
import { useToast } from "@/hooks/use-toast";

interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// The initial state now correctly includes the 'brand' field
const initialState: Partial<CreateProductData> = {
  name: "",
  brand: "",
  description: "",
  price: 0,
  category: "",
  stock: 0,
};

export function AddProductDialog({ isOpen, onClose }: AddProductDialogProps) {
  const [formData, setFormData] = useState(initialState);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const { toast } = useToast();
  const { mutate: addProduct, isPending } = useAddProduct();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: 'category', value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(e.target.files);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFiles || imageFiles.length === 0) {
        toast({ title: "Validation Error", description: "Please upload at least one product image.", variant: "destructive" });
        return;
    }
    
    // The submission data object now correctly includes 'brand'
    const submissionData: CreateProductData = {
      name: formData.name!,
      brand: formData.brand!,
      description: formData.description!,
      price: Number(formData.price),
      category: formData.category!,
      stock: Number(formData.stock),
      images: imageFiles,
    };

    addProduct(submissionData, {
      onSuccess: () => {
        toast({ title: "Success!", description: "Product has been added successfully." });
        onClose();
        setFormData(initialState);
        setImageFiles(null);
      },
      onError: (error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new product to your inventory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            {/* The "Brand" input field is now valid */}
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" value={formData.brand} onChange={handleChange} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₦)</Label>
              <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" onValueChange={(value) => handleSelectChange('category', value)} required>
                <SelectTrigger id="category"><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Solar Panels">Solar Panels</SelectItem>
                  <SelectItem value="Inverters">Inverters</SelectItem>
                  <SelectItem value="Batteries">Batteries</SelectItem>
                  <SelectItem value="Controllers">Controllers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="images">Product Images</Label>
            <Input id="images" name="images" type="file" multiple onChange={handleImageChange} required />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding Product..." : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// // File: /components/AddProductDialog.tsx
// "use client"

// import { useState, ChangeEvent } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useAddProduct } from "@/hooks/useProducts";
// import { CreateProductData } from "@/components/types/product";
// import { useToast } from "@/hooks/use-toast";

// interface AddProductDialogProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// // Set a complete initial state for the form
// const initialState: Partial<CreateProductData> = {
//   name: "",
//   brand: "", // <-- FIX: Added brand
//   description: "",
//   price: 0,
//   category: "",
//   stock: 0,
// };

// export function AddProductDialog({ isOpen, onClose }: AddProductDialogProps) {
//   const [formData, setFormData] = useState(initialState);
//   const [imageFiles, setImageFiles] = useState<FileList | null>(null);
//   const { toast } = useToast();
//   const { mutate: addProduct, isPending } = useAddProduct();

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (name: 'category', value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setImageFiles(e.target.files);
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!imageFiles || imageFiles.length === 0) {
//         toast({ title: "Validation Error", description: "Please upload at least one product image.", variant: "destructive" });
//         return;
//     }

//     const submissionData: CreateProductData = {
//       name: formData.name!,
//       brand: formData.brand!, // <-- FIX: Include brand in submission
//       description: formData.description!,
//       price: Number(formData.price),
//       category: formData.category!,
//       stock: Number(formData.stock),
//       images: imageFiles,
//     };

//     addProduct(submissionData, {
//       onSuccess: () => {
//         toast({ title: "Success!", description: "Product has been added successfully." });
//         onClose(); // Close the dialog
//         setFormData(initialState); // Reset the form
//         setImageFiles(null);
//       },
//       onError: (error) => {
//         toast({ title: "Error", description: error.message, variant: "destructive" });
//       },
//     });
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[625px]">
//         <DialogHeader>
//           <DialogTitle>Add New Product</DialogTitle>
//           <DialogDescription>
//             Fill in the details below to add a new product to your inventory.
//           </DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="grid gap-6 py-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Product Name</Label>
//               <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
//             </div>
//             {/* --- FIX: Added the missing "Brand" input field --- */}
//             <div className="space-y-2">
//               <Label htmlFor="brand">Brand</Label>
//               <Input id="brand" name="brand" value={formData.brand} onChange={handleChange} required />
//             </div>
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="description">Description</Label>
//             <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
//           </div>
//           <div className="grid grid-cols-3 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="price">Price (₦)</Label>
//               <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="stock">Stock</Label>
//               <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="category">Category</Label>
//               <Select name="category" onValueChange={(value) => handleSelectChange('category', value)} required>
//                 <SelectTrigger id="category"><SelectValue placeholder="Select a category" /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Solar Panels">Solar Panels</SelectItem>
//                   <SelectItem value="Inverters">Inverters</SelectItem>
//                   <SelectItem value="Batteries">Batteries</SelectItem>
//                   <SelectItem value="Controllers">Controllers</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="images">Product Images</Label>
//             <Input id="images" name="images" type="file" multiple onChange={handleImageChange} required />
//           </div>
//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
//             <Button type="submit" disabled={isPending}>
//               {isPending ? "Adding Product..." : "Add Product"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // "use client"

// // import { useState } from "react"
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogDescription,
// //   DialogFooter,
// // } from "@/components/ui/dialog"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { Textarea } from "@/components/ui/textarea"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { useToast } from "@/hooks/use-toast"

// // interface AddProductDialogProps {
// //   isOpen: boolean
// //   onClose: () => void
// // }

// // export function AddProductDialog({ isOpen, onClose }: AddProductDialogProps) {
// //   const { toast } = useToast()
// //   const [productName, setProductName] = useState("")
// //   const [sku, setSku] = useState("")
// //   const [category, setCategory] = useState("")
// //   const [price, setPrice] = useState("")
// //   const [stock, setStock] = useState("")
// //   const [description, setDescription] = useState("")

// //   const handleAddProduct = () => {
// //     if (!productName || !sku || !category || !price || !stock) {
// //       toast({
// //         title: "Missing Information",
// //         description: "Please fill in all required product fields.",
// //         variant: "destructive",
// //       })
// //       return
// //     }

// //     // Simulate adding product to backend
// //     console.log("Adding product:", {
// //       productName,
// //       sku,
// //       category,
// //       price: Number.parseFloat(price),
// //       stock: Number.parseInt(stock),
// //       description,
// //     })

// //     toast({
// //       title: "Product Added!",
// //       description: `${productName} has been successfully added.`,
// //     })

// //     // Clear form and close dialog
// //     setProductName("")
// //     setSku("")
// //     setCategory("")
// //     setPrice("")
// //     setStock("")
// //     setDescription("")
// //     onClose()
// //   }

// //   return (
// //     <Dialog open={isOpen} onOpenChange={onClose}>
// //       <DialogContent className="sm:max-w-[600px]">
// //         <DialogHeader>
// //           <DialogTitle>Add New Product</DialogTitle>
// //           <DialogDescription>Fill in the details to add a new product to your inventory.</DialogDescription>
// //         </DialogHeader>
// //         <div className="grid gap-4 py-4">
// //           <div className="grid grid-cols-4 items-center gap-4">
// //             <Label htmlFor="productName" className="text-right">
// //               Product Name
// //             </Label>
// //             <Input
// //               id="productName"
// //               value={productName}
// //               onChange={(e) => setProductName(e.target.value)}
// //               className="col-span-3"
// //             />
// //           </div>
// //           <div className="grid grid-cols-4 items-center gap-4">
// //             <Label htmlFor="sku" className="text-right">
// //               SKU
// //             </Label>
// //             <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} className="col-span-3" />
// //           </div>
// //           <div className="grid grid-cols-4 items-center gap-4">
// //             <Label htmlFor="category" className="text-right">
// //               Category
// //             </Label>
// //             <Select value={category} onValueChange={setCategory}>
// //               <SelectTrigger className="col-span-3">
// //                 <SelectValue placeholder="Select category" />
// //               </SelectTrigger>
// //               <SelectContent>
// //                 <SelectItem value="Solar Panels">Solar Panels</SelectItem>
// //                 <SelectItem value="Inverters">Inverters</SelectItem>
// //                 <SelectItem value="Batteries">Batteries</SelectItem>
// //                 <SelectItem value="Controllers">Controllers</SelectItem>
// //               </SelectContent>
// //             </Select>
// //           </div>
// //           <div className="grid grid-cols-4 items-center gap-4">
// //             <Label htmlFor="price" className="text-right">
// //               Price ($)
// //             </Label>
// //             <Input
// //               id="price"
// //               type="number"
// //               value={price}
// //               onChange={(e) => setPrice(e.target.value)}
// //               className="col-span-3"
// //             />
// //           </div>
// //           <div className="grid grid-cols-4 items-center gap-4">
// //             <Label htmlFor="stock" className="text-right">
// //               Stock
// //             </Label>
// //             <Input
// //               id="stock"
// //               type="number"
// //               value={stock}
// //               onChange={(e) => setStock(e.target.value)}
// //               className="col-span-3"
// //             />
// //           </div>
// //           <div className="grid grid-cols-4 items-start gap-4">
// //             <Label htmlFor="description" className="text-right pt-2">
// //               Description
// //             </Label>
// //             <Textarea
// //               id="description"
// //               value={description}
// //               onChange={(e) => setDescription(e.target.value)}
// //               className="col-span-3"
// //               rows={4}
// //             />
// //           </div>
// //         </div>
// //         <DialogFooter>
// //           <Button variant="outline" onClick={onClose}>
// //             Cancel
// //           </Button>
// //           <Button onClick={handleAddProduct}>Add Product</Button>
// //         </DialogFooter>
// //       </DialogContent>
// //     </Dialog>
// //   )
// // }
