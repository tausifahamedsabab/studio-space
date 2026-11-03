import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, MapPin, Users } from "lucide-react"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { CATEGORY_BY_SLUG } from "@/lib/constants"
import { formatCurrency } from "@/lib/format"
import type { Studio } from "@/lib/types"
import { Rating } from "@/components/rating"

export function StudioCard({
  studio,
  priority = false,
  className,
}: {
  studio: Studio
  priority?: boolean
  className?: string
}) {
  const category = CATEGORY_BY_SLUG[studio.category]

  return (
    <Link
      href={`/studios/${studio.id}`}
      className={cn(
        "group flex flex-col rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted ring-1 ring-foreground/5">
        <Image
          src={studio.images[0]}
          alt={studio.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/10" />

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <Badge className="border-0 bg-black/45 text-white backdrop-blur-md">
            {category?.name ?? studio.category}
          </Badge>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-semibold text-neutral-900 shadow-sm">
            <Rating
              value={studio.rating}
              count={studio.reviewCount}
              showCount={false}
              className="text-xs"
            />
            <span className="text-[10px] font-normal text-neutral-500">
              ({studio.reviewCount})
            </span>
          </span>
        </div>

        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/90">
            <MapPin className="size-3.5" />
            {studio.area}, {studio.city}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1 text-[11px] text-white/85 backdrop-blur-md">
            <Users className="size-3" />
            {studio.capacity}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base leading-snug font-semibold tracking-tight transition-colors group-hover:text-amber-700">
            {studio.title}
          </h3>
          <p className="shrink-0 text-sm font-semibold">
            {formatCurrency(studio.pricePerHour)}
            <span className="text-xs font-normal text-muted-foreground"> / hr</span>
          </p>
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {studio.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 pt-1">
          <span
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "pointer-events-none h-8 rounded-lg bg-card px-3"
            )}
          >
            View Details
            <ArrowUpRight className="size-3.5" />
          </span>
          <span className="text-xs text-muted-foreground">
            {studio.instantBook ? "Instant book" : "Host approval"}
          </span>
        </div>
      </div>
    </Link>
  )
}

export function StudioCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
      <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-4 w-full animate-pulse rounded bg-muted" />
      <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-8 w-32 animate-pulse rounded-lg bg-muted" />
    </div>
  )
}
