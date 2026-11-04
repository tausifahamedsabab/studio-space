import { DashboardPageLayout } from "@/components/dashboard/dashboard-page-layout"

export default function MyListingsLayout({
  children,
}: LayoutProps<"/my-listings">) {
  return <DashboardPageLayout>{children}</DashboardPageLayout>
}
