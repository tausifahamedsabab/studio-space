"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  CATEGORY_BY_SLUG,
  MAX_PRICE_OPTIONS,
  STUDIO_CATEGORIES,
} from "@/lib/constants"
import {
  countActiveFilters,
  studioHref,
} from "@/lib/studio-query"
import { CATEGORY_SLUGS } from "@/lib/types"
import type { StudioFilters } from "@/lib/types"

type FilterProps = {
  filters: StudioFilters
  cities: string[]
  counts: Record<string, number>
}

export function StudioFilters({ filters, cities, counts }: FilterProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const activeCount = countActiveFilters(filters)

  const apply = (overrides: Partial<StudioFilters>) => {
    startTransition(() => {
      router.push(studioHref(filters, { ...overrides, page: 1 }))
    })
  }

  const fields = (prefix: string) => (
    <FilterFields
      prefix={prefix}
      filters={filters}
      cities={cities}
      counts={counts}
      pending={pending}
      activeCount={activeCount}
      apply={apply}
    />
  )

  return (
    <>
      <div className="lg:hidden">
        <details className="group overflow-hidden rounded-2xl border border-border/80 bg-card">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <SlidersHorizontal className="size-4 text-amber-600" />
              Filters
              {activeCount > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-amber-500 text-[10px] font-bold text-[#17120a]">
                  {activeCount}
                </span>
              )}
            </span>
            <span className="text-xs text-muted-foreground group-open:hidden">
              Show
            </span>
            <span className="hidden text-xs text-muted-foreground group-open:inline">
              Hide
            </span>
          </summary>
          <div className="border-t border-border/70 p-4">{fields("mobile")}</div>
        </details>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-border/80 bg-card p-5">
          {fields("desktop")}
        </div>
      </aside>
    </>
  )
}

function FilterFields({
  prefix,
  filters,
  cities,
  counts,
  pending,
  activeCount,
  apply,
}: FilterProps & {
  prefix: string
  pending: boolean
  activeCount: number
  apply: (overrides: Partial<StudioFilters>) => void
}) {
  const searchId = `${prefix}-studio-search`
  const cityId = `${prefix}-studio-city`
  const priceId = `${prefix}-studio-price`
  const activeCategory =
    filters.category &&
    (CATEGORY_SLUGS as readonly string[]).includes(filters.category)
      ? CATEGORY_BY_SLUG[
          filters.category as (typeof CATEGORY_SLUGS)[number]
        ]
      : undefined

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Refine your search</h2>
        {activeCount > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="text-muted-foreground"
            onClick={() =>
              apply({
                q: undefined,
                category: undefined,
                city: undefined,
                maxPrice: undefined,
              })
            }
          >
            <X className="size-3" />
            Clear
          </Button>
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          apply({ q: String(data.get("q") ?? "") })
        }}
        className="flex items-center gap-2"
      >
        <label htmlFor={searchId} className="sr-only">
          Search studios
        </label>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={searchId}
            name="q"
            key={filters.q ?? "all"}
            defaultValue={filters.q ?? ""}
            placeholder="Studio, area, amenity"
            className="h-9 rounded-lg pl-8"
          />
        </div>
        <Button type="submit" size="icon" className="size-9" aria-label="Search">
          <Search className="size-4" />
        </Button>
      </form>

      <div>
        <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          Space type
        </p>
        <div className="mt-2 flex flex-col gap-1">
          <CategoryButton
            active={!filters.category}
            label="All spaces"
            count={Object.values(counts).reduce((sum, value) => sum + value, 0)}
            onClick={() => apply({ category: undefined })}
          />
          {STUDIO_CATEGORIES.map((category) => (
            <CategoryButton
              key={category.slug}
              active={filters.category === category.slug}
              label={category.name}
              count={counts[category.slug] ?? 0}
              accent={category.accent}
              onClick={() => apply({ category: category.slug })}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={cityId}
          className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase"
        >
          City
        </label>
        <select
          id={cityId}
          value={filters.city ?? ""}
          disabled={pending}
          onChange={(event) => apply({ city: event.target.value || undefined })}
          className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
        >
          <option value="">Anywhere</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={priceId}
          className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase"
        >
          Hourly rate
        </label>
        <select
          id={priceId}
          value={filters.maxPrice ? String(filters.maxPrice) : ""}
          disabled={pending}
          onChange={(event) =>
            apply({
              maxPrice: event.target.value
                ? Number(event.target.value)
                : undefined,
            })
          }
          className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
        >
          {MAX_PRICE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {activeCategory && (
        <div className="rounded-xl bg-secondary/70 p-3">
          <p className="text-xs font-semibold text-foreground">
            {activeCategory.name}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {activeCategory.description}
          </p>
        </div>
      )}
    </div>
  )
}

function CategoryButton({
  active,
  label,
  count,
  accent,
  onClick,
}: {
  active: boolean
  label: string
  count: number
  accent?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
        active
          ? "bg-amber-50 font-semibold text-amber-900 ring-1 ring-amber-300/60"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span
          className="size-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: accent ?? "#a8a29e" }}
        />
        <span className="truncate">{label}</span>
      </span>
      <span
        className={cn(
          "text-xs tabular-nums",
          active ? "text-amber-700" : "text-muted-foreground/70"
        )}
      >
        {count}
      </span>
    </button>
  )
}
