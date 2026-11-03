import { Suspense } from "react"

import {
  DashboardShell,
  DashboardShellSkeleton,
} from "@/components/dashboard/dashboard-shell"

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <Suspense fallback={<DashboardShellSkeleton />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  )
}
