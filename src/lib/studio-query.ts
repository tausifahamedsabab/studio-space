import { STUDIO_SORT_OPTIONS } from "./constants"
import { CATEGORY_SLUGS } from "./types"
import type { StudioFilters } from "./types"

export type RawSearchParams = Record<string, string | string[] | undefined>

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export function parseStudioFilters(params: RawSearchParams): StudioFilters {
  const q = firstValue(params.q)?.trim()
  const category = firstValue(params.category)
  const city = firstValue(params.city)
  const maxPriceRaw = firstValue(params.maxPrice)
  const sortRaw = firstValue(params.sort)
  const pageRaw = firstValue(params.page)

  const maxPrice = maxPriceRaw ? Number(maxPriceRaw) : undefined
  const page = pageRaw ? Number(pageRaw) : 1

  const sort = STUDIO_SORT_OPTIONS.some((option) => option.value === sortRaw)
    ? (sortRaw as StudioFilters["sort"])
    : undefined

  return {
    q: q || undefined,
    category:
      category && CATEGORY_SLUGS.includes(category as (typeof CATEGORY_SLUGS)[number])
        ? category
        : undefined,
    city: city || undefined,
    maxPrice:
      typeof maxPrice === "number" && Number.isFinite(maxPrice) && maxPrice > 0
        ? maxPrice
        : undefined,
    sort,
    page: Number.isInteger(page) && page > 0 ? page : 1,
  }
}

export function filtersToQuery(
  filters: StudioFilters,
  overrides: Partial<StudioFilters> = {}
): Record<string, string> {
  const merged = { ...filters, ...overrides }
  const query: Record<string, string> = {}

  if (merged.q?.trim()) query.q = merged.q.trim()
  if (merged.category) query.category = merged.category
  if (merged.city) query.city = merged.city
  if (typeof merged.maxPrice === "number" && merged.maxPrice > 0) {
    query.maxPrice = String(merged.maxPrice)
  }
  if (merged.sort && merged.sort !== "recommended") query.sort = merged.sort
  if (typeof merged.page === "number" && merged.page > 1) {
    query.page = String(merged.page)
  }

  return query
}

export function studioHref(
  filters: StudioFilters,
  overrides: Partial<StudioFilters> = {}
) {
  const query = filtersToQuery(filters, overrides)
  const search = new URLSearchParams(query).toString()
  return search ? `/studios?${search}` : "/studios"
}

export function countActiveFilters(filters: StudioFilters) {
  return [filters.q, filters.category, filters.city, filters.maxPrice].filter(
    Boolean
  ).length
}
