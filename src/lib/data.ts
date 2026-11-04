import type { CategorySlug, PublicUser, User } from "./types"
import { CATEGORY_SLUGS } from "./types"

export {
  createStudio,
  getBookedRanges,
  getCategoryCounts,
  getFeaturedStudios,
  getRelatedStudios,
  getReviewsForStudio,
  getStudioById,
  getStudioCities,
  getStudiosByHost,
  removeStudio,
  searchStudios,
  updateStudio,
} from "./api/studios"
export {
  cancelBooking,
  createBooking,
  getBookingsForUser,
} from "./api/bookings"

export function toPublicUser(user: User): PublicUser {
  const { passwordHash, ...publicUser } = user
  void passwordHash
  return publicUser
}

export function parseCategory(value?: string): CategorySlug | undefined {
  return CATEGORY_SLUGS.find((slug) => slug === value)
}
