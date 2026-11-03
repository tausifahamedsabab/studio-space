import { randomUUID } from "node:crypto"

import { CATEGORY_SLUGS } from "./types"
import type { CategorySlug } from "./types"
import {
  deleteOne,
  insertOne,
  readAll,
  updateOne,
} from "./db"
import { dateToKey, startOfToday } from "./format"
import type {
  Booking,
  BookedRange,
  PublicUser,
  Review,
  Studio,
  StudioFilters,
  StudioSearchResult,
  User,
} from "./types"

const PAGE_SIZE = 9

export function toPublicUser(user: User): PublicUser {
  const { passwordHash, ...publicUser } = user
  void passwordHash
  return publicUser
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await readAll("users")
  return users.find((user) => user.id === id) ?? null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await readAll("users")
  const normalized = email.trim().toLowerCase()
  return users.find((user) => user.email.toLowerCase() === normalized) ?? null
}

export async function createUser(input: {
  name: string
  email: string
  passwordHash: string
}): Promise<PublicUser> {
  const user: User = {
    id: `usr-${randomUUID()}`,
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    avatar: "",
    createdAt: new Date().toISOString(),
  }
  await insertOne("users", user)
  return toPublicUser(user)
}

export async function getFeaturedStudios(limit = 6): Promise<Studio[]> {
  const studios = await readAll("studios")
  return studios
    .filter((studio) => studio.published)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      if (b.rating !== a.rating) return b.rating - a.rating
      return b.reviewCount - a.reviewCount
    })
    .slice(0, limit)
}

export async function getStudioById(id: string): Promise<Studio | null> {
  const studios = await readAll("studios")
  return studios.find((studio) => studio.id === id) ?? null
}

export async function getStudiosByHost(hostId: string): Promise<Studio[]> {
  const studios = await readAll("studios")
  return studios
    .filter((studio) => studio.hostId === hostId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const studios = await readAll("studios")
  const counts: Record<string, number> = {}
  for (const slug of CATEGORY_SLUGS) counts[slug] = 0
  for (const studio of studios) {
    if (studio.published) counts[studio.category] = (counts[studio.category] ?? 0) + 1
  }
  return counts
}

export async function getStudioCities(): Promise<string[]> {
  const studios = await readAll("studios")
  return [...new Set(studios.filter((s) => s.published).map((s) => s.city))].sort()
}

function normalizeSort(sort?: string): StudioFilters["sort"] {
  if (
    sort === "rating" ||
    sort === "price-asc" ||
    sort === "price-desc" ||
    sort === "newest"
  ) {
    return sort
  }
  return "recommended"
}

export async function searchStudios(
  filters: StudioFilters
): Promise<StudioSearchResult> {
  const studios = (await readAll("studios")).filter((studio) => studio.published)
  const q = filters.q?.trim().toLowerCase() ?? ""
  const category = filters.category
  const city = filters.city
  const maxPrice = filters.maxPrice
  const sort = normalizeSort(filters.sort)

  let filtered = studios.filter((studio) => {
    if (category && studio.category !== category) return false
    if (city && studio.city !== city) return false
    if (typeof maxPrice === "number" && studio.pricePerHour > maxPrice) return false
    if (!q) return true
    const haystack = [
      studio.title,
      studio.city,
      studio.area,
      studio.description,
      studio.category,
      ...studio.amenities,
    ]
      .join(" ")
      .toLowerCase()
    return haystack.includes(q)
  })

  filtered = filtered.sort((a, b) => {
    if (sort === "rating") return b.rating - a.rating || b.reviewCount - a.reviewCount
    if (sort === "price-asc") return a.pricePerHour - b.pricePerHour
    if (sort === "price-desc") return b.pricePerHour - a.pricePerHour
    if (sort === "newest") return b.createdAt.localeCompare(a.createdAt)
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return b.rating - a.rating || b.reviewCount - a.reviewCount
  })

  const total = filtered.length
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const page = Math.min(Math.max(1, filters.page ?? 1), pages)
  const start = (page - 1) * PAGE_SIZE

  return {
    items: filtered.slice(start, start + PAGE_SIZE),
    total,
    page,
    pages,
  }
}

export async function getRelatedStudios(
  studio: Studio,
  limit = 3
): Promise<Studio[]> {
  const studios = await readAll("studios")
  return studios
    .filter(
      (candidate) =>
        candidate.published &&
        candidate.id !== studio.id &&
        candidate.category === studio.category
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

export async function getReviewsForStudio(studioId: string): Promise<Review[]> {
  const reviews = await readAll("reviews")
  return reviews
    .filter((review) => review.studioId === studioId)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export async function getBookedRanges(studioId: string): Promise<BookedRange[]> {
  const bookings = await readAll("bookings")
  const today = dateToKey(startOfToday())
  return bookings
    .filter(
      (booking) =>
        booking.studioId === studioId &&
        booking.status === "confirmed" &&
        booking.date >= today
    )
    .map((booking) => ({
      date: booking.date,
      startTime: booking.startTime,
      hours: booking.hours,
    }))
}

export async function getBookingsForUser(userId: string): Promise<Booking[]> {
  const bookings = await readAll("bookings")
  return bookings.filter((booking) => booking.userId === userId)
}

export async function getBookingsForHost(hostId: string): Promise<Booking[]> {
  const [studios, bookings] = await Promise.all([
    getStudiosByHost(hostId),
    readAll("bookings"),
  ])
  const studioIds = new Set(studios.map((studio) => studio.id))
  return bookings.filter((booking) => studioIds.has(booking.studioId))
}

export async function createBooking(input: {
  studio: Studio
  userId: string
  userName: string
  date: string
  startTime: string
  hours: number
  total: number
}): Promise<Booking> {
  const booking: Booking = {
    id: `bkg-${randomUUID()}`,
    studioId: input.studio.id,
    studioTitle: input.studio.title,
    studioImage: input.studio.images[0],
    category: input.studio.category,
    city: input.studio.city,
    userId: input.userId,
    userName: input.userName,
    date: input.date,
    startTime: input.startTime,
    hours: input.hours,
    pricePerHour: input.studio.pricePerHour,
    total: input.total,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  }
  await insertOne("bookings", booking)
  return booking
}

export async function cancelBooking(
  bookingId: string,
  userId: string
): Promise<boolean> {
  const bookings = await readAll("bookings")
  const booking = bookings.find((item) => item.id === bookingId)
  if (!booking || booking.userId !== userId || booking.status !== "confirmed") {
    return false
  }
  const updated = await updateOne("bookings", bookingId, { status: "cancelled" })
  return updated !== null
}

export async function createStudio(
  input: Omit<Studio, "id" | "createdAt" | "rating" | "reviewCount" | "featured" | "published">
): Promise<Studio> {
  const studio: Studio = {
    ...input,
    id: `stu-${randomUUID()}`,
    rating: 0,
    reviewCount: 0,
    featured: false,
    published: true,
    createdAt: new Date().toISOString(),
  }
  await insertOne("studios", studio)
  return studio
}

export async function removeStudio(
  studioId: string,
  hostId: string
): Promise<boolean> {
  const studio = await getStudioById(studioId)
  if (!studio || studio.hostId !== hostId) return false
  return deleteOne("studios", studioId)
}

export function parseCategory(value?: string): CategorySlug | undefined {
  return CATEGORY_SLUGS.find((slug) => slug === value)
}
