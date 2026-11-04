import { DashboardPageLayout } from "@/components/dashboard/dashboard-page-layout"

export default function MyBookingsLayout({
  children,
}: LayoutProps<"/my-bookings">) {
  return <DashboardPageLayout>{children}</DashboardPageLayout>
}
