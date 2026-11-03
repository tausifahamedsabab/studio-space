import Link from "next/link"
import { ArrowUpRight, Mail } from "lucide-react"

import {
  InstagramLogo,
  LinkedInLogo,
  XLogo,
  YouTubeLogo,
} from "@/components/brand-icons"
import { Button } from "@/components/ui/button"
import { STUDIO_CATEGORIES } from "@/lib/constants"
import { Logo } from "./logo"
import { NewsletterForm } from "./newsletter-form"

async function getCopyrightYear() {
  "use cache"
  return new Date().getFullYear()
}

const SOCIALS = [
  { label: "X", href: "https://x.com", Icon: XLogo },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramLogo },
  { label: "YouTube", href: "https://youtube.com", Icon: YouTubeLogo },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedInLogo },
]

export async function SiteFooter() {
  const year = await getCopyrightYear()

  return (
    <footer className="bg-[#0c0b09] text-white/60">
      <div className="shell py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.4fr]">
          <div>
            <Logo invert />
            <p className="mt-5 max-w-xs text-sm leading-relaxed">
              The peer-to-peer marketplace where creators find remarkable
              spaces, book them by the hour, and get straight to the work.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`StudioSpace on ${label}`}
                  className="grid size-9 place-items-center rounded-full border border-white/10 text-white/55 transition-colors hover:border-amber-300/40 hover:bg-white/5 hover:text-amber-300"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.18em] text-white/85 uppercase">
              Explore
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                { href: "/studios", label: "Browse studios" },
                { href: "/how-it-works", label: "How it works" },
                { href: "/about", label: "About us" },
                { href: "/register", label: "Become a host" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.18em] text-white/85 uppercase">
              Categories
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {STUDIO_CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={{
                      pathname: "/studios",
                      query: { category: category.slug },
                    }}
                    className="group inline-flex items-center gap-1 transition-colors hover:text-white"
                  >
                    {category.name}
                    <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.18em] text-white/85 uppercase">
              The call sheet
            </h3>
            <p className="mt-4 text-sm leading-relaxed">
              New spaces, host tips, and production notes — once a month.
            </p>
            <NewsletterForm />
            <p className="mt-3 flex items-center gap-1.5 text-xs text-white/35">
              <Mail className="size-3.5" />
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/35 md:flex-row md:items-center md:justify-between">
          <p>© {year} StudioSpace, Inc. All rights reserved.</p>
          <p className="max-w-xl md:text-center">
            By using StudioSpace you agree to our Terms of Service and Privacy
            Policy. Every booking is covered by the StudioSpace host guarantee.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="transition-colors hover:text-white">
              Terms
            </Link>
            <Link href="/about" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Button
              variant="ghost"
              size="xs"
              className="text-white/35 hover:bg-white/5 hover:text-white"
              nativeButton={false}
              render={<Link href="/register" />}
            >
              List your space
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
