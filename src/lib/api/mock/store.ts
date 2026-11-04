import { randomUUID } from "node:crypto"

import { CATEGORY_SLUGS } from "@/lib/types"
import type {
  Booking,
  BookedRange,
  PublicUser,
  Review,
  Studio,
  StudioFilters,
  StudioSearchResult,
  User,
} from "@/lib/types"
import { dateToKey, startOfToday } from "@/lib/format"

import { ApiError } from "../errors"
import { hashPassword, verifyPassword } from "./password"
import { SEED_BOOKINGS, SEED_REVIEWS, SEED_STUDIOS, SEED_USERS } from "@/lib/seed"

const PAGE_SIZE = 9

type MockStore = {
  users: User[]
  studios: Studio[]
  bookings: Booking[]
  reviews: Review[]
}

const globalCache = globalThis as unknown as {
  __studiospaceMockStore?: MockStore
}

function withStudioDefaults(studios: Studio[], users: User[]): Studio[] {
  return studios.map((studio) => {
    const host = users.find((user) => user.id === studio.hostId)
    return {
      ...studio,
      address: studio.address ?? `${studio.area}, ${studio.city}`,
      securityDeposit: studio.securityDeposit ?? 0,
      hostEmail: studio.hostEmail ?? host?.email,
    }
  })
}

export function getMockStore(): MockStore {
  if (!globalCache.__studiospaceMockStore) {
    const users = structuredClone(SEED_USERS)
    const studios = withStudioDefaults(structuredClone(SEED_STUDIOS), users)
    const bookings = structuredClone(SEED_BOOKINGS).map((booking) => {
      const studio = studios.find((item) => item.id === booking.studioId)
      return {
        ...booking,
        securityDeposit: booking.securityDeposit ?? studio?.securityDeposit ?? 0,
      }
    })
    globalCache.__studiospaceMockStore = {
      users,
      studios,
      bookings,
      reviews: structuredClone(SEED_REVIEWS),
    }
  }

  return globalCache.__studiospaceMockStore
}

function toPublicUser(user: User): PublicUser {
  const { passwordHash, ...publicUser } = user
  void passwordHash
  return publicUser
}

export async function mockRegister(input: {
  name: string
  email: string
  photoUrl?: string
  password: string
}) {
  const store = getMockStore()
  const email = input.email.trim().toLowerCase()

  if (store.users.some((user) => user.email.toLowerCase() === email)) {
    throw new ApiError("An account with that email already exists.", 409, {
      email: "This email is already registered.",
    })
  }

  const user: User = {
    id: `usr-${randomUUID()}`,
    name: input.name.trim(),
    email,
    passwordHash: await hashPassword(input.password),
    avatar: input.photoUrl ?? "",
    photoUrl: input.photoUrl,
    createdAt: new Date().toISOString(),
  }

  store.users.push(user)
  return toPublicUser(user)
}

export async function mockLogin(input: { email: string; password: string }) {
  const store = getMockStore()
  const email = input.email.trim().toLowerCase()
  const user = store.users.find((item) => item.email.toLowerCase() === email)

  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    return null
  }

  return toPublicUser(user)
}

export function mockResolveSession(token: string | undefined) {
  if (!token?.startsWith("mock:")) return null
  const id = token.slice("mock:".length)
  const user = getMockStore().users.find((item) => item.id === id)
  return user ? toPublicUser(user) : null
}

export function mockSessionToken(userId: string) {
  return `mock:${userId}`
}

export function mockCreateStudio(
  input: Omit<Studio, "id" | "createdAt" | "rating" | "reviewCount" | "featured" | "published">
): Studio {
  const store = getMockStore()
  const studio: Studio = {
    ...input,
    id: `stu-${randomUUID()}`,
    rating: 0,
    reviewCount: 0,
    featured: false,
    published: true,
    createdAt: new Date().toISOString(),
  }
  store.studios.push(studio)
  return studio
}

export function mockUpdateStudio(
  studioId: string,
  hostId: string,
  patch: Partial<Studio>
): Studio | null {
  const store = getMockStore()
  const index = store.studios.findIndex((studio) => studio.id === studioId)
  if (index === -1) return null
  if (store.studios[index].hostId !== hostId) {
    throw new ApiError("You can only edit your own listings.", 403)
  }

  store.studios[index] = {
    ...store.studios[index],
    ...patch,
    id: studioId,
    hostId: store.studios[index].hostId,
  }
  return store.studios[index]
}

