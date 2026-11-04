import {
  CATEGORY_SLUGS,
  type BookingStatus,
  type CategorySlug,
} from "@/lib/types"

type Raw = Record<string, unknown>

function record(value: unknown): Raw {
  return value && typeof value === "object" ? (value as Raw) : {}
}

function text(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim()
    if (typeof value === "number" && Number.isFinite(value)) return String(value)
  }
  return undefined
}

function numberValue(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value
    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
      return Number(value)
    }
  }
  return undefined
}

function booleanValue(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "boolean") return value
    if (value === "true" || value === "1") return true
    if (value === "false" || value === "0") return false
  }
  return undefined
}

function stringList(value: unknown) {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => (typeof item === "string" ? item : text(record(item).name)))
    .filter((item): item is string => Boolean(item))
}

const CATEGORY_ALIASES: Record<string, CategorySlug> = {
  "photo-studio": "photo-studios",
  "photo studios": "photo-studios",
  photography: "photo-studios",
  "film-stage": "sound-stages",
  "film stage": "sound-stages",
  "sound-stage": "sound-stages",
  "sound stages": "sound-stages",
  "podcast-lounge": "podcast-rooms",
  "podcast lounge": "podcast-rooms",
  "podcast room": "podcast-rooms",
  "music-suite": "music-suites",
  "music suite": "music-suites",
  workshop: "art-workshops",
  "art workshop": "art-workshops",
}

export function normalizeCategory(value: unknown): CategorySlug {
  const raw = text(value)?.toLowerCase() ?? ""
  const direct = CATEGORY_SLUGS.find((slug) => slug === raw)
  if (direct) return direct
  return CATEGORY_ALIASES[raw] ?? "photo-studios"
}

export function normalizeStatus(value: unknown): BookingStatus {
  const raw = text(value)?.toLowerCase() ?? "pending"
  if (raw === "canceled") return "cancelled"
  if (raw === "confirmed" || raw === "completed" || raw === "cancelled") {
    return raw
  }
  return "pending"
}

function iso(value: unknown, fallback = new Date().toISOString()) {
  const raw = text(value)
  if (!raw) return fallback
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString()
}

export function mapUser(value: unknown) {
  const raw = record(value)
  const photo = text(raw.avatar, raw.photoUrl, raw.image)
  return {
    id: text(raw.id, raw._id) ?? "",
    name: text(raw.name, raw.fullName) ?? "StudioSpace member",
    email: text(raw.email) ?? "",
    avatar: photo ?? "",
    photoUrl: photo,
    createdAt: iso(raw.createdAt, new Date(0).toISOString()),
  }
}

export function mapStudio(value: unknown) {
  const raw = record(value)
  const location = record(raw.location)
  const host = record(raw.host ?? raw.owner)
  const addressRecord = record(raw.address)
  const images = stringList(raw.images ?? raw.gallery)
  const cover = text(
    raw.imageUrl,
    raw.image,
    raw.coverImage,
    typeof raw.address === "string" ? undefined : addressRecord.image
  )
  if (cover && !images.includes(cover)) images.unshift(cover)

  const address =
    text(raw.address, location.address, addressRecord.street, addressRecord.full) ??
    undefined

  const city =
    text(raw.city, location.city, addressRecord.city) ?? "Los Angeles"
  const area =
    text(raw.area, raw.neighborhood, location.area, addressRecord.area) ??
    "Arts District"

  return {
    id: text(raw.id, raw._id) ?? "",
    title: text(raw.title, raw.name) ?? "Untitled studio",
    category: normalizeCategory(raw.category ?? raw.categorySlug ?? raw.type),
    description: text(raw.description, raw.overview, raw.details) ?? "",
    city,
    area,
    address: address ?? `${area}, ${city}`,
    pricePerHour: numberValue(raw.pricePerHour, raw.hourlyRate, raw.price) ?? 0,
    securityDeposit:
      numberValue(raw.securityDeposit, raw.deposit, raw.security_deposit) ?? 0,
    rating: numberValue(raw.rating, raw.averageRating) ?? 0,
    reviewCount:
      numberValue(raw.reviewCount, raw.reviewsCount, raw.numReviews) ?? 0,
    images:
      images.length > 0
        ? images
        : [
            "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=1400&q=80",
          ],
    amenities: stringList(raw.amenities),
    capacity: numberValue(raw.capacity, raw.maxCapacity) ?? 1,
    sizeSqft: numberValue(raw.sizeSqft, raw.size, raw.squareFeet) ?? 0,
    minHours: numberValue(raw.minHours, raw.minimumHours) ?? 1,
    instantBook: booleanValue(raw.instantBook, raw.instantBooking) ?? false,
    featured: booleanValue(raw.featured) ?? false,
    published: booleanValue(raw.published) ?? true,
    hostId: text(raw.hostId, raw.ownerId, host.id, host._id) ?? "",
    hostName:
      text(raw.hostName, raw.ownerName, host.name) ?? "StudioSpace host",
    hostEmail: text(raw.hostEmail, raw.ownerEmail, host.email),
    hostAvatar: text(raw.hostAvatar, raw.ownerAvatar, host.avatar) ?? "",
    hostSince: text(raw.hostSince, raw.ownerSince) ?? "2024",
    createdAt: iso(raw.createdAt),
    rules: stringList(raw.rules),
  }
}

