import { Suspense } from "react"

import {
  DashboardShell,
  DashboardShellSkeleton,
} from "@/components/dashboard/dashboard-shell"

/**
 * Shared shell for the canonical private routes that live outside /dashboard.
 * The /dashboard layout keeps using DashboardShell directly.
 */
export function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<DashboardShellSkeleton />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  )
}
