import type {
  BookedRange,
  Studio,
  StudioFilters,
  StudioSearchResult,
} from "@/lib/types"

import { isMockMode } from "./config"
import { apiFetch, apiRequest } from "./client"
import { isApiError } from "./errors"
import {
  mapReview,
  mapStudio,
  normalizeCategory,
  unwrapCollection,
  unwrapList,
  unwrapObject,
} from "./mappers"
import {
  mockCreateStudio,
  mockGetBookedRanges,
  mockGetCategoryCounts,
  mockGetFeaturedStudios,
  mockGetRelatedStudios,
  mockGetReviewsForStudio,
  mockGetStudioById,
  mockGetStudioCities,
  mockGetStudiosByHost,
  mockRemoveStudio,
  mockSearchStudios,
  mockUpdateStudio,
} from "./mock/store"

const PAGE_SIZE = 9

export type CreateStudioInput = Omit<
  Studio,
  "id" | "createdAt" | "rating" | "reviewCount" | "featured" | "published"
>

function queryString(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue
    search.set(key, String(value))
  }
  const query = search.toString()
  return query ? `?${query}` : ""
}

export async function getFeaturedStudios(limit = 6): Promise<Studio[]> {
  if (isMockMode()) return mockGetFeaturedStudios(limit)

  const body = await apiFetch<unknown>(`/studios/featured${queryString({ limit })}`)
  return unwrapList(body, mapStudio).slice(0, limit)
}

export async function getStudioById(id: string): Promise<Studio | null> {
  if (isMockMode()) return mockGetStudioById(id)

  try {
    const body = await apiFetch<unknown>(`/studios/${encodeURIComponent(id)}`)
    const studio = unwrapObject(body, mapStudio)
    return studio.id ? studio : null
  } catch (error) {
    if (isApiError(error) && error.status === 404) return null
    throw error
  }
}

export async function getStudiosByHost(hostId: string): Promise<Studio[]> {
  if (isMockMode()) return mockGetStudiosByHost(hostId)

  const body = await apiFetch<unknown>("/studios/mine")
  return unwrapList(body, mapStudio)
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  if (isMockMode()) return mockGetCategoryCounts()

  const body = await apiFetch<unknown>("/studios/categories")
  const counts: Record<string, number> = {}

  if (Array.isArray(body)) {
    for (const entry of body) {
      if (!entry || typeof entry !== "object") continue
      const item = entry as Record<string, unknown>
      const slug = normalizeCategory(item.slug ?? item.category ?? item._id)
      const count = Number(item.count ?? item.total ?? 0)
      counts[slug] = (counts[slug] ?? 0) + (Number.isFinite(count) ? count : 0)
    }
    return counts
  }

  const record = (body ?? {}) as Record<string, unknown>
  const source = (record.counts ?? record.categories ?? record) as Record<
    string,
    unknown
  >
  for (const [key, value] of Object.entries(source)) {
    if (typeof value !== "number") continue
    counts[normalizeCategory(key)] = value
  }
  return counts
}

export async function getStudioCities(): Promise<string[]> {
  if (isMockMode()) return mockGetStudioCities()

  const body = await apiFetch<unknown>("/studios/cities")
  const list = Array.isArray(body)
    ? body
    : Array.isArray((body as { cities?: unknown })?.cities)
      ? ((body as { cities: unknown[] }).cities)
      : []

  return list
    .map((item) =>
      typeof item === "string"
        ? item
        : typeof (item as { name?: unknown })?.name === "string"
          ? (item as { name: string }).name
          : null
    )
    .filter((item): item is string => Boolean(item))
}

export async function searchStudios(
  filters: StudioFilters
): Promise<StudioSearchResult> {
  if (isMockMode()) return mockSearchStudios(filters)

  const body = await apiFetch<unknown>(
    `/studios${queryString({
      q: filters.q,
      category: filters.category,
      city: filters.city,
      maxPrice: filters.maxPrice,
      sort: filters.sort,
      page: filters.page,
    })}`
  )

  const { items, total } = unwrapCollection(body, mapStudio)
  const record = (body ?? {}) as Record<string, unknown>
  const page = Number(record.page) || filters.page || 1
  const pages =
    Number(record.pages) ||
    Number(record.totalPages) ||
    Math.max(1, Math.ceil(total / PAGE_SIZE))

  return { items, total, page, pages }
}

export async function getRelatedStudios(
  studio: Studio,
  limit = 3
): Promise<Studio[]> {
  if (isMockMode()) return mockGetRelatedStudios(studio, limit)

  const result = await searchStudios({
    category: studio.category,
    page: 1,
  })
  return result.items
    .filter((candidate) => candidate.id !== studio.id)
    .slice(0, limit)
}

export async function getReviewsForStudio(studioId: string) {
  if (isMockMode()) return mockGetReviewsForStudio(studioId)

  const body = await apiFetch<unknown>(
    `/studios/${encodeURIComponent(studioId)}/reviews`
  )
  return unwrapList(body, mapReview)
}

export async function getBookedRanges(studioId: string): Promise<BookedRange[]> {
  if (isMockMode()) return mockGetBookedRanges(studioId)

  const body = await apiFetch<unknown>(
    `/studios/${encodeURIComponent(studioId)}/availability`
  )
  const list = Array.isArray(body)
    ? body
    : ((body as { ranges?: unknown[]; availability?: unknown[] })?.ranges ??
      (body as { availability?: unknown[] })?.availability ??
      [])

  return list
    .map((entry) => {
      const item = (entry ?? {}) as Record<string, unknown>
      const date = typeof item.date === "string" ? item.date : ""
      return {
        date: date.includes("T") ? date.slice(0, 10) : date,
        startTime:
          typeof item.startTime === "string" ? item.startTime : "08:00",
        hours: Number(item.hours) || 1,
      }
    })
    .filter((range) => Boolean(range.date))
}

export async function createStudio(
  input: CreateStudioInput
): Promise<Studio> {
  if (isMockMode()) return mockCreateStudio(input)

  const body = await apiFetch<unknown>("/studios", {
    method: "POST",
    body: JSON.stringify(input),
  })
  return unwrapObject(body, mapStudio)
}

export async function updateStudio(
  studioId: string,
  hostId: string,
  patch: Partial<CreateStudioInput>
): Promise<Studio | null> {
  if (isMockMode()) {
    return mockUpdateStudio(studioId, hostId, patch)
  }

  const body = await apiFetch<unknown>(
    `/studios/${encodeURIComponent(studioId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(patch),
    }
  )
  return unwrapObject(body, mapStudio)
}

export async function removeStudio(
  studioId: string,
  hostId: string
): Promise<boolean> {
  if (isMockMode()) return mockRemoveStudio(studioId, hostId)

  try {
    await apiRequest(`/studios/${encodeURIComponent(studioId)}`, {
      method: "DELETE",
    })
    return true
  } catch (error) {
    if (isApiError(error) && error.status === 404) return false
    throw error
  }
}
