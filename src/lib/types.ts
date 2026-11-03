export const CATEGORY_SLUGS = [
  "photo-studios",
  "sound-stages",
  "podcast-rooms",
  "music-suites",
  "art-workshops",
] as const

export type CategorySlug = (typeof CATEGORY_SLUGS)[number]

export type StudioCategory = {
  slug: CategorySlug
  name: string
  shortName: string
  description: string
  image: string
  accent: string
}

export type Studio = {
  id: string
  title: string
  category: CategorySlug
  description: string
  city: string
  area: string
  pricePerHour: number
  rating: number
  reviewCount: number
  images: string[]
  amenities: string[]
  capacity: number
  sizeSqft: number
  minHours: number
  instantBook: boolean
  featured: boolean
  published: boolean
  hostId: string
  hostName: string
  hostAvatar: string
  hostSince: string
  createdAt: string
  rules: string[]
}

export type BookingStatus = "confirmed" | "completed" | "cancelled"

export type Booking = {
  id: string
  studioId: string
  studioTitle: string
  studioImage: string
  category: CategorySlug
  city: string
  userId: string
  userName: string
  date: string
  startTime: string
  hours: number
  pricePerHour: number
  total: number
  status: BookingStatus
  createdAt: string
}

export type Review = {
  id: string
  studioId: string
  author: string
  avatar: string
  rating: number
  date: string
  body: string
}

export type User = {
  id: string
  name: string
  email: string
  passwordHash: string
  avatar: string
  createdAt: string
}

export type PublicUser = Omit<User, "passwordHash">

export type BookedRange = {
  date: string
  startTime: string
  hours: number
}

export type StudioFilters = {
  q?: string
  category?: string
  city?: string
  maxPrice?: number
  sort?: "recommended" | "rating" | "price-asc" | "price-desc" | "newest"
  page?: number
}

export type StudioSearchResult = {
  items: Studio[]
  total: number
  page: number
  pages: number
}
