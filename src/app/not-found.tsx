import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Compass, Home, Search } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import { STUDIO_CATEGORIES } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Page not found",
}

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 size-[32rem] -translate-x-1/2 rounded-full bg-amber-300/20 blur-3xl"
      />

      <div className="shell relative flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-amber-50 px-3 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-amber-800 uppercase">
          <Compass className="size-3.5" />
          Error 404
        </span>

        <p className="mt-6 text-7xl font-semibold tracking-tighter text-border tabular-nums select-none sm:text-8xl">
          404
        </p>

        <h1 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          This room is not on the map.
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
          The page you are looking for may have moved, been renamed, or never
          existed. The studios, however, are very much still here.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-10 gap-2 rounded-xl px-5"
            )}
          >
            <Home className="size-4" />
            Back home
          </Link>
          <Link
            href="/studios"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-10 gap-2 rounded-xl px-5"
            )}
          >
            <Search className="size-4" />
            Explore studios
          </Link>
        </div>

        <div className="mt-14 w-full max-w-3xl border-t border-border/70 pt-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            Try one of these
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {STUDIO_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={{
                  pathname: "/studios",
                  query: { category: category.slug },
                }}
                className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-2 text-xs font-medium transition-colors hover:border-amber-300/70 hover:bg-amber-50/60"
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: category.accent }}
                />
                {category.name}
                <ArrowRight className="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