export function mockRemoveStudio(studioId: string, hostId: string) {
  const store = getMockStore()
  const index = store.studios.findIndex((studio) => studio.id === studioId)
  if (index === -1) return false
  if (store.studios[index].hostId !== hostId) {
    throw new ApiError("You can only delete your own listings.", 403)
  }
  store.studios.splice(index, 1)
  return true
}

export function mockGetStudioById(id: string) {
  return getMockStore().studios.find((studio) => studio.id === id) ?? null
}

export function mockGetFeaturedStudios(limit = 6) {
  return getMockStore()
    .studios.filter((studio) => studio.published)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      if (b.rating !== a.rating) return b.rating - a.rating
      return b.reviewCount - a.reviewCount
    })
    .slice(0, limit)
}

export function mockGetStudiosByHost(hostId: string) {
  return getMockStore()
    .studios.filter((studio) => studio.hostId === hostId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function mockGetCategoryCounts() {
  const counts: Record<string, number> = {}
  for (const slug of CATEGORY_SLUGS) counts[slug] = 0
  for (const studio of getMockStore().studios) {
    if (studio.published) {
      counts[studio.category] = (counts[studio.category] ?? 0) + 1
    }
  }
  return counts
}

export function mockGetStudioCities() {
  return [
    ...new Set(
      getMockStore()
        .studios.filter((studio) => studio.published)
        .map((studio) => studio.city)
    ),
  ].sort()
}

export function mockSearchStudios(filters: StudioFilters): StudioSearchResult {
  const studios = getMockStore().studios.filter((studio) => studio.published)
  const q = filters.q?.trim().toLowerCase() ?? ""
  const sort = filters.sort ?? "recommended"

  const filtered = studios
    .filter((studio) => {
      if (filters.category && studio.category !== filters.category) return false
      if (filters.city && studio.city !== filters.city) return false
      if (
        typeof filters.maxPrice === "number" &&
        studio.pricePerHour > filters.maxPrice
      ) {
        return false
      }
      if (!q) return true
      return [
        studio.title,
        studio.city,
        studio.area,
        studio.description,
        studio.category,
        ...studio.amenities,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    })
    .sort((a, b) => {
      if (sort === "rating") {
        return b.rating - a.rating || b.reviewCount - a.reviewCount
      }
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

export function mockGetRelatedStudios(studio: Studio, limit = 3) {
  return getMockStore()
    .studios.filter(
      (candidate) =>
        candidate.published &&
        candidate.id !== studio.id &&
        candidate.category === studio.category
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

export function mockGetReviewsForStudio(studioId: string) {
  return getMockStore()
    .reviews.filter((review) => review.studioId === studioId)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function mockGetBookedRanges(studioId: string): BookedRange[] {
  const today = dateToKey(startOfToday())
  return getMockStore()
    .bookings.filter(
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

export function mockGetBookingsForUser(userId: string) {
  return getMockStore().bookings.filter((booking) => booking.userId === userId)
}

export function mockCreateBooking(input: {
  studio: Studio
  userId: string
  userName: string
  date: string
  startTime: string
  hours: number
  total: number
}): Booking {
  const store = getMockStore()
  const startHour = Number(input.startTime.split(":")[0])
  const hasConflict = store.bookings.some((booking) => {
    if (
      booking.studioId !== input.studio.id ||
      booking.status !== "confirmed" ||
      booking.date !== input.date
    ) {
      return false
    }
    const bookedStart = Number(booking.startTime.split(":")[0])
    return (
      startHour < bookedStart + booking.hours &&
      bookedStart < startHour + input.hours
    )
  })

  if (hasConflict) {
    throw new ApiError(
      "Someone just booked that window. Please choose another time.",
      409
    )
  }

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
    securityDeposit: input.studio.securityDeposit ?? 0,
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  store.bookings.push(booking)
  return booking
}

export function mockCancelBooking(bookingId: string, userId: string) {
  const store = getMockStore()
  const booking = store.bookings.find((item) => item.id === bookingId)
  if (
    !booking ||
    booking.userId !== userId ||
    (booking.status !== "confirmed" && booking.status !== "pending")
  ) {
    return false
  }
  booking.status = "cancelled"
  return true
}
