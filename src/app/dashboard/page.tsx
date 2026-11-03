import { Suspense } from "react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  Clock,
  MapPin,
  PartyPopper,
  Plus,
  Sparkles,
  Store,
  Wallet,
} from "lucide-react"

import { Rating } from "@/components/rating"
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
import {
  isUpcomingBooking,
  sortBookingsAscending,
} from "@/lib/booking-utils"
import { CATEGORY_BY_SLUG } from "@/lib/constants"
import { getBookingsForUser, getStudiosByHost } from "@/lib/data"
import {
  formatCurrency,
  formatDateLong,
  formatTimeRange,
} from "@/lib/format"
import { cn } from "cn"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  return (
    <Suspense fallback={<DashboardHomeSkeleton />}>
      <DashboardHome searchParams={searchParams} />
    </Suspense>
  )
}

async function DashboardHome({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [user, params] = await Promise.all([requireUser(), searchParams])
  const [bookings, studios] = await Promise.all([
    getBookingsForUser(user.id),
    getStudiosByHost(user.id),
  ])

  const showWelcome = params.welcome === "1"
  const upcoming = bookings
    .filter(isUpcomingBooking)
    .sort(sortBookingsAscending)
  const activeBookings = bookings.filter((booking) => booking.status !== "cancelled")
  const hoursBooked = activeBookings.reduce(
    (total, booking) => total + booking.hours,
    0
  )
  const totalSpent = activeBookings.reduce(
    (total, booking) => total + booking.total,
    0
  )

  const stats = [
    {
      label: "Upcoming sessions",
      value: upcoming.length,
      hint: upcoming.length === 0 ? "Nothing on the calendar yet" : "Next 90 days",
      icon: CalendarCheck,
      tone: "amber",
    },
    {
      label: "Hours booked",
      value: hoursBooked,
      hint: "Across all your sessions",
      icon: Clock,
      tone: "blue",
    },
    {
      label: "Active listings",
      value: studios.length,
      hint: studios.length === 0 ? "Add your first space" : "Live on the marketplace",
      icon: Store,
      tone: "emerald",
    },
    {
      label: "Total invested",
      value: formatCurrency(totalSpent),
      hint: "In your creative work",
      icon: Wallet,
      tone: "violet",
    },
  ] as const

  return (
    <div>
      {showWelcome && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-500/15">
            <PartyPopper className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold">Welcome to StudioSpace</p>
            <p className="mt-0.5 text-xs text-emerald-800/80">
              Your account is ready. Browse a space to book your first session,
              or list a studio of your own.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-600 uppercase">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here is what is happening with your spaces and sessions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/studios"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-9 rounded-xl")}
          >
            Explore studios
          </Link>
          <Link
            href="/dashboard/studios/new"
            className={cn(buttonVariants({ size: "lg" }), "h-9 rounded-xl px-4")}
          >
            <Plus className="size-4" />
            Add studio
          </Link>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/80 bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-xl",
                  stat.tone === "amber" && "bg-amber-50 text-amber-700",
                  stat.tone === "blue" && "bg-sky-50 text-sky-700",
                  stat.tone === "emerald" && "bg-emerald-50 text-emerald-700",
                  stat.tone === "violet" && "bg-violet-50 text-violet-700"
                )}
              >
                <stat.icon className="size-4" />
              </span>
            </div>
            <p className="mt-4 text-2xl font-semibold tracking-tight tabular-nums">
              {stat.value}
            </p>
            <p className="mt-0.5 text-sm font-medium">{stat.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <section className="rounded-2xl border border-border/80 bg-card">
          <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold">Upcoming sessions</h2>
              <p className="text-xs text-muted-foreground">
                Your next booked hours
              </p>
            </div>
            <Link
              href="/dashboard/bookings"
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800"
            >
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <div className="p-5">
              <Empty className="border-0 p-4">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <CalendarDays />
                  </EmptyMedia>
                  <EmptyTitle>No sessions booked yet</EmptyTitle>
                  <EmptyDescription>
                    Find a room that fits your next shoot, recording, or
                    workshop and lock in your hours.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Link
                    href="/studios"
                    className={cn(buttonVariants({ size: "lg" }), "h-9 rounded-xl px-4")}
                  >
                    Browse studios
                  </Link>
                </EmptyContent>
              </Empty>
            </div>
          ) : (
            <ul className="divide-y divide-border/70">
              {upcoming.slice(0, 3).map((booking) => (
                <li key={booking.id} className="flex items-center gap-3 p-4">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={booking.studioImage}
                      alt={booking.studioTitle}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/studios/${booking.studioId}`}
                      className="block truncate text-sm font-semibold hover:underline"
                    >
                      {booking.studioTitle}
                    </Link>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarCheck className="size-3" />
                      {formatDateLong(booking.date)} ·{" "}
                      {formatTimeRange(booking.startTime, booking.hours)}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {booking.city}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold tabular-nums">
                      {formatCurrency(booking.total)}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {booking.hours} hr{booking.hours === 1 ? "" : "s"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border/80 bg-card">
          <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold">Your listings</h2>
              <p className="text-xs text-muted-foreground">
                Spaces you host on StudioSpace
              </p>
            </div>
            <Link
              href="/dashboard/studios"
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800"
            >
              Manage
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {studios.length === 0 ? (
            <div className="p-5">
              <div className="rounded-xl border border-dashed border-border p-5 text-center">
                <span className="mx-auto grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-700">
                  <Store className="size-5" />
                </span>
                <p className="mt-3 text-sm font-semibold">
                  You are not hosting yet
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Have a studio, stage, or workshop? List it in minutes and keep
                  100% of your hourly rate.
                </p>
                <Link
                  href="/dashboard/studios/new"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "mt-4 h-9 rounded-xl px-4"
                  )}
                >
                  <Plus className="size-4" />
                  List your space
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-border/70">
              {studios.slice(0, 3).map((studio) => (
                <li key={studio.id} className="flex items-center gap-3 p-4">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={studio.images[0]}
                      alt={studio.title}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/studios/${studio.id}`}
                      className="block truncate text-sm font-semibold hover:underline"
                    >
                      {studio.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {CATEGORY_BY_SLUG[studio.category].shortName} ·{" "}
                      {studio.city}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Rating
                        value={studio.rating}
                        count={studio.reviewCount}
                        className="text-xs"
                      />
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold tabular-nums">
                      {formatCurrency(studio.pricePerHour)}
                    </p>
                    <p className="text-[11px] text-muted-foreground">per hour</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-400/20 text-amber-700">
            <Sparkles className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-amber-950">
              Make your listing stand out
            </p>
            <p className="mt-0.5 max-w-xl text-xs leading-relaxed text-amber-900/70">
              Listings with four or more photos and a complete amenity list get
              booked noticeably more often. Add a few details to yours.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/studios"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-9 shrink-0 rounded-xl border-amber-300 bg-white/70 text-amber-900 hover:bg-white"
          )}
        >
          Review listings
        </Link>
      </div>
    </div>
  )
}

function DashboardHomeSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-3 w-24 animate-pulse rounded bg-muted" />
      <div className="h-9 w-72 max-w-full animate-pulse rounded bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <div className="h-80 animate-pulse rounded-2xl bg-muted" />
        <div className="h-80 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  )
}
