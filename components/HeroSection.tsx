"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Zap, Shield, Leaf, X } from "lucide-react"
import Link from "next/link"
import Image from 'next/image'
import { Dialog, DialogContent } from "@/components/ui/dialog"

const heroImageSrc = "/images/SolarOne.jpg"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 hero-gradient"></div>

      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/5 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/5 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            className={`text-white transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Power Your Future with
              <span className="block text-accent">Clean Energy</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              Discover premium solar panels, inverters, batteries, and controllers for sustainable energy solutions that
              last.
            </p>

            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-accent" />
                <span className="text-white/90">High Efficiency</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-accent" />
                <span className="text-white/90">10 Year Warranty</span>
              </div>
              <div className="flex items-center space-x-2">
                <Leaf className="w-5 h-5 text-accent" />
                <span className="text-white/90">Eco-Friendly</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-accent text-black hover:bg-accent/90 font-semibold px-8 py-4 rounded-2xl"
                >
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 rounded-2xl bg-transparent"
                onClick={() => setShowVideoModal(true)}
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>

          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative">
              <div className="relative w-full h-96 rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                <Image
                  src={heroImageSrc}
                  alt="Solar Panels in a vibrant setting"
                  fill
                  style={{ objectFit: "cover" }} 
                  sizes="(max-width: 1024px) 100vw, 50vw" 
                  priority // Prioritize loading for LCP
                />
              </div>

              {/* Floating stats (remain unchanged) */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-xl animate-bounce">
                <div className="text-2xl font-bold text-primary">99%</div>
                <div className="text-sm text-gray-600">Efficiency</div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl animate-bounce delay-500">
                <div className="text-2xl font-bold text-primary">10+</div>
                <div className="text-sm text-gray-600">Years Warranty</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="max-w-4xl p-0 bg-black">
          <button
            onClick={() => setShowVideoModal(false)}
            className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full aspect-video">
            <video
              controls
              autoPlay
              className="w-full h-full"
              src="/demo video.mp4"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}


// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { ArrowRight, Play, Zap, Shield, Leaf } from "lucide-react"
// import Link from "next/link"

// export function HeroSection() {
//   const [isVisible, setIsVisible] = useState(false)

//   useEffect(() => {
//     setIsVisible(true)
//   }, [])

//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
//       {/* Background with gradient */}
//       <div className="absolute inset-0 hero-gradient"></div>

//       {/* Animated background elements */}
//       <div className="absolute inset-0">
//         <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
//         <div className="absolute top-40 right-20 w-24 h-24 bg-white/5 rounded-full animate-pulse delay-1000"></div>
//         <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/5 rounded-full animate-pulse delay-500"></div>
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           {/* Content */}
//           <div
//             className={`text-white transition-all duration-1000 ${
//               isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
//             }`}
//           >
//             <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
//               Power Your Future with
//               <span className="block text-accent">Clean Energy</span>
//             </h1>
//             <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
//               Discover premium solar panels, inverters, batteries, and controllers for sustainable energy solutions that
//               last.
//             </p>

//             {/* Features */}
//             <div className="flex flex-wrap gap-6 mb-8">
//               <div className="flex items-center space-x-2">
//                 <Zap className="w-5 h-5 text-accent" />
//                 <span className="text-white/90">High Efficiency</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Shield className="w-5 h-5 text-accent" />
//                 <span className="text-white/90">25 Year Warranty</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Leaf className="w-5 h-5 text-accent" />
//                 <span className="text-white/90">Eco-Friendly</span>
//               </div>
//             </div>

//             {/* CTAs */}
//             <div className="flex flex-col sm:flex-row gap-4">
//               <Link href="/products">
//                 <Button
//                   size="lg"
//                   className="bg-accent text-black hover:bg-accent/90 font-semibold px-8 py-4 rounded-2xl"
//                 >
//                   Shop Now
//                   <ArrowRight className="ml-2 w-5 h-5" />
//                 </Button>
//               </Link>
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 rounded-2xl bg-transparent"
//               >
//                 <Play className="mr-2 w-5 h-5" />
//                 Watch Demo
//               </Button>
//             </div>
//           </div>

//           {/* Hero Visual */}
//           <div
//             className={`relative transition-all duration-1000 delay-300 ${
//               isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
//             }`}
//           >
//             <div className="relative">
//               {/* Placeholder for solar panel animation */}
//               <div className="w-full h-96 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
//                 <div className="text-center">
//                   <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
//                     <Zap className="w-12 h-12 text-black" />
//                   </div>
//                   <p className="text-white/80 text-lg">Solar Panel Animation</p>
//                   <p className="text-white/60 text-sm mt-2">Interactive demo coming soon</p>
//                 </div>
//               </div>

//               {/* Floating stats */}
//               <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-xl animate-bounce">
//                 <div className="text-2xl font-bold text-primary">99%</div>
//                 <div className="text-sm text-gray-600">Efficiency</div>
//               </div>

//               <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl animate-bounce delay-500">
//                 <div className="text-2xl font-bold text-primary">25+</div>
//                 <div className="text-sm text-gray-600">Years Warranty</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Scroll indicator */}
//       <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
//         <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
//           <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
//         </div>
//       </div>
//     </section>
//   )
// }
