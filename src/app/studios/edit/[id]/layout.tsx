import { DashboardPageLayout } from "@/components/dashboard/dashboard-page-layout"

export default function EditStudioLayout({
  children,
}: LayoutProps<"/studios/edit/[id]">) {
  return <DashboardPageLayout>{children}</DashboardPageLayout>
}
