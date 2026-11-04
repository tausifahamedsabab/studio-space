"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarCheck,
  LayoutDashboard,
  Plus,
  Store,
} from "lucide-react"
import { cn } from "cn"

const LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/my-listings", label: "My listings", icon: Store },
  { href: "/add-studio", label: "Add studio", icon: Plus },
  { href: "/my-bookings", label: "My bookings", icon: CalendarCheck },
] as const

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard"
  if (href === "/my-listings") {
    return (
      pathname === "/my-listings" ||
      pathname.startsWith("/studios/edit/") ||
      pathname.startsWith("/dashboard/studios")
    )
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Dashboard"
      className="rail-scroll -mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
    >
      {LINKS.map((link) => {
        const active = isActive(pathname, link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <link.icon className="size-4" />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
