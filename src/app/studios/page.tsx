import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { SearchX, SlidersHorizontal, Sparkles, Star } from "lucide-react"

import { StudioCard, StudioCardSkeleton } from "@/components/studios/studio-card"
import { StudioFilters } from "@/components/studios/studio-filters"
import { StudioPagination } from "@/components/studios/studio-pagination"
import { StudioSort } from "@/components/studios/studio-sort"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { getCategoryCounts, getStudioCities, searchStudios } from "@/lib/data"
import { parseStudioFilters, type RawSearchParams } from "@/lib/studio-query"

export const metadata: Metadata = {
  title: "Explore studios",
  description:
    "Browse peer-to-peer photo studios, sound stages, podcast rooms, music suites, and art workshops by the hour.",
}

export default function StudiosPage({ searchParams }: PageProps<"/studios">) {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border/70 bg-secondary/40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-amber-300/20 blur-3xl"
        />
        <div className="shell relative py-12 lg:py-16">
          <p className="text-xs font-semibold tracking-[0.18em] text-amber-600 uppercase">
            Explore studios
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Find the room that fits the work.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
            Real spaces, live availability, and transparent hourly rates — from
            daylight lofts and blackbox stages to treated podcast rooms and
            working ceramics studios.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-amber-600" />
              12 curated spaces
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              4.8 average rating
            </span>
            <span className="inline-flex items-center gap-1.5">
              <SlidersHorizontal className="size-3.5 text-amber-600" />
              Filter by city, type, and rate
            </span>
          </div>
        </div>
      </section>

      <section className="shell py-10 lg:py-12">
        <Suspense fallback={<StudiosResultsSkeleton />}>
          <StudiosResults searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  )
}

async function StudiosResults({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>
}) {
  const params = await searchParams
  const filters = parseStudioFilters(params)

  const [result, cities, counts] = await Promise.all([
    searchStudios(filters),
    getStudioCities(),
    getCategoryCounts(),
  ])

  const start = (result.page - 1) * 9 + 1
  const end = Math.min(result.page * 9, result.total)

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
      <StudioFilters filters={filters} cities={cities} counts={counts} />

      <div className="min-w-0">
        <div className="flex flex-col gap-3 border-b border-border/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {result.total === 0 ? (
              "No spaces found"
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-foreground tabular-nums">
                  {start}–{end}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground tabular-nums">
                  {result.total}
                </span>{" "}
                {result.total === 1 ? "space" : "spaces"}
                {filters.q && (
                  <>
                    {" "}
                    for “<span className="text-foreground">{filters.q}</span>”
                  </>
                )}
              </>
            )}
          </p>
          <StudioSort filters={filters} />
        </div>

        {result.items.length === 0 ? (
          <div className="py-16">
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <SearchX />
                </EmptyMedia>
                <EmptyTitle>No studios match those filters</EmptyTitle>
                <EmptyDescription>
                  Try a different category or city, raise the hourly cap, or
                  clear the filters to see every space.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  variant="outline"
                  size="lg"
                  nativeButton={false}
                  render={<Link href="/studios" />}
                >
                  Clear all filters
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {result.items.map((studio) => (
                <StudioCard key={studio.id} studio={studio} />
              ))}
            </div>
            <StudioPagination
              filters={filters}
              page={result.page}
              pages={result.pages}
            />
          </>
        )}
      </div>
    </div>
  )
}

function StudiosResultsSkeleton() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
      <div className="hidden lg:block">
        <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-5">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="h-9 w-full animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-8 w-full animate-pulse rounded-lg bg-muted" />
          ))}
          <div className="h-9 w-full animate-pulse rounded-lg bg-muted" />
          <div className="h-9 w-full animate-pulse rounded-lg bg-muted" />
        </div>
      </div>

      <div className="min-w-0">
        <div className="h-5 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <StudioCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
