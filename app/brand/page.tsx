"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrandsPaginated } from "@/hooks/useBrands";
import { Brand } from "@/components/types/brands";

// Increased height and width for a more prominent logo
const BrandCardSkeleton = () => (
  <Card className="overflow-hidden h-full">
    <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
      <Skeleton className="h-24 w-48 mb-6" /> 
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
  </Card>
);


export default function BrandPage() {
  
  const { data, isLoading, isError } = useBrandsPaginated(1, 12); 

  const brands = data?.brands || [];

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header (No changes needed) */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Trusted Brands, Powerful Solutions
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            We partner with the world's leading solar technology manufacturers to bring you products you can rely on for decades to come.
          </p>
        </div>

        {/* --- 3. Render Skeleton, Error, or Real Data --- */}
        {/* Adjusted gap and added max-w-full to the grid for a clean look */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6"> 
          {isLoading ? (
            // If loading, show 12 skeleton cards (matching the fetch limit)
            Array.from({ length: 12 }).map((_, i) => <BrandCardSkeleton key={i} />)
          ) : isError ? (
            // If there's an error, show a message
            <p className="col-span-full text-center text-red-500">Failed to load brands.</p>
          ) : (
            // Map over the real brands array
            brands.map((brand: Brand) => (
              // Use Link around the Card for a full-card clickable area
              <Link key={brand._id} href={`/products?brand=${brand._id}`} className="block h-full">
                <Card 
                  className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-500/50 hover:bg-white h-full"
                >
                  {/* Changed padding to 'p-4' and ensured centered content */}
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                    
                    {/* Increased logo size container: h-24 w-full (or set a max-width if preferred) */}
                    <div className="relative h-24 w-full px-2 mb-2"> 
                      <Image
                        // Use the 'logo' property from your backend data
                        src={brand.logo || "/placeholder.svg"}
                        alt={`${brand.name} logo`}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    
                    {/* Add a subtle brand name below the logo, but focus remains on the image */}
                    <p className="mt-2 text-sm font-semibold text-gray-700 group-hover:text-blue-600">{brand.name}</p>
                    
                    {/* Removed description from the card grid view for cleaner look */}

                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Link href="/brands">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              See All Brands
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}



// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";

// import { useBrandsPaginated } from "@/hooks/useBrands";
// import { Brand } from "@/components/types/brands";

// const BrandCardSkeleton = () => (
//   <Card className="overflow-hidden">
//     <CardContent className="p-6 flex flex-col items-center text-center">
//       <Skeleton className="h-20 w-40 mb-6" />
//       <Skeleton className="h-6 w-32 mb-2" />
//       <Skeleton className="h-4 w-full" />
//       <Skeleton className="h-4 w-3/4 mt-1" />
//     </CardContent>
//   </Card>
// );


// export default function BrandPage() {
 
//   const { data, isLoading, isError } = useBrandsPaginated(1, 12); 

//   const brands = data?.brands || [];

//   return (
//     <div className="min-h-screen pt-20 bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         {/* Header (No changes needed) */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
//             Trusted Brands, Powerful Solutions
//           </h1>
//           <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
//             We partner with the world's leading solar technology manufacturers to bring you products you can rely on for decades to come.
//           </p>
//         </div>

//         {/* --- 3. Render Skeleton, Error, or Real Data --- */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//           {isLoading ? (
//             // If loading, show 8 skeleton cards
//             Array.from({ length: 8 }).map((_, i) => <BrandCardSkeleton key={i} />)
//           ) : isError ? (
//             // If there's an error, show a message
//             <p className="col-span-full text-center text-red-500">Failed to load brands.</p>
//           ) : (
//             // If data is loaded, map over the real brands array
//             brands.map((brand: Brand) => (
//               <Card key={brand._id} className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//                 <CardContent className="p-6 flex flex-col items-center text-center h-full">
//                   <div className="relative h-20 w-40 mb-6">
//                     <Image
//                       // Use the 'logo' property from your backend data
//                       src={brand.logo || "/placeholder.svg"}
//                       alt={`${brand.name} logo`}
//                       fill
//                       className="object-contain transition-transform duration-300 group-hover:scale-105"
//                     />
//                   </div>
//                   <h3 className="text-lg font-bold text-gray-900">{brand.name}</h3>
//                   <p className="mt-2 text-sm text-gray-600 flex-grow">{brand.description}</p>
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </div>

//         {/* Call to Action (No changes needed) */}
//         <div className="text-center mt-16">
//           <Link href="/products">
//             <Button size="lg" className="bg-primary hover:bg-primary/90">
//               Shop All Products
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }


// // // File: /app/brand/page.tsx
// // "use client";

// // import Image from "next/image";
// // import Link from "next/link";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Skeleton } from "@/components/ui/skeleton";

// // import { useBrandsPaginated } from "@/hooks/useBrands";
// // import { Brand } from "@/components/types/brands";

// // const BrandCardSkeleton = () => (
// //   <Card className="overflow-hidden">
// //     <CardContent className="p-6 flex flex-col items-center text-center">
// //       <Skeleton className="h-20 w-40 mb-6" />
// //       <Skeleton className="h-6 w-32 mb-2" />
// //       <Skeleton className="h-4 w-full" />
// //       <Skeleton className="h-4 w-3/4 mt-1" />
// //     </CardContent>
// //   </Card>
// // );

// // export default function BrandPage() {
// //   const { data, isLoading, isError } = useBrandsPaginated(1, 12); 
// //   const brands = data?.brands || [];

// //   return (
// //     <div className="min-h-screen pt-20 bg-gray-50">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
// //         <div className="text-center mb-12">
// //           <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
// //             Trusted Brands, Powerful Solutions
// //           </h1>
// //           <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
// //             We partner with the world's leading solar technology manufacturers to bring you products you can rely on for decades to come.
// //           </p>
// //         </div>

// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
// //           {isLoading ? (
// //             Array.from({ length: 8 }).map((_, i) => <BrandCardSkeleton key={i} />)
// //           ) : isError ? (
// //             <p className="col-span-full text-center text-red-500">Failed to load brands.</p>
// //           ) : (
// //             brands.map((brand: Brand) => (
// //               // --- FIX: Wrap the entire Card in a Link component ---
// //               // The href dynamically points to the brand detail page using the brand's _id.
// //               <Link key={brand._id} href={`/brand/${brand._id}`} className="block h-full">
// //                 <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
// //                   <CardContent className="p-6 flex flex-col items-center text-center h-full">
// //                     <div className="relative h-20 w-40 mb-6">
// //                       <Image
// //                         src={brand.logo || "/placeholder.svg"}
// //                         alt={`${brand.name} logo`}
// //                         fill
// //                         className="object-contain transition-transform duration-300 group-hover:scale-105"
// //                       />
// //                     </div>
// //                     <h3 className="text-lg font-bold text-gray-900">{brand.name}</h3>
// //                     <p className="mt-2 text-sm text-gray-600 flex-grow">{brand.description}</p>
// //                   </CardContent>
// //                 </Card>
// //               </Link>
// //             ))
// //           )}
// //         </div>

// //         <div className="text-center mt-16">
// //           <Link href="/products">
// //             <Button size="lg" className="bg-primary hover:bg-primary/90">
// //               Shop All Products
// //             </Button>
// //           </Link>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // File: /app/brand/page.tsx
// // "use client";

// // import Image from "next/image";
// // import Link from "next/link";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component

// // // --- 1. Import the hook to fetch real data ---
// // import { useBrandsPaginated } from "@/hooks/useBrands";
// // import { Brand } from "@/components/types/brand";

// // // --- A new Skeleton component for the loading state ---
// // const BrandCardSkeleton = () => (
// //   <Card className="overflow-hidden">
// //     <CardContent className="p-6 flex flex-col items-center text-center">
// //       <Skeleton className="h-20 w-40 mb-6" />
// //       <Skeleton className="h-6 w-32 mb-2" />
// //       <Skeleton className="h-4 w-full" />
// //       <Skeleton className="h-4 w-3/4 mt-1" />
// //     </CardContent>
// //   </Card>
// // );


// // export default function BrandPage() {
// //   // --- 2. Use the hook to fetch paginated brand data ---
// //   // We're fetching a larger limit since this isn't a paginated view yet
// //   const { data, isLoading, isError } = useBrandsPaginated(1, 12); 

// //   // The hook returns paginated data, so we extract the 'brands' array
// //   const brands = data?.brands || [];

// //   return (
// //     <div className="min-h-screen pt-20 bg-gray-50">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
// //         {/* Header (No changes needed) */}
// //         <div className="text-center mb-12">
// //           <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
// //             Trusted Brands, Powerful Solutions
// //           </h1>
// //           <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
// //             We partner with the world's leading solar technology manufacturers to bring you products you can rely on for decades to come.
// //           </p>
// //         </div>

// //         {/* --- 3. Render Skeleton, Error, or Real Data --- */}
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
// //           {isLoading ? (
// //             // If loading, show 8 skeleton cards
// //             Array.from({ length: 8 }).map((_, i) => <BrandCardSkeleton key={i} />)
// //           ) : isError ? (
// //             // If there's an error, show a message
// //             <p className="col-span-full text-center text-red-500">Failed to load brands.</p>
// //           ) : (
// //             // If data is loaded, map over the real brands array
// //             brands.map((brand: Brand) => (
// //               <Card key={brand._id} className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
// //                 <CardContent className="p-6 flex flex-col items-center text-center h-full">
// //                   <div className="relative h-20 w-40 mb-6">
// //                     <Image
// //                       // Use the 'logo' property from your backend data
// //                       src={brand.logo || "/placeholder.svg"}
// //                       alt={`${brand.name} logo`}
// //                       fill
// //                       className="object-contain transition-transform duration-300 group-hover:scale-105"
// //                     />
// //                   </div>
// //                   <h3 className="text-lg font-bold text-gray-900">{brand.name}</h3>
// //                   <p className="mt-2 text-sm text-gray-600 flex-grow">{brand.description}</p>
// //                 </CardContent>
// //               </Card>
// //             ))
// //           )}
// //         </div>

// //         {/* Call to Action (No changes needed) */}
// //         <div className="text-center mt-16">
// //           <Link href="/products">
// //             <Button size="lg" className="bg-primary hover:bg-primary/90">
// //               Shop All Products
// //             </Button>
// //           </Link>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// // // // File: /app/brand/page.tsx
// // // "use client";

// // // import Image from "next/image";
// // // import Link from "next/link";
// // // import { Button } from "@/components/ui/button";
// // // import { Card, CardContent } from "@/components/ui/card";

// // // // You would replace this with data fetched from your backend
// // // const brands = [
// // //   { name: "SolarMax", logoSrc: "/logos/solarmax.svg", description: "Pioneers in high-efficiency monocrystalline solar panels." },
// // //   { name: "PowerTech", logoSrc: "/logos/powertech.svg", description: "Reliable and powerful inverters for every scale of project." },
// // //   { name: "EcoSolar", logoSrc: "/logos/ecosolar.svg", description: "Long-lasting and sustainable battery storage solutions." },
// // //   { name: "GreenEnergy", logoSrc: "/logos/greenenergy.svg", description: "Advanced MPPT controllers for maximum power harvesting." },
// // //   { name: "SunPower", logoSrc: "/logos/sunpower.svg", description: "Industry-leading performance and durability." },
// // //   { name: "Tesla", logoSrc: "/logos/tesla.svg", description: "Revolutionizing energy storage with cutting-edge technology." },
// // //   { name: "LG", logoSrc: "/logos/lg.svg", description: "Trusted electronics giant bringing quality to solar energy." },
// // //   { name: "Panasonic", logoSrc: "/logos/panasonic.svg", description: "Decades of innovation in every solar cell." },
// // // ];

// // // export default function BrandPage() {
// // //   return (
// // //     <div className="min-h-screen pt-20 bg-gray-50">
// // //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
// // //         {/* Header */}
// // //         <div className="text-center mb-12">
// // //           <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
// // //             Trusted Brands, Powerful Solutions
// // //           </h1>
// // //           <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
// // //             We partner with the world's leading solar technology manufacturers to bring you products you can rely on for decades to come.
// // //           </p>
// // //         </div>

// // //         {/* Brand Grid */}
// // //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
// // //           {brands.map((brand) => (
// // //             <Card key={brand.name} className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
// // //               <CardContent className="p-6 flex flex-col items-center text-center">
// // //                 <div className="relative h-20 w-40 mb-6">
// // //                   {/* NOTE: You will need to add these logo files to your /public/logos/ directory */}
// // //                   <Image
// // //                     src={brand.logoSrc}
// // //                     alt={`${brand.name} logo`}
// // //                     fill
// // //                     className="object-contain transition-transform duration-300 group-hover:scale-105"
// // //                   />
// // //                 </div>
// // //                 <h3 className="text-lg font-bold text-gray-900">{brand.name}</h3>
// // //                 <p className="mt-2 text-sm text-gray-600 flex-grow">{brand.description}</p>
// // //               </CardContent>
// // //             </Card>
// // //           ))}
// // //         </div>

// // //         {/* Call to Action */}
// // //         <div className="text-center mt-16">
// // //           <Link href="/shop">
// // //             <Button size="lg" className="bg-primary hover:bg-primary/90">
// // //               Shop All Products
// // //             </Button>
// // //           </Link>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }