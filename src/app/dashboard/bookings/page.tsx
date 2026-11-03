import { Suspense } from "react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  CalendarX,
  CheckCircle2,
  Clock,
  MapPin,
  PartyPopper,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import { cn } from "cn"

import { CancelBookingButton } from "@/components/dashboard/cancel-booking-button"
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
import {
  isPastBooking,
  isUpcomingBooking,
  sortBookingsAscending,
  sortBookingsDescending,
} from "@/lib/booking-utils"
import { getBookingsForUser } from "@/lib/data"
import {
  formatCurrency,
  formatDateLong,
  formatTimeRange,
} from "@/lib/format"
import type { Booking } from "@/lib/types"

export const metadata: Metadata = {
  title: "My bookings",
}

export default function DashboardBookingsPage({
  searchParams,
}: PageProps<"/dashboard/bookings">) {
  return (
    <Suspense fallback={<BookingsSkeleton />}>
      <DashboardBookings searchParams={searchParams} />
    </Suspense>
  )
}

async function DashboardBookings({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [user, params] = await Promise.all([requireUser(), searchParams])
  const bookings = await getBookingsForUser(user.id)

  const bookedId = typeof params.booked === "string" ? params.booked : null
  const booked = bookedId
    ? bookings.find((booking) => booking.id === bookedId)
    : null
  const showCancelled = params.cancelled === "1"

  const upcoming = bookings
    .filter(isUpcomingBooking)
    .sort(sortBookingsAscending)
  const past = bookings.filter(isPastBooking).sort(sortBookingsDescending)
  const cancelled = bookings
    .filter((booking) => booking.status === "cancelled")
    .sort(sortBookingsDescending)

  const activeBookings = bookings.filter(
    (booking) => booking.status !== "cancelled"
  )
  const hoursBooked = activeBookings.reduce(
    (total, booking) => total + booking.hours,
    0
  )
  const totalInvested = activeBookings.reduce(
    (total, booking) => total + booking.total,
    0
  )

  return (
    <div>
      {booked && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-500/15 text-emerald-700">
            <PartyPopper className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold">Your session is confirmed</p>
            <p className="mt-0.5 text-xs text-emerald-800/80">
              {booked.studioTitle} · {formatDateLong(booked.date)} ·{" "}
              {formatTimeRange(booked.startTime, booked.hours)}. We emailed the
              details and your host has been notified.
            </p>
          </div>
        </div>
      )}
      {showCancelled && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-border bg-secondary/60 p-4">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-foreground/5 text-muted-foreground">
            <CheckCircle2 className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold">Booking cancelled</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              The hours have been released back to the host. You can rebook any
              time from the studio page.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-600 uppercase">
            Bookings
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            My bookings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every session you have booked, past and upcoming.
          </p>
        </div>
        <Link
          href="/studios"
          className={cn(buttonVariants({ size: "lg" }), "h-9 rounded-xl px-4")}
        >
          Explore studios
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border/80 bg-card p-6">
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CalendarDays />
              </EmptyMedia>
              <EmptyTitle>No bookings yet</EmptyTitle>
              <EmptyDescription>
                Find a room that fits your next shoot, recording, or workshop.
                Your booked hours will show up here with everything you need for
                the day.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Link
                href="/studios"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-9 rounded-xl px-4"
                )}
              >
                Browse studios
                <ArrowRight className="size-4" />
              </Link>
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <SummaryCard
              icon={CalendarCheck}
              label="Upcoming sessions"
              value={String(upcoming.length)}
              tone="amber"
            />
            <SummaryCard
              icon={Clock}
              label="Hours booked"
              value={String(hoursBooked)}
              tone="sky"
            />
            <SummaryCard
              icon={Wallet}
              label="Total invested"
              value={formatCurrency(totalInvested)}
              tone="emerald"
            />
          </div>

          <BookingSection
            title="Upcoming"
            description="Your confirmed sessions, soonest first."
            bookings={upcoming}
            emptyLabel="Nothing on the calendar yet. Book a space to fill this list."
            showCancel
          />

          {past.length > 0 && (
            <BookingSection
              title="Past sessions"
              description="A record of the hours you have already used."
              bookings={past}
            />
          )}

          {cancelled.length > 0 && (
            <BookingSection
              title="Cancelled"
              description="Sessions you released back to the host."
              bookings={cancelled}
              muted
            />
          )}
        </>
      )}
    </div>
  )
}

function BookingSection({
  title,
  description,
  bookings,
  emptyLabel,
  showCancel = false,
  muted = false,
}: {
  title: string
  description: string
  bookings: Booking[]
  emptyLabel?: string
  showCancel?: boolean
  muted?: boolean
}) {
  return (
    <section className="mt-8">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold tabular-nums">
          {bookings.length}
        </span>
      </div>

      {bookings.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
          {emptyLabel ?? "Nothing here yet."}
        </p>
      ) : (
        <ul
          className={cn(
            "mt-3 overflow-hidden rounded-2xl border border-border/80 bg-card",
            muted && "opacity-80"
          )}
        >
          {bookings.map((booking) => (
            <BookingRow
              key={booking.id}
              booking={booking}
              showCancel={showCancel}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

function BookingRow({
  booking,
  showCancel,
}: {
  booking: Booking
  showCancel: boolean
}) {
  const cancelled = booking.status === "cancelled"
  const upcoming = isUpcomingBooking(booking)

  return (
    <li className="flex flex-col gap-4 border-b border-border/70 p-4 last:border-b-0 sm:flex-row sm:items-center">
      <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:size-20">
        <Image
          src={booking.studioImage}
          alt={booking.studioTitle}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/studios/${booking.studioId}`}
            className="truncate text-sm font-semibold hover:underline"
          >
            {booking.studioTitle}
          </Link>
          {cancelled ? (
            <Badge
              variant="outline"
              className="border-border bg-secondary text-muted-foreground"
            >
              Cancelled
            </Badge>
          ) : upcoming ? (
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-emerald-700"
            >
              Confirmed
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-border bg-secondary text-muted-foreground"
            >
              Completed
            </Badge>
          )}
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarCheck className="size-3.5" />
            {formatDateLong(booking.date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {formatTimeRange(booking.startTime, booking.hours)} ·{" "}
            {booking.hours} hr{booking.hours === 1 ? "" : "s"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            {booking.city}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
        <div className="text-right">
          <p className="text-sm font-semibold tabular-nums">
            {formatCurrency(booking.total)}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {formatCurrency(booking.pricePerHour)} / hr
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/studios/${booking.studioId}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-8 rounded-lg px-2.5"
            )}
          >
            View studio
          </Link>
          {showCancel && upcoming && (
            <CancelBookingButton
              bookingId={booking.id}
              studioTitle={booking.studioTitle}
              dateLabel={formatDateLong(booking.date)}
            />
          )}
          {cancelled && (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <CalendarX className="size-3.5" />
              Released
            </span>
          )}
        </div>
      </div>
    </li>
  )
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon
  label: string
  value: string
  tone: "amber" | "sky" | "emerald"
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-4">
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-xl",
          tone === "amber" && "bg-amber-50 text-amber-700",
          tone === "sky" && "bg-sky-50 text-sky-700",
          tone === "emerald" && "bg-emerald-50 text-emerald-700"
        )}
      >
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-lg font-semibold tracking-tight tabular-nums">
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

function BookingsSkeleton() {
  return (
    <div>
      <div className="h-3 w-20 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-9 w-56 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-muted" />
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="mt-8 h-64 animate-pulse rounded-2xl bg-muted" />
    </div>
  )
}
