import { dateToKey, startOfToday } from "./format"
import type { Booking } from "./types"

export function isUpcomingBooking(booking: Booking) {
  return (
    (booking.status === "confirmed" || booking.status === "pending") &&
    booking.date >= dateToKey(startOfToday())
  )
}

export function isPastBooking(booking: Booking) {
  return (
    booking.status === "completed" ||
    ((booking.status === "confirmed" || booking.status === "pending") &&
      booking.date < dateToKey(startOfToday()))
  )
}

export function sortBookingsAscending(a: Booking, b: Booking) {
  return a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
}

export function sortBookingsDescending(a: Booking, b: Booking) {
  return b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime)
}
