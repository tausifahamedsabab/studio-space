"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import {
  CalendarCheck,
  Clock,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Zap,
} from "lucide-react"
import { cn } from "cn"

import { createBookingAction, type BookingFormState } from "@/actions/bookings"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  BOOKING_HORIZON_DAYS,
  CLOSE_HOUR,
  MAX_BOOKING_HOURS,
  OPEN_HOUR,
  SERVICE_FEE_RATE,
  TIME_SLOTS,
} from "@/lib/constants"
import {
  addDays,
  bookingHorizon,
  calculateTotals,
  dateToKey,
  formatCurrency,
  formatDateLong,
  formatTime,
  keyToDate,
  rangesOverlap,
  startOfToday,
  timeToHour,
} from "@/lib/format"
import type { BookedRange, Studio } from "@/lib/types"

function slotUnavailable(
  date: string,
  startTime: string,
  hours: number,
  bookedRanges: BookedRange[]
) {
  const startHour = timeToHour(startTime)
  if (startHour < OPEN_HOUR || startHour + hours > CLOSE_HOUR) return true

  const now = new Date()
  const todayKey = dateToKey(now)
  if (date === todayKey && startHour <= now.getHours()) return true

  return bookedRanges.some((range) => {
    if (range.date !== date) return false
    const bookedStart = timeToHour(range.startTime)
    return rangesOverlap(
      startHour,
      startHour + hours,
      bookedStart,
      bookedStart + range.hours
    )
  })
}

function nextAvailableDate(bookedRanges: BookedRange[], hours: number) {
  const today = startOfToday()
  for (let offset = 0; offset <= BOOKING_HORIZON_DAYS; offset += 1) {
    const key = dateToKey(addDays(today, offset))
    const hasSlot = TIME_SLOTS.some(
      (slot) => !slotUnavailable(key, slot, hours, bookedRanges)
    )
    if (hasSlot) return key
  }
  return null
}

