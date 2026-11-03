"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"

import { STUDIO_SORT_OPTIONS } from "@/lib/constants"
import { studioHref } from "@/lib/studio-query"
import type { StudioFilters } from "@/lib/types"

export function StudioSort({ filters }: { filters: StudioFilters }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden text-muted-foreground sm:inline">Sort by</span>
      <select
        value={filters.sort ?? "recommended"}
        disabled={pending}
        onChange={(event) =>
          startTransition(() => {
            router.push(
              studioHref(filters, {
                sort: event.target.value as StudioFilters["sort"],
                page: 1,
              })
            )
          })
        }
        className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm font-medium outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
      >
        {STUDIO_SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
