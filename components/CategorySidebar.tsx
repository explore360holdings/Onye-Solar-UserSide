// "use client"
// import React, { useRef } from "react"
// import Link from "next/link"
// import {
//   Zap,
//   Battery,
//   Sun,
//   Settings,
//   Lightbulb,
//   Package,
//   Refrigerator,
//   Percent,
//   Menu,
// } from "lucide-react"

// export const SIDEBAR_COLLAPSED = 56 // px
// export const SIDEBAR_EXPANDED = 288 // px (72 * 4)

// const categories = [
//   {
//     name: "Inverters",
//     icon: Zap,
//     href: "/products?category=inverters",
//     sub: [
//       {
//         label: "Hybrid Inverters",
//         items: ["1.5KVA", "3KVA", "3.5KVA", "5.5KVA"],
//       },
//       {
//         label: "Brands",
//         items: ["SMKSolar", "Prag", "Dando"],
//       },
//       {
//         label: "Non-Hybrid Inverters",
//         items: ["1.5KVA", "3KVA", "3.5KVA", "5.5KVA"],
//       },
//     ],
//   },
//   { name: "Batteries", icon: Battery, href: "/products?category=batteries" },
//   { name: "Solar Panels", icon: Sun, href: "/products?category=solar-panels" },
//   { name: "Solar Charge Controllers", icon: Settings, href: "/products?category=controllers" },
//   { name: "Solar Lights", icon: Lightbulb, href: "/products?category=lights" },
//   { name: "Stabilizers", icon: Package, href: "/products?category=stabilizers" },
//   { name: "Solar Deals", icon: Percent, href: "/products?category=deals" },
//   { name: "Solar Fridge & Freezer", icon: Refrigerator, href: "/products?category=fridge-freezer" },
// ]

// export function CategorySidebar({ expanded, setExpanded, onSidebarMouseLeave }: { expanded: boolean, setExpanded: (v: boolean) => void, onSidebarMouseLeave?: () => void }) {
//   const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
//   const sidebarRef = useRef<HTMLDivElement>(null)

//   // Collapse sidebar when mouse leaves the sidebar area
//   function handleSidebarMouseLeave(e: React.MouseEvent) {
//     if (sidebarRef.current && !sidebarRef.current.contains(e.relatedTarget as Node)) {
//       setExpanded(false)
//       setHoveredIndex(null)
//       if (onSidebarMouseLeave) onSidebarMouseLeave()
//     }
//   }

//   return (
//     <aside
//       ref={sidebarRef}
//       className="fixed left-0 z-40 bg-white border-r shadow transition-all duration-300"
//       style={{
//         width: expanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED,
//         top: 64, // adjust if your header is a different height
//         height: 'calc(100vh - 64px)'
//       }}
//       onMouseEnter={() => setExpanded(true)}
//       onMouseLeave={handleSidebarMouseLeave}
//     >
//       <div className="flex flex-col items-start py-4 space-y-2 h-full">
//         <button
//           className={`mb-4 h-12 flex items-center transition-all duration-300 ${expanded ? 'w-full rounded-l-full' : 'w-12 rounded-full'} bg-green-600 hover:bg-green-700`}
//           tabIndex={0}
//           aria-label="Expand sidebar"
//           style={{ justifyContent: 'center' }}
//         >
//           <Menu className="w-7 h-7 text-white" />
//         </button>
//         {categories.map((cat, idx) => {
//           const Icon = cat.icon
//           return (
//             <div
//               key={cat.name}
//               className="relative w-full"
//               onMouseEnter={() => setHoveredIndex(idx)}
//               onMouseLeave={() => setHoveredIndex(null)}
//             >
//               <Link
//                 href={cat.href}
//                 className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer hover:bg-yellow-50 w-full ${
//                   expanded ? "justify-start" : "justify-center"
//                 }`}
//               >
//                 <Icon className="w-6 h-6 text-gray-700" />
//                 {expanded && <span className="font-medium text-gray-900">{cat.name}</span>}
//               </Link>
//               {/* Submenu */}
//               {expanded && hoveredIndex === idx && cat.sub && (
//                 <div className="absolute left-full top-0 ml-2 bg-white border rounded-lg shadow-lg min-w-[250px] p-4 animate-slide-in z-50">
//                   {cat.sub.map((group, gidx) => (
//                     <div key={gidx} className="mb-4 last:mb-0">
//                       <div className="font-semibold text-xs text-gray-500 mb-2">{group.label}</div>
//                       <div className="flex flex-wrap gap-2">
//                         {group.items.map((item) => (
//                           <Link
//                             key={item}
//                             href="#"
//                             className="px-3 py-1 rounded bg-gray-100 hover:bg-yellow-100 text-sm text-gray-800"
//                           >
//                             {item}
//                           </Link>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )
//         })}
//       </div>
//       <style jsx>{`
//         .animate-slide-in {
//           animation: slideIn 0.2s ease;
//         }
//         @keyframes slideIn {
//           from {
//             opacity: 0;
//             transform: translateX(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
//       `}</style>
//     </aside>
//   )
// } 