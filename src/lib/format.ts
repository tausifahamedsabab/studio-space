import { BOOKING_HORIZON_DAYS, SERVICE_FEE_RATE } from "./constants"

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount)
}

export function formatCompactCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: amount >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(amount)
}

export function dateToKey(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

export function keyToDate(key: string) {
  return new Date(`${key}T12:00:00`)
}

export function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function startOfToday() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

export function bookingHorizon() {
  return addDays(startOfToday(), BOOKING_HORIZON_DAYS)
}

export function formatDateLong(key: string) {
  return keyToDate(key).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatDateShort(key: string) {
  return keyToDate(key).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export function formatTime(time: string) {
  const [hour] = time.split(":").map(Number)
  const suffix = hour >= 12 ? "PM" : "AM"
  const normalized = hour % 12 === 0 ? 12 : hour % 12
  return `${normalized}:00 ${suffix}`
}

export function formatTimeRange(startTime: string, hours: number) {
  const startHour = Number(startTime.split(":")[0])
  const endHour = startHour + hours
  const format = (hour: number) => {
    const suffix = hour >= 12 ? "PM" : "AM"
    const normalized = hour % 12 === 0 ? 12 : hour % 12
    return `${normalized}:00 ${suffix}`
  }
  return `${format(startHour)} – ${format(endHour)}`
}

export function timeToHour(time: string) {
  return Number(time.split(":")[0])
}

export function rangesOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number
) {
  return startA < endB && startB < endA
}

export function calculateTotals(pricePerHour: number, hours: number) {
  const subtotal = pricePerHour * hours
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE)
  return { subtotal, serviceFee, total: subtotal + serviceFee }
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function pluralize(count: number, singular: string, plural?: string) {
  return `${count} ${count === 1 ? singular : plural ?? `${singular}s`}`
}
