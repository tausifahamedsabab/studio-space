import Link from "next/link"
import { Aperture } from "lucide-react"
import { cn } from "cn"

export function Logo({
  className,
  invert = false,
  compact = false,
}: {
  className?: string
  invert?: boolean
  compact?: boolean
}) {
  return (
    <Link
      href="/"
      aria-label="StudioSpace home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span
        className={cn(
          "grid size-9 place-items-center rounded-xl transition-transform duration-300 group-hover:-rotate-12",
          invert
            ? "bg-amber-300/15 text-amber-300 ring-1 ring-amber-200/25"
            : "bg-primary text-primary-foreground shadow-sm"
        )}
      >
        <Aperture className="size-5" strokeWidth={1.9} />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "text-[17px] font-semibold tracking-tight",
              invert ? "text-white" : "text-foreground"
            )}
          >
            Studio
            <span className={invert ? "text-amber-300" : "text-amber-600"}>
              Space
            </span>
          </span>
          <span
            className={cn(
              "mt-1 text-[9px] font-medium tracking-[0.22em] uppercase",
              invert ? "text-white/45" : "text-muted-foreground"
            )}
          >
            Create. Book. Produce.
          </span>
        </span>
      )}
    </Link>
  )
}
