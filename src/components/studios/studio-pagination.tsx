import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import { filtersToQuery } from "@/lib/studio-query"
import type { StudioFilters } from "@/lib/types"

function pageNumbers(page: number, pages: number) {
  const values = new Set<number>([1, pages, page - 1, page, page + 1])
  return [...values]
    .filter((value) => value >= 1 && value <= pages)
    .sort((a, b) => a - b)
}

export function StudioPagination({
  filters,
  page,
  pages,
}: {
  filters: StudioFilters
  page: number
  pages: number
}) {
  if (pages <= 1) return null

  const hrefFor = (target: number) => ({
    pathname: "/studios" as const,
    query: filtersToQuery(filters, { page: target }),
  })

  const numbers = pageNumbers(page, pages)

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-center gap-1"
    >
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          aria-label="Previous page"
          className={cn(
            buttonVariants({ variant: "ghost", size: "default" }),
            "gap-1 pl-1.5"
          )}
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            buttonVariants({ variant: "ghost", size: "default" }),
            "gap-1 pl-1.5 opacity-40"
          )}
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Previous</span>
        </span>
      )}

      {numbers.map((value, index) => {
        const previous = numbers[index - 1]
        const gap = previous !== undefined && value - previous > 1
        return (
          <span key={value} className="flex items-center gap-1">
            {gap && (
              <span className="px-1 text-sm text-muted-foreground" aria-hidden>
                …
              </span>
            )}
            <Link
              href={hrefFor(value)}
              aria-current={value === page ? "page" : undefined}
              aria-label={`Page ${value}`}
              className={cn(
                buttonVariants({
                  variant: value === page ? "outline" : "ghost",
                  size: "icon",
                }),
                "tabular-nums",
                value === page && "bg-card font-semibold"
              )}
            >
              {value}
            </Link>
          </span>
        )
      })}

      {page < pages ? (
        <Link
          href={hrefFor(page + 1)}
          aria-label="Next page"
          className={cn(
            buttonVariants({ variant: "ghost", size: "default" }),
            "gap-1 pr-1.5"
          )}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            buttonVariants({ variant: "ghost", size: "default" }),
            "gap-1 pr-1.5 opacity-40"
          )}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  )
}
