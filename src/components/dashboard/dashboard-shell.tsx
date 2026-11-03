import Link from "next/link"
import { ArrowRight, Plus, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { requireUser } from "@/lib/auth"
import { getInitials } from "@/lib/format"
import { DashboardNav } from "./dashboard-nav"

export async function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireUser()

  return (
    <div className="shell py-8 lg:py-10">
      <div className="grid items-start gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="min-w-0">
          <div className="flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border/80 bg-card p-4">
              <div className="flex items-center gap-3">
                <Avatar size="lg">
                  {user.avatar && (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  )}
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-2 text-[11px] font-medium text-amber-800 ring-1 ring-amber-200/70">
                <Sparkles className="size-3.5" />
                StudioSpace member
              </div>
            </div>

            <DashboardNav />

            <div className="hidden rounded-2xl border border-dashed border-border p-4 lg:block">
              <p className="text-sm font-semibold">Have another space?</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                List it in a few minutes and set your own hours and rate.
              </p>
              <Button
                size="sm"
                className="mt-3 w-full rounded-lg"
                nativeButton={false}
                render={<Link href="/dashboard/studios/new" />}
              >
                <Plus className="size-3.5" />
                Add a studio
              </Button>
            </div>

            <Link
              href="/studios"
              className="hidden items-center gap-1.5 px-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
            >
              Browse the marketplace
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}

export function DashboardShellSkeleton() {
  return (
    <div className="shell py-8 lg:py-10">
      <div className="grid items-start gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <div className="h-28 animate-pulse rounded-2xl bg-muted" />
          <div className="h-11 animate-pulse rounded-xl bg-muted" />
          <div className="h-11 animate-pulse rounded-xl bg-muted" />
          <div className="h-11 animate-pulse rounded-xl bg-muted" />
        </div>
        <div className="space-y-4">
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded bg-muted" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
          <div className="mt-6 h-64 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    </div>
  )
}
