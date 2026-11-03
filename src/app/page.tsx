import { Suspense } from "react"

import { CategoriesSection, CategoriesSectionSkeleton } from "@/components/home/categories-section"
import { CtaBand } from "@/components/home/cta-band"
import { FeaturedStudios, FeaturedStudiosSkeleton } from "@/components/home/featured-studios"
import { HeroSlider } from "@/components/home/hero-slider"
import { HostGuarantee } from "@/components/home/host-guarantee"
import { HowBookingWorks } from "@/components/home/how-booking-works"
import { Testimonials } from "@/components/home/testimonials"

export default function Home() {
  return (
    <>
      <HeroSlider />

      <Suspense fallback={<FeaturedStudiosSkeleton />}>
        <FeaturedStudios />
      </Suspense>

      <Suspense fallback={<CategoriesSectionSkeleton />}>
        <CategoriesSection />
      </Suspense>

      <HowBookingWorks />
      <HostGuarantee />
      <Testimonials />
      <CtaBand />
    </>
  )
}
