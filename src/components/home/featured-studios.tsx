import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { SectionHeading } from "@/components/section-heading"
import {
  StudioCard,
  StudioCardSkeleton,
} from "@/components/studios/studio-card"
import { getFeaturedStudios } from "@/lib/data"

export async function FeaturedStudios() {
  const studios = await getFeaturedStudios(6)

  return (
    <section className="shell py-20 lg:py-24">
      <SectionHeading
        eyebrow="Featured spaces"
        title="Rooms with a point of view"
        description="Hand-picked studios with standout light, gear, and hosts who make the day easier."
        action={{ href: "/studios", label: "Browse all studios" }}
      />

      <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio, index) => (
          <StudioCard key={studio.id} studio={studio} priority={index < 3} />
        ))}
      </div>

      <div className="mt-12 flex justify-center sm:hidden">
        <Link
          href="/studios"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground"
        >
          Browse all studios
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}

export function FeaturedStudiosSkeleton() {
  return (
    <section className="shell py-20 lg:py-24">
      <div className="h-3 w-28 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-9 w-80 max-w-full animate-pulse rounded bg-muted" />
      <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
      <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <StudioCardSkeleton key={index} />
        ))}
      </div>
    </section>
  )
}
