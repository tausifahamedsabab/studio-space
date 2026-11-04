import { DashboardPageLayout } from "@/components/dashboard/dashboard-page-layout"

export default function AddStudioLayout({
  children,
}: LayoutProps<"/add-studio">) {
  return <DashboardPageLayout>{children}</DashboardPageLayout>
}