export function mapBooking(value: unknown) {
  const raw = record(value)
  const studio = record(raw.studio)
  const date = text(raw.date, raw.bookingDate, raw.startDate) ?? ""
  return {
    id: text(raw.id, raw._id) ?? "",
    studioId: text(raw.studioId, studio.id, studio._id) ?? "",
    studioTitle: text(raw.studioTitle, studio.title) ?? "Studio",
    studioImage:
      text(raw.studioImage, studio.image, studio.imageUrl) ??
      stringList(studio.images)[0] ??
      "",
    category: normalizeCategory(raw.category ?? studio.category),
    city: text(raw.city, studio.city) ?? "",
    userId: text(raw.userId, raw.renterId, record(raw.user).id) ?? "",
    userName: text(raw.userName, record(raw.user).name) ?? "",
    date: date.includes("T") ? date.slice(0, 10) : date,
    startTime: text(raw.startTime, raw.start) ?? "10:00",
    hours: numberValue(raw.hours, raw.duration) ?? 1,
    pricePerHour:
      numberValue(raw.pricePerHour, studio.pricePerHour, studio.hourlyRate) ?? 0,
    total: numberValue(raw.total, raw.totalPrice, raw.amount) ?? 0,
    securityDeposit:
      numberValue(raw.securityDeposit, studio.securityDeposit) ?? 0,
    status: normalizeStatus(raw.status),
    createdAt: iso(raw.createdAt),
  }
}

export function mapReview(value: unknown) {
  const raw = record(value)
  return {
    id: text(raw.id, raw._id) ?? "",
    studioId: text(raw.studioId) ?? "",
    author: text(raw.author, raw.authorName, record(raw.user).name) ?? "Creator",
    avatar: text(raw.avatar, raw.authorAvatar, record(raw.user).avatar) ?? "",
    rating: numberValue(raw.rating) ?? 5,
    date: iso(raw.date, new Date().toISOString()).slice(0, 10),
    body: text(raw.body, raw.comment, raw.review) ?? "",
  }
}

export function unwrapList<T>(value: unknown, mapper: (item: unknown) => T): T[] {
  if (Array.isArray(value)) return value.map(mapper)
  const raw = record(value)
  const list =
    raw.items ?? raw.data ?? raw.studios ?? raw.bookings ?? raw.reviews ?? raw.results
  return Array.isArray(list) ? list.map(mapper) : []
}

export function unwrapObject<T>(value: unknown, mapper: (item: unknown) => T): T {
  const raw = record(value)
  return mapper(raw.data ?? raw.studio ?? raw.booking ?? raw.user ?? raw.review ?? value)
}

export function unwrapCollection<T>(
  value: unknown,
  mapper: (item: unknown) => T
) {
  const items = unwrapList(value, mapper)
  const raw = record(value)
  const total = numberValue(raw.total, raw.count) ?? items.length
  return { items, total }
}
