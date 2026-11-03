import { Star } from "lucide-react"
import { cn } from "cn"

export function Rating({
  value,
  count,
  className,
  showCount = true,
}: {
  value: number
  count?: number
  className?: string
  showCount?: boolean
}) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm", className)}>
      <Star className="size-3.5 fill-amber-400 text-amber-400" />
      <span className="font-semibold text-foreground">
        {value > 0 ? value.toFixed(1) : "New"}
      </span>
      {showCount && typeof count === "number" && count > 0 && (
        <span className="text-muted-foreground">({count})</span>
      )}
    </span>
  )
}