export function BookingWidget({
  studio,
  bookedRanges,
  isAuthenticated,
  isOwner,
}: {
  studio: Studio
  bookedRanges: BookedRange[]
  isAuthenticated: boolean
  isOwner: boolean
}) {
  const [state, formAction, pending] = useActionState<BookingFormState, FormData>(
    createBookingAction,
    {}
  )
  const [hours, setHours] = useState(studio.minHours)
  const [selectedDate, setSelectedDate] = useState<string | null>(() =>
    nextAvailableDate(bookedRanges, studio.minHours)
  )
  const [startTime, setStartTime] = useState<string | null>(null)

  const totals = calculateTotals(studio.pricePerHour, hours)
  const today = startOfToday()
  const lastDay = bookingHorizon()

  const daySlots = selectedDate
    ? TIME_SLOTS.map((slot) => ({
        slot,
        available: !slotUnavailable(selectedDate, slot, hours, bookedRanges),
      }))
    : []
  const availableCount = daySlots.filter((item) => item.available).length

  const durationOptions = Array.from(
    { length: MAX_BOOKING_HOURS - studio.minHours + 1 },
    (_, index) => studio.minHours + index
  )

  const nextPath = `/studios/${studio.id}`

  if (isOwner) {
    return (
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm ring-1 ring-foreground/5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-300/60">
          <Sparkles className="size-3.5" />
          Your listing
        </span>
        <h2 className="mt-4 text-lg font-semibold tracking-tight">
          This is your space
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You are viewing the guest side of your listing. Manage availability,
          pricing, and bookings from your host dashboard.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <Button
            size="lg"
            className="h-10 w-full rounded-xl"
            nativeButton={false}
            render={<Link href="/dashboard/studios" />}
          >
            Manage listing
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-10 w-full rounded-xl"
            nativeButton={false}
            render={<Link href="/dashboard/bookings" />}
          >
            View bookings
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-lg shadow-black/5 ring-1 ring-foreground/5 sm:p-6">
      <div className="flex items-end justify-between gap-3">
        <p className="text-2xl font-semibold tracking-tight">
          {formatCurrency(studio.pricePerHour)}
          <span className="text-sm font-normal text-muted-foreground"> / hour</span>
        </p>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold",
            studio.instantBook
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              : "bg-amber-50 text-amber-800 ring-1 ring-amber-200"
          )}
        >
          {studio.instantBook ? (
            <>
              <Zap className="size-3" />
              Instant book
            </>
          ) : (
            <>
              <Clock className="size-3" />
              Host approval
            </>
          )}
        </span>
      </div>

      <form action={formAction} className="mt-5 flex flex-col gap-5">
        <input type="hidden" name="studioId" value={studio.id} />
        <input type="hidden" name="date" value={selectedDate ?? ""} />
        <input type="hidden" name="startTime" value={startTime ?? ""} />
        <input type="hidden" name="hours" value={hours} />

        {state.error && (
          <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
            <TriangleAlert />
            <AlertDescription className="text-destructive">
              {state.error}
            </AlertDescription>
          </Alert>
        )}

        <div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Select a date
            </p>
            <span className="text-xs text-muted-foreground">
              Next 90 days
            </span>
          </div>
          <div className="booking-calendar mt-2 rounded-xl border border-border/70">
            <Calendar
              mode="single"
              selected={selectedDate ? keyToDate(selectedDate) : undefined}
              onSelect={(date) => {
                setSelectedDate(date ? dateToKey(date) : null)
                setStartTime(null)
              }}
              disabled={(date) =>
                date < today ||
                date > lastDay ||
                !TIME_SLOTS.some(
                  (slot) =>
                    !slotUnavailable(
                      dateToKey(date),
                      slot,
                      hours,
                      bookedRanges
                    )
                )
              }
              className="w-full p-2"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Start time
            </p>
            <span className="text-xs text-muted-foreground">
              {selectedDate
                ? availableCount > 0
                  ? `${availableCount} slots open`
                  : "Fully booked"
                : "Pick a date first"}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {daySlots.map(({ slot, available }) => (
              <button
                key={slot}
                type="button"
                disabled={!available}
                onClick={() => setStartTime(slot)}
                aria-pressed={startTime === slot}
                className={cn(
                  "h-9 rounded-lg border text-xs font-medium transition-colors",
                  startTime === slot
                    ? "border-amber-500 bg-amber-500 text-[#17120a]"
                    : available
                      ? "border-border bg-background hover:border-amber-400 hover:bg-amber-50"
                      : "cursor-not-allowed border-border/60 bg-muted/50 text-muted-foreground/50 line-through"
                )}
              >
                {formatTime(slot)}
              </button>
            ))}
          </div>
          {selectedDate && availableCount === 0 && (
            <p className="mt-2 text-xs text-destructive">
              Every slot on this day is taken for a {hours}-hour session. Try
              another date or shorten the booking.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="booking-hours"
            className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase"
          >
            Duration
          </label>
          <select
            id="booking-hours"
            value={hours}
            onChange={(event) => {
              const nextHours = Number(event.target.value)
              setHours(nextHours)
              setStartTime((current) =>
                current &&
                selectedDate &&
                slotUnavailable(selectedDate, current, nextHours, bookedRanges)
                  ? null
                  : current
              )
            }}
            className="h-10 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {durationOptions.map((value) => (
              <option key={value} value={value}>
                {value} {value === 1 ? "hour" : "hours"}
                {value === studio.minHours ? " (minimum)" : ""}
              </option>
            ))}
          </select>
        </div>

        {selectedDate && startTime && (
          <div className="rounded-xl bg-secondary/60 p-3.5 text-sm">
            <div className="flex items-center gap-2 text-xs font-medium text-foreground">
              <CalendarCheck className="size-3.5 text-amber-600" />
              {formatDateLong(selectedDate)} · {formatTime(startTime)}
            </div>
            <dl className="mt-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted-foreground">
                  {formatCurrency(studio.pricePerHour)} × {hours}{" "}
                  {hours === 1 ? "hour" : "hours"}
                </dt>
                <dd className="font-medium tabular-nums">
                  {formatCurrency(totals.subtotal)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted-foreground">
                  Service fee ({Math.round(SERVICE_FEE_RATE * 100)}%)
                </dt>
                <dd className="font-medium tabular-nums">
                  {formatCurrency(totals.serviceFee)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-2 text-sm">
                <dt className="font-semibold">Total</dt>
                <dd className="font-semibold tabular-nums">
                  {formatCurrency(totals.total)}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {isAuthenticated ? (
          <Button
            type="submit"
            size="lg"
            disabled={pending || !selectedDate || !startTime}
            className="h-11 w-full rounded-xl text-sm font-semibold shadow-md shadow-amber-500/20"
          >
            {pending
              ? "Confirming…"
              : studio.instantBook
                ? "Confirm booking"
                : "Request booking"}
          </Button>
        ) : (
          <div className="flex flex-col gap-2">
            <Button
              size="lg"
              className="h-11 w-full rounded-xl text-sm font-semibold shadow-md shadow-amber-500/20"
              nativeButton={false}
              render={
                <Link
                  href={{
                    pathname: "/login",
                    query: { next: nextPath },
                  }}
                />
              }
            >
              Log in to book
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-10 w-full rounded-xl"
              nativeButton={false}
              render={
                <Link
                  href={{
                    pathname: "/register",
                    query: { next: nextPath },
                  }}
                />
              }
            >
              Create an account
            </Button>
          </div>
        )}

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          {isAuthenticated
            ? "You can cancel from your dashboard. No charge until your session is confirmed."
            : "Log in to reserve these hours. New accounts take about a minute."}
        </p>
      </form>

      <div className="mt-5 grid gap-2 border-t border-border/70 pt-4 text-xs text-muted-foreground">
        <p className="flex items-center gap-2">
          <ShieldCheck className="size-3.5 text-emerald-600" />
          Covered by the StudioSpace host guarantee
        </p>
        <p className="flex items-center gap-2">
          <Clock className="size-3.5 text-amber-600" />
          Operating hours {formatTime("08:00")} – {formatTime("20:00")}
        </p>
      </div>
    </div>
  )
}
