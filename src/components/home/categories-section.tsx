import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { SectionHeading } from "@/components/section-heading"
import { STUDIO_CATEGORIES } from "@/lib/constants"
import { getCategoryCounts } from "@/lib/data"

export async function CategoriesSection() {
  const counts = await getCategoryCounts()

  return (
    <section className="border-y border-border/70 bg-secondary/50 py-20 lg:py-24">
      <div className="shell">
        <SectionHeading
          eyebrow="Browse by type"
          title="Find the right kind of room"
          description="Every category is built for a different kind of making. Start with the one that fits the work."
          action={{ href: "/studios", label: "See every space" }}
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STUDIO_CATEGORIES.map((category) => {
            const count = counts[category.slug] ?? 0
            return (
              <Link
                key={category.slug}
                href={{
                  pathname: "/studios",
                  query: { category: category.slug },
                }}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted ring-1 ring-foreground/5"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-white/10 text-white/80 backdrop-blur-md transition-colors group-hover:bg-amber-400 group-hover:text-[#17120a]">
                  <ArrowUpRight className="size-4" />
                </span>
                <div className="absolute inset-x-4 bottom-4">
                  <p className="text-base font-semibold text-white">
                    {category.name}
                  </p>
                  <p className="mt-0.5 text-xs text-white/65">
                    {count > 0 ? `${count} spaces` : "New spaces soon"}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function CategoriesSectionSkeleton() {
  return (
    <section className="border-y border-border/70 bg-secondary/50 py-20 lg:py-24">
      <div className="shell">
        <div className="h-3 w-28 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-9 w-80 max-w-full animate-pulse rounded bg-muted" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[4/5] animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
