import { Suspense } from "react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  MapPin,
  PartyPopper,
  Pencil,
  Plus,
  Ruler,
  Star,
  Store,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { cn } from "cn"

import { DeleteStudioButton } from "@/components/dashboard/delete-studio-button"
import { StudioToast } from "@/components/dashboard/studio-toast"
import { Rating } from "@/components/rating"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { requireUser } from "@/lib/auth"
import { CATEGORY_BY_SLUG } from "@/lib/constants"
import { getStudiosByHost } from "@/lib/data"
import { formatCurrency } from "@/lib/format"

export const metadata: Metadata = {
  title: "My studio listings",
}

export default function MyListingsPage({
  searchParams,
}: PageProps<"/my-listings">) {
  return (
    <Suspense fallback={<StudiosSkeleton />}>
      <MyListings searchParams={searchParams} />
    </Suspense>
  )
}

async function MyListings({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [user, params] = await Promise.all([requireUser(), searchParams])
  const studios = await getStudiosByHost(user.id)

  const createdId = typeof params.created === "string" ? params.created : null
  const createdStudio = createdId
    ? studios.find((studio) => studio.id === createdId)
    : null
  const updatedId = typeof params.updated === "string" ? params.updated : null
  const updatedStudio = updatedId
    ? studios.find((studio) => studio.id === updatedId)
    : null
  const showDeleted = params.deleted === "1"

  return (
    <div>
      <Suspense fallback={null}>
        <StudioToast />
      </Suspense>
      {createdStudio && (
        <Banner
          tone="success"
          icon={PartyPopper}
          title="Your listing is live"
          description={`${createdStudio.title} is now discoverable on the marketplace. Share the link and start taking bookings.`}
        />
      )}
      {updatedStudio && (
        <Banner
          tone="success"
          icon={CheckCircle2}
          title="Listing updated"
          description={`Your changes to ${updatedStudio.title} are live on the marketplace.`}
        />
      )}
      {showDeleted && (
        <Banner
          tone="neutral"
          icon={CheckCircle2}
          title="Listing removed"
          description="The space is no longer visible on the marketplace. Existing bookings were left untouched."
        />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-600 uppercase">
            Hosting
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            My studio listings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {studios.length === 0
              ? "Every great room starts with a listing."
              : `You are hosting ${studios.length} ${
                  studios.length === 1 ? "space" : "spaces"
                } on StudioSpace.`}
          </p>
        </div>
        <Link
          href="/add-studio"
          className={cn(buttonVariants({ size: "lg" }), "h-9 rounded-xl px-4")}
        >
          <Plus className="size-4" />
          Add studio
        </Link>
      </div>

      {studios.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border/80 bg-card p-6">
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Store />
              </EmptyMedia>
              <EmptyTitle>You have not listed a space yet</EmptyTitle>
              <EmptyDescription>
                Add your photo studio, stage, podcast room, music suite, or
                workshop. You set the hours and the rate, and keep 100% of what
                you charge.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Link
                href="/add-studio"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-9 rounded-xl px-4"
                )}
              >
                <Plus className="size-4" />
                Create your first listing
              </Link>
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {studios.map((studio) => {
            const category = CATEGORY_BY_SLUG[studio.category]
            return (
              <article
                key={studio.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src={studio.images[0]}
                    alt={studio.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 360px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
                    <Badge className="border-0 bg-black/45 text-white backdrop-blur-md">
                      {category.name}
                    </Badge>
                    <Badge className="border-0 bg-emerald-500/90 text-white">
                      <span className="size-1.5 rounded-full bg-white" />
                      Live
                    </Badge>
                  </div>
                  <p className="absolute inset-x-3 bottom-3 flex items-center gap-1.5 text-xs font-medium text-white/90">
                    <MapPin className="size-3.5" />
                    {studio.area}, {studio.city}
                  </p>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/studios/${studio.id}`}
                      className="text-base leading-snug font-semibold tracking-tight transition-colors hover:text-amber-700"
                    >
                      {studio.title}
                    </Link>
                    <p className="shrink-0 text-sm font-semibold">
                      {formatCurrency(studio.pricePerHour)}
                      <span className="text-xs font-normal text-muted-foreground">
                        {" "}
                        / hr
                      </span>
                    </p>
                  </div>

                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {studio.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                      {studio.reviewCount === 0 ? (
                        "New listing"
                      ) : (
                        <Rating
                          value={studio.rating}
                          count={studio.reviewCount}
                          showCount={false}
                          className="text-xs"
                        />
                      )}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="size-3" />
                      {studio.capacity}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Ruler className="size-3" />
                      {studio.sizeSqft.toLocaleString()} sq ft
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock className="size-3" />
                      {studio.minHours} hr min
                    </span>
                    {studio.instantBook && (
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <Zap className="size-3" />
                        Instant
                      </span>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/70 pt-3">
                    <Link
                      href={`/studios/${studio.id}`}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "h-8 rounded-lg px-2.5"
                      )}
                    >
                      View
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/studios/edit/${studio.id}`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "h-8 rounded-lg px-3"
                        )}
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </Link>
                      <DeleteStudioButton
                        studioId={studio.id}
                        studioTitle={studio.title}
                      />
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Banner({
  tone,
  icon: Icon,
  title,
  description,
}: {
  tone: "success" | "neutral"
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <div
      className={cn(
        "mb-6 flex items-start gap-3 rounded-2xl border p-4",
        tone === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-border bg-secondary/60 text-foreground"
      )}
    >
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-lg",
          tone === "success"
            ? "bg-emerald-500/15 text-emerald-700"
            : "bg-foreground/5 text-muted-foreground"
        )}
      >
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p
          className={cn(
            "mt-0.5 text-xs",
            tone === "success" ? "text-emerald-800/80" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      </div>
    </div>
  )
}

function StudiosSkeleton() {
  return (
    <div>
      <div className="h-3 w-20 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-9 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-muted" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-80 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  )
}
