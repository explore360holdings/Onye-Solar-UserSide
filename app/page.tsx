import { HeroSection } from "@/components/HeroSection"
import { QuickLinks } from "@/components/QuickLinks"
import { FeaturedProducts } from "@/components/FeaturedProducts"
import { BrandsSection } from "@/components/BrandsSection"
import { StatsSection } from "@/components/StatsSection"
import { TestimonialsSection } from "@/components/TestimonialsSection"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <QuickLinks />
      <FeaturedProducts />
      <BrandsSection />
      <StatsSection />
      <TestimonialsSection />
    </div>
  )
}
