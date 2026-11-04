"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { isApiError } from "@/lib/api/errors"
import { requireUser } from "@/lib/auth"
import { CATEGORY_BY_SLUG, MAX_BOOKING_HOURS } from "@/lib/constants"
import { createStudio, removeStudio, updateStudio } from "@/lib/data"
import type { CategorySlug, Studio } from "@/lib/types"

export type StudioFormState = {
  error?: string
  fieldErrors?: Record<string, string>
  values?: Record<string, string>
  amenities?: string[]
  instantBook?: boolean
}

function isCategory(value: string): value is CategorySlug {
  return value in CATEGORY_BY_SLUG
}

function validImageUrl(value: string) {
  if (!value) return false
  if (value.startsWith("/")) return true
  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:"
  } catch {
    return false
  }
}

function readStudioForm(formData: FormData) {
  const values = {
    title: String(formData.get("title") ?? "").trim(),
    category: String(formData.get("category") ?? ""),
    city: String(formData.get("city") ?? "").trim(),
    area: String(formData.get("area") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    pricePerHour: String(formData.get("pricePerHour") ?? "").trim(),
    securityDeposit: String(formData.get("securityDeposit") ?? "").trim(),
    capacity: String(formData.get("capacity") ?? "").trim(),
    sizeSqft: String(formData.get("sizeSqft") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    imageUrl: String(formData.get("imageUrl") ?? "").trim(),
    minHours: String(formData.get("minHours") ?? "2"),
    rules: String(formData.get("rules") ?? "").trim(),
  }
  const amenities = formData
    .getAll("amenities")
    .map((value) => String(value))
    .filter(Boolean)
  const instantBook = formData.get("instantBook") === "on"

  const fieldErrors: Record<string, string> = {}
  if (values.title.length < 4) {
    fieldErrors.title = "Give your space a name of at least 4 characters."
  }
  if (!isCategory(values.category)) {
    fieldErrors.category = "Choose a category for your space."
  }
  if (values.city.length < 2) fieldErrors.city = "Add a city."
  if (values.area.length < 2) fieldErrors.area = "Add a neighborhood or area."
  if (values.address && values.address.length < 5) {
    fieldErrors.address = "Enter a full street address, or leave it blank."
  }

  const price = Number(values.pricePerHour)
  if (!Number.isFinite(price) || price < 20 || price > 2000) {
    fieldErrors.pricePerHour = "Set an hourly rate between $20 and $2,000."
  }

  const securityDeposit = values.securityDeposit
    ? Number(values.securityDeposit)
    : 0
  if (
    !Number.isFinite(securityDeposit) ||
    securityDeposit < 0 ||
    securityDeposit > 5000
  ) {
    fieldErrors.securityDeposit =
      "Set a refundable deposit between $0 and $5,000."
  }

  const capacity = Number(values.capacity)
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 500) {
    fieldErrors.capacity = "Capacity must be between 1 and 500 people."
  }

  const sizeSqft = Number(values.sizeSqft)
  if (!Number.isFinite(sizeSqft) || sizeSqft < 100 || sizeSqft > 100000) {
    fieldErrors.sizeSqft = "Enter a size between 100 and 100,000 sq ft."
  }

  if (values.description.length < 60) {
    fieldErrors.description =
      "Write at least 60 characters so creators know what to expect."
  }

  if (values.imageUrl && !validImageUrl(values.imageUrl)) {
    fieldErrors.imageUrl = "Enter a valid image URL, or leave it blank."
  }

  if (amenities.length === 0) {
    fieldErrors.amenities = "Select at least one amenity."
  }

  const minHours = Number(values.minHours)
  if (
    !Number.isInteger(minHours) ||
    minHours < 1 ||
    minHours > MAX_BOOKING_HOURS
  ) {
    fieldErrors.minHours = "Minimum booking must be between 1 and 8 hours."
  }

  return {
    values,
    amenities,
    instantBook,
    fieldErrors,
    price,
    securityDeposit,
    capacity,
    sizeSqft,
    minHours,
  }
}

function buildStudioInput(
  parsed: ReturnType<typeof readStudioForm>,
  host: { id: string; name: string; email: string; avatar: string; createdAt: string }
) {
  const category = parsed.values.category as CategorySlug
  const categoryData = CATEGORY_BY_SLUG[category]
  const image = validImageUrl(parsed.values.imageUrl)
    ? parsed.values.imageUrl
    : categoryData.image

  const rules = parsed.values.rules
    .split("\n")
    .map((rule) => rule.trim())
    .filter(Boolean)
    .slice(0, 8)

  const address =
    parsed.values.address || `${parsed.values.area}, ${parsed.values.city}`

  const input: Omit<
    Studio,
    "id" | "createdAt" | "rating" | "reviewCount" | "featured" | "published"
  > = {
    title: parsed.values.title,
    category,
    description: parsed.values.description,
    city: parsed.values.city,
    area: parsed.values.area,
    address,
    pricePerHour: Math.round(parsed.price),
    securityDeposit: Math.round(parsed.securityDeposit),
    images: [image, ...categoryGallery(category, image)],
    amenities: parsed.amenities,
    capacity: parsed.capacity,
    sizeSqft: Math.round(parsed.sizeSqft),
    minHours: parsed.minHours,
    instantBook: parsed.instantBook,
    hostId: host.id,
    hostName: host.name,
    hostEmail: host.email,
    hostAvatar: host.avatar,
    hostSince: new Date(host.createdAt).getFullYear().toString(),
    rules:
      rules.length > 0
        ? rules
        : [
            "Treat the space and the neighbors with respect.",
            "Load-out must be complete by the end of your booking.",
            "Report any damage before you leave.",
          ],
  }

  return input
}

function formState(
  parsed: ReturnType<typeof readStudioForm>
): StudioFormState {
  return {
    fieldErrors: parsed.fieldErrors,
    values: parsed.values,
    amenities: parsed.amenities,
    instantBook: parsed.instantBook,
  }
}

export async function createStudioAction(
  _prevState: StudioFormState,
  formData: FormData
): Promise<StudioFormState> {
  const user = await requireUser()
  const parsed = readStudioForm(formData)

  if (Object.keys(parsed.fieldErrors).length > 0) {
    return formState(parsed)
  }

  let studio: Studio
  try {
    studio = await createStudio(buildStudioInput(parsed, user))
  } catch (error) {
    if (isApiError(error)) {
      return { ...formState(parsed), error: error.message }
    }
    throw error
  }

  revalidateStudioPaths()
  redirect(`/my-listings?created=${studio.id}`)
}

export async function updateStudioAction(
  _prevState: StudioFormState,
  formData: FormData
): Promise<StudioFormState> {
  const user = await requireUser()
  const studioId = String(formData.get("studioId") ?? "")
  if (!studioId) {
    return { error: "That listing could not be found." }
  }

  const parsed = readStudioForm(formData)
  if (Object.keys(parsed.fieldErrors).length > 0) {
    return formState(parsed)
  }

  try {
    const studio = await updateStudio(
      studioId,
      user.id,
      buildStudioInput(parsed, user)
    )
    if (!studio) {
      return { ...formState(parsed), error: "That listing could not be found." }
    }
  } catch (error) {
    if (isApiError(error)) {
      return { ...formState(parsed), error: error.message }
    }
    throw error
  }

  revalidateStudioPaths()
  redirect(`/my-listings?updated=${studioId}`)
}

function revalidateStudioPaths() {
  revalidatePath("/")
  revalidatePath("/studios")
  revalidatePath("/dashboard")
  revalidatePath("/my-listings")
}

export async function deleteStudioAction(formData: FormData) {
  const user = await requireUser()
  const studioId = String(formData.get("studioId") ?? "")
  if (!studioId) redirect("/my-listings")

  await removeStudio(studioId, user.id)
  revalidateStudioPaths()
  redirect("/my-listings?deleted=1")
}

function categoryGallery(category: CategorySlug, image: string) {
  const categoryData = CATEGORY_BY_SLUG[category]
  const pool = [categoryData.image, ...galleryByCategory[category]].filter(
    (url) => url !== image
  )
  return [...new Set(pool)].slice(0, 3)
}

const galleryByCategory: Record<CategorySlug, string[]> = {
  "photo-studios": [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  ],
  "sound-stages": [
    "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80",
  ],
  "podcast-rooms": [
    "https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
  ],
  "music-suites": [
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=1200&q=80",
  ],
  "art-workshops": [
    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1200&q=80",
  ],
}
