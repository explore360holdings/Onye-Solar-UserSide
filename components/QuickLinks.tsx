"use client"

import Link from "next/link"
import { Zap, Battery, Sun, Settings } from "lucide-react"

const categories = [
  {
    name: "Inverters",
    icon: Zap,
    href: "/products?category=inverters",
    description: "Convert DC to AC power",
    color: "bg-blue-500",
  },
  {
    name: "Batteries",
    icon: Battery,
    href: "/products?category=batteries",
    description: "Store energy for later use",
    color: "bg-green-500",
  },
  {
    name: "Solar Panels",
    icon: Sun,
    href: "/products?category=solar-panels",
    description: "Capture solar energy",
    color: "bg-yellow-500",
  },
  {
    name: "Controllers",
    icon: Settings,
    href: "/products?category=controllers",
    description: "Manage power flow",
    color: "bg-purple-500",
  },
]

export function QuickLinks() {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect solar components for your energy system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <Link key={category.name} href={category.href} className="group block">
                <div className="card-hover bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100 h-full">
                  <div
                    className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors">{category.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
