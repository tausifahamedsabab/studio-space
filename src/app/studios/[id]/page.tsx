import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  MapPin,
  Ruler,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react"
import { connection } from "next/server"

import { Rating } from "@/components/rating"
import { SectionHeading } from "@/components/section-heading"
import { BookingWidget } from "@/components/studios/booking-widget"
import { StudioCard } from "@/components/studios/studio-card"
import { StudioGallery } from "@/components/studios/studio-gallery"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getSessionUser } from "@/lib/auth"
import { CATEGORY_BY_SLUG } from "@/lib/constants"
import {
  getBookedRanges,
  getRelatedStudios,
  getReviewsForStudio,
  getStudioById,
} from "@/lib/data"
import {
  formatCurrency,
  formatDateShort,
  formatTimeRange,
  getInitials,
} from "@/lib/format"

export async function generateMetadata({
  params,
}: PageProps<"/studios/[id]">): Promise<Metadata> {
  const { id } = await params
  const studio = await getStudioById(id)

  if (!studio) return { title: "Studio not found" }

  return {
    title: studio.title,
    description: studio.description.slice(0, 155),
  }
}

export default function StudioDetailPage({ params }: PageProps<"/studios/[id]">) {
  return (
    <Suspense fallback={<StudioDetailSkeleton />}>
      <StudioDetail params={params} />
    </Suspense>
  )
}

