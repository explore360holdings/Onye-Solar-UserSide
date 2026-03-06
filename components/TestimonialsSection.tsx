"use client"

import { Star } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Homeowner",
    image: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "SolarTech transformed our home with their premium solar panels. Our energy bills have dropped by 90% and the installation was seamless.",
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "Business Owner",
    image: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "The commercial solar solution from SolarTech has been incredible. Professional service and top-quality equipment that delivers results.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Environmental Consultant",
    image: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "I recommend SolarTech to all my clients. Their commitment to quality and sustainability is unmatched in the industry.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have made the switch to clean energy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 fade-in">
              <div className="flex items-center mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.text}"</p>

              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
