import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "cn"

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
  invert = false,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  action?: { href: string; label: string }
  align?: "left" | "center"
  className?: string
  invert?: boolean
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p
            className={cn(
              "text-xs font-semibold tracking-[0.18em] uppercase",
              invert ? "text-amber-300" : "text-amber-600"
            )}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl",
            invert ? "text-white" : "text-foreground"
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-3 text-base leading-relaxed text-pretty",
              invert ? "text-white/60" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className={cn(
            "group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold transition-colors",
            invert
              ? "text-amber-300 hover:text-amber-200"
              : "text-foreground hover:text-amber-600"
          )}
        >
          {action.label}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