async function StudioDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Bookings and session are time-dependent under Cache Components.
  await connection()

  const { id } = await params
  const studio = await getStudioById(id)

  if (!studio || !studio.published) notFound()

  const [reviews, bookedRanges, related, user] = await Promise.all([
    getReviewsForStudio(studio.id),
    getBookedRanges(studio.id),
    getRelatedStudios(studio, 3),
    getSessionUser(),
  ])

  const category = CATEGORY_BY_SLUG[studio.category]
  const isOwner = user?.id === studio.hostId

  return (
    <>
      <div className="shell pt-6">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <Link
            href="/studios"
            className="transition-colors hover:text-foreground"
          >
            Studios
          </Link>
          <ChevronRight className="size-3" />
          <Link
            href={{
              pathname: "/studios",
              query: { category: studio.category },
            }}
            className="transition-colors hover:text-foreground"
          >
            {category.name}
          </Link>
          <ChevronRight className="size-3" />
          <span className="max-w-48 truncate text-foreground">
            {studio.title}
          </span>
        </nav>

        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-amber-300/70 bg-amber-50 text-amber-800"
              >
                {category.name}
              </Badge>
              {studio.featured && (
                <Badge
                  variant="outline"
                  className="border-border bg-card text-muted-foreground"
                >
                  <Sparkles className="size-3 text-amber-600" />
                  Featured
                </Badge>
              )}
              {studio.instantBook ? (
                <Badge
                  variant="outline"
                  className="border-emerald-200 bg-emerald-50 text-emerald-700"
                >
                  <Zap className="size-3" />
                  Instant book
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-border bg-card text-muted-foreground"
                >
                  <Clock className="size-3" />
                  Host approval
                </Badge>
              )}
            </div>

            <h1 className="mt-3 max-w-3xl text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              {studio.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <Rating value={studio.rating} count={studio.reviewCount} />
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" />
                {studio.area}, {studio.city}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4" />
                Up to {studio.capacity} people
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Ruler className="size-4" />
                {studio.sizeSqft.toLocaleString()} sq ft
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-medium">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              Host guarantee
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-medium">
              <CalendarDays className="size-3.5 text-amber-600" />
              Live availability
            </span>
          </div>
        </div>
      </div>

      <div className="shell mt-6">
        <StudioGallery images={studio.images} title={studio.title} />
      </div>

      <div className="shell py-10 lg:py-14">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
          <div className="min-w-0">
            <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Avatar size="lg">
                  {studio.hostAvatar && (
                    <AvatarImage src={studio.hostAvatar} alt={studio.hostName} />
                  )}
                  <AvatarFallback>{getInitials(studio.hostName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">
                    Hosted by {studio.hostName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Host since {studio.hostSince} · {studio.reviewCount} reviews
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 font-medium">
                  <BadgeCheck className="size-3.5 text-emerald-600" />
                  Identity verified
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 font-medium">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  {studio.rating.toFixed(1)} rating
                </span>
              </div>
            </div>

            <section className="mt-10">
              <h2 className="text-xl font-semibold tracking-tight">
                About this space
              </h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-pretty text-muted-foreground">
                {studio.description}
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-border/70 bg-card p-3">
                  <dt className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Capacity
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {studio.capacity}
                  </dd>
                </div>
                <div className="rounded-xl border border-border/70 bg-card p-3">
                  <dt className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Size
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {studio.sizeSqft.toLocaleString()}
                    <span className="text-xs font-normal text-muted-foreground">
                      {" "}
                      sq ft
                    </span>
                  </dd>
                </div>
                <div className="rounded-xl border border-border/70 bg-card p-3">
                  <dt className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Minimum
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {studio.minHours}
                    <span className="text-xs font-normal text-muted-foreground">
                      {" "}
                      hr{studio.minHours === 1 ? "" : "s"}
                    </span>
                  </dd>
                </div>
                <div className="rounded-xl border border-border/70 bg-card p-3">
                  <dt className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Hourly
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {formatCurrency(studio.pricePerHour)}
                  </dd>
                </div>
              </dl>
            </section>

            <Separator className="my-10" />

            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                What this place offers
              </h2>
              <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {studio.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="flex items-center gap-2.5 text-sm text-foreground/85"
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200/70">
                      <Check className="size-3" />
                    </span>
                    {amenity}
                  </li>
                ))}
              </ul>
            </section>

            <Separator className="my-10" />

            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                House rules
              </h2>
              <ul className="mt-4 space-y-2.5">
                {studio.rules.map((rule) => (
                  <li
                    key={rule}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500" />
                    {rule}
                  </li>
                ))}
              </ul>
            </section>

            <Separator className="my-10" />

            <section>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    The neighborhood
                  </h2>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-4 text-amber-600" />
                    {studio.area}, {studio.city}
                  </p>
                </div>
                <Link
                  href={{
                    pathname: "/studios",
                    query: { city: studio.city },
                  }}
                  className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
                >
                  More spaces in {studio.city}
                </Link>
              </div>
              <div className="relative mt-4 overflow-hidden rounded-2xl border border-border/70 bg-secondary/60 p-6">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:32px_32px]"
                />
                <div className="relative flex flex-wrap items-center gap-4">
                  <span className="grid size-11 place-items-center rounded-xl bg-card text-amber-600 ring-1 ring-foreground/10">
                    <Building2 className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      {studio.area} creative district
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Exact address is shared after your booking is confirmed.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <Separator className="my-10" />

            <section>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    Reviews
                  </h2>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Rating value={studio.rating} count={studio.reviewCount} />
                    <span>·</span>
                    <span>{reviews.length} recent reviews</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium">
                  <ShieldCheck className="size-3.5 text-emerald-600" />
                  Every review is from a verified booking
                </span>
              </div>

              {reviews.length === 0 ? (
                <p className="mt-4 rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                  No reviews yet — this space is new to StudioSpace.
                </p>
              ) : (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {reviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-2xl border border-border/70 bg-card p-5"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <AvatarImage src={review.avatar} alt={review.author} />
                          <AvatarFallback>
                            {getInitials(review.author)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {review.author}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateShort(review.date)}
                          </p>
                        </div>
                        <span className="ml-auto inline-flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={
                                index < review.rating
                                  ? "size-3 fill-amber-400 text-amber-400"
                                  : "size-3 fill-muted text-muted"
                              }
                            />
                          ))}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-pretty text-foreground/80">
                        {review.body}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <div className="mt-10">
              <Link
                href="/studios"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                Back to all studios
              </Link>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            <BookingWidget
              studio={studio}
              bookedRanges={bookedRanges}
              isAuthenticated={Boolean(user)}
              isOwner={isOwner}
            />

            <div className="mt-4 rounded-2xl border border-border/70 bg-card p-4 text-xs text-muted-foreground">
              <p className="flex items-center justify-between gap-2">
                <span>Typical session</span>
                <span className="font-medium text-foreground">
                  {formatTimeRange("10:00", studio.minHours)}
                </span>
              </p>
              <p className="mt-2 flex items-center justify-between gap-2">
                <span>Minimum booking</span>
                <span className="font-medium text-foreground">
                  {studio.minHours} {studio.minHours === 1 ? "hour" : "hours"}
                </span>
              </p>
              <p className="mt-2 flex items-center justify-between gap-2">
                <span>Confirmation</span>
                <span className="font-medium text-foreground">
                  {studio.instantBook ? "Instant" : "Host approval"}
                </span>
              </p>
            </div>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-border/70 bg-secondary/40 py-16 lg:py-20">
          <div className="shell">
            <SectionHeading
              eyebrow="More like this"
              title={`Other ${category.name.toLowerCase()} to consider`}
              action={{ href: "/studios", label: "Browse every space" }}
            />
            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <StudioCard key={item.id} studio={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

function StudioDetailSkeleton() {
  return (
    <div className="shell py-8">
      <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-6 h-10 w-2/3 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-muted" />
      <div className="mt-6 grid gap-2 lg:grid-cols-[2fr_1fr]">
        <div className="aspect-[16/9] animate-pulse rounded-2xl bg-muted" />
        <div className="hidden grid-cols-2 gap-2 lg:grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-4 animate-pulse rounded bg-muted"
              style={{ width: `${90 - index * 6}%` }}
            />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  )
}


