"use client"

import { Suspense, useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Logo } from "./logo"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
] as const

export function HeaderShell({ auth }: { auth: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Logo />

        <Suspense fallback={<DesktopNavFallback />}>
          <DesktopNav />
        </Suspense>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />
          <div className="hidden md:block">{auth}</div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="w-[86%] max-w-sm gap-0 p-0">
              <SheetHeader className="border-b">
                <SheetTitle className="sr-only">StudioSpace menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Navigate StudioSpace
                </SheetDescription>
                <Logo />
              </SheetHeader>
              <Suspense
                fallback={<MobileNavFallback onNavigate={() => setOpen(false)} />}
              >
                <MobileNav onNavigate={() => setOpen(false)} />
              </Suspense>
              <div className="mt-auto flex items-center gap-3 border-t p-4">
                <ThemeToggle />
                {auth}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function DesktopNav() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
      {NAV_LINKS.map((link) => {
        const active = isActive(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {link.label}
            <span
              className={cn(
                "absolute -bottom-0.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-amber-500 transition-all duration-300",
                active ? "w-5 opacity-100" : "w-0 opacity-0"
              )}
            />
          </Link>
        )
      })}
    </nav>
  )
}

function DesktopNavFallback() {
  return (
    <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
      {NAV_LINKS.map((link) => (
        <span
          key={link.href}
          className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground"
        >
          {link.label}
        </span>
      ))}
    </nav>
  )
}

function MobileNav({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <nav className="flex flex-col p-3" aria-label="Mobile">
      {NAV_LINKS.map((link) => {
        const active = isActive(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-colors",
              active
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {link.label}
            {active && <span className="size-1.5 rounded-full bg-amber-500" />}
          </Link>
        )
      })}
    </nav>
  )
}

function MobileNavFallback({ onNavigate }: { onNavigate: () => void }) {
  return (
    <nav className="flex flex-col p-3" aria-label="Mobile">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
