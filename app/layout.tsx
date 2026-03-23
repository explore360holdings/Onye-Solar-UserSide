// File: /app/layout.tsx

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Providers from "@/components/Providers"
import AppShell from "@/components/AppShell"
import { WishlistProvider } from "@/lib/wishlist-context"
import { CartProvider } from "@/hooks/useCart"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] })

const siteUrl = "https://www.onye-solar.vercel.app"; 

export const metadata: Metadata = {
  title: {
    default: "SolarTech - Premium Solar Energy Solutions in Nigeria",
    template: "%s | SolarTech",
  },
  description: "Your one-stop shop for high-quality solar panels, inverters, batteries, and controllers. Powering homes and businesses across Nigeria with reliable renewable energy.",
  keywords: ["solar panels Nigeria", "inverters Lagos", "deep cycle batteries", "renewable energy solutions", "SolarTech"],
  
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "SolarTech - Premium Solar Energy Solutions in Nigeria",
    description: "Powering homes and businesses with reliable renewable energy.",
    siteName: "SolarTech",
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: "SolarTech Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SolarTech - Premium Solar Energy Solutions",
    description: "Your one-stop shop for high-quality solar panels and inverters in Nigeria.",
    images: [`${siteUrl}/logo.png`],
  },

  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE_HERE", 
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <WishlistProvider>
          <CartProvider>
            <AppShell>
              {children}
            </AppShell>
          </CartProvider>
          </WishlistProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

// import type React from "react";
// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import Providers from "@/components/Providers";
// import AppShell from "@/components/AppShell";
// import { WishlistProvider } from "@/lib/wishlist-context";
// import { CartProvider } from "@/hooks/useCart";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "SolarTech - Premium Solar Energy Solutions",
//   description:
//     "Discover high-quality solar panels, inverters, batteries, and controllers for your renewable energy needs.",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={inter.className}>
//         <Providers>
//           <WishlistProvider>
//             <CartProvider>
//               <AppShell>{children}</AppShell>
//             </CartProvider>
//           </WishlistProvider>
//         </Providers>
//       </body>
//     </html>
//   );
// }

// // import type React from "react";
// // import type { Metadata } from "next";
// // import { Inter } from "next/font/google";
// // import "./globals.css";
// // import Providers from "@/components/Providers"; // Assuming your Providers component is here
// // import AppShell from "@/components/AppShell";

// // const inter = Inter({ subsets: ["latin"] });

// // export const metadata: Metadata = {
// //   title: "SolarTech - Premium Solar Energy Solutions",
// //   description:
// //     "Discover high-quality solar panels, inverters, batteries, and controllers for your renewable energy needs.",
// // };

// // export default function RootLayout({
// //   children,
// // }: {
// //   children: React.ReactNode;
// // }) {
// //   return (
// //     <html lang="en">
// //       <body className={inter.className}>
// //         <Providers>
// //           <AppShell>{children}</AppShell>
// //         </Providers>
// //       </body>
// //     </html>
// //   );
// // }

// // import type React from "react"
// // import type { Metadata } from "next"
// // import { Inter } from "next/font/google"
// // import "./globals.css"
// // import AppShell from "@/components/AppShell"

// // const inter = Inter({ subsets: ["latin"] })

// // export const metadata: Metadata = {
// //   title: "SolarTech - Premium Solar Energy Solutions",
// //   description:
// //     "Discover high-quality solar panels, inverters, batteries, and controllers for your renewable energy needs.",
// // }

// // export default function RootLayout({
// //   children,
// // }: {
// //   children: React.ReactNode
// // }) {
// //   return (
// //     <html lang="en">
// //       <body className={inter.className}>
// //         <AppShell>{children}</AppShell>
// //       </body>
// //     </html>
// //   )
// // }
