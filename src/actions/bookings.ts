"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { requireUser } from "@/lib/auth"
import {
  BOOKING_HORIZON_DAYS,
  CLOSE_HOUR,
  MAX_BOOKING_HOURS,
  OPEN_HOUR,
  TIME_SLOTS,
} from "@/lib/constants"
import {
  cancelBooking,
  createBooking,
  getStudioById,
} from "@/lib/data"
import { readAll } from "@/lib/db"
import {
  addDays,
  calculateTotals,
  dateToKey,
  rangesOverlap,
  startOfToday,
  timeToHour,
} from "@/lib/format"

export type BookingFormState = {
  error?: string
}

export async function createBookingAction(
  _prevState: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const user = await requireUser()

  const studioId = String(formData.get("studioId") ?? "")
  const date = String(formData.get("date") ?? "")
  const startTime = String(formData.get("startTime") ?? "")
  const hours = Number(formData.get("hours"))

  const studio = await getStudioById(studioId)
  if (!studio || !studio.published) {
    return { error: "This studio is no longer available." }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { error: "Choose a date for your session." }
  }

  const today = startOfToday()
  const todayKey = dateToKey(today)
  const lastKey = dateToKey(addDays(today, BOOKING_HORIZON_DAYS))
  if (date < todayKey || date > lastKey) {
    return { error: "Choose a date within the next 90 days." }
  }

  if (!TIME_SLOTS.includes(startTime as (typeof TIME_SLOTS)[number])) {
    return { error: "Choose a valid start time." }
  }

  if (
    !Number.isInteger(hours) ||
    hours < studio.minHours ||
    hours > MAX_BOOKING_HOURS
  ) {
    return {
      error: `This space requires a minimum of ${studio.minHours} hour${
        studio.minHours === 1 ? "" : "s"
      } and allows up to ${MAX_BOOKING_HOURS}.`,
    }
  }

  const startHour = timeToHour(startTime)
  if (startHour < OPEN_HOUR || startHour + hours > CLOSE_HOUR) {
    return { error: "That time runs past the studio's operating hours." }
  }

  if (date === todayKey && startHour <= new Date().getHours()) {
    return { error: "That start time has already passed. Pick a later slot." }
  }

  const bookings = await readAll("bookings")
  const hasConflict = bookings.some((booking) => {
    if (
      booking.studioId !== studio.id ||
      booking.status !== "confirmed" ||
      booking.date !== date
    ) {
      return false
    }
    const bookedStart = timeToHour(booking.startTime)
    return rangesOverlap(
      startHour,
      startHour + hours,
      bookedStart,
      bookedStart + booking.hours
    )
  })

  if (hasConflict) {
    return {
      error: "Someone just booked that window. Please choose another time.",
    }
  }

  const { total } = calculateTotals(studio.pricePerHour, hours)
  const booking = await createBooking({
    studio,
    userId: user.id,
    userName: user.name,
    date,
    startTime,
    hours,
    total,
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/bookings")
  revalidatePath(`/studios/${studio.id}`)
  redirect(`/dashboard/bookings?booked=${booking.id}`)
}

export async function cancelBookingAction(formData: FormData) {
  const user = await requireUser()
  const bookingId = String(formData.get("bookingId") ?? "")
  if (!bookingId) redirect("/dashboard/bookings")

  await cancelBooking(bookingId, user.id)
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/bookings")
  redirect("/dashboard/bookings?cancelled=1")
}
