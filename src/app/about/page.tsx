import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Building2,
  Compass,
  HeartHandshake,
  Headphones,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import { cn } from "cn"

import { CtaBand } from "@/components/home/cta-band"
import { SectionHeading } from "@/components/section-heading"
import { buttonVariants } from "@/components/ui/button"
import { STUDIO_CATEGORIES } from "@/lib/constants"

export const metadata: Metadata = {
  title: "About us",
  description:
    "StudioSpace is a peer-to-peer marketplace connecting creative people with remarkable rooms — and the hosts who keep them running.",
}

const VALUES = [
  {
    icon: Compass,
    title: "Access over ownership",
    description:
      "Most creative people do not need another lease. They need the right room for four hours on a Tuesday. We build for that.",
  },
  {
    icon: ShieldCheck,
    title: "Trust by default",
    description:
      "Verified hosts, reviewed listings, protected bookings, and a real support team. Confidence should not be an add-on.",
  },
  {
    icon: Wallet,
    title: "Transparent economics",
    description:
      "Hosts keep 100% of their hourly rate. Creators pay one clearly labeled service fee. No dark patterns, no surprise line items.",
  },
  {
    icon: HeartHandshake,
    title: "Built with creatives",
    description:
      "Photographers, producers, podcasters, and makers shape every part of the product — from the filters to the booking flow.",
  },
] as const

const STATS = [
  { value: "12+", label: "Curated spaces" },
  { value: "5", label: "Space categories" },
  { value: "4.8", label: "Average rating" },
  { value: "100%", label: "Host rate kept" },
] as const

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border/70 bg-secondary/40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-0 size-96 rounded-full bg-amber-300/20 blur-3xl"
        />
        <div className="shell relative py-16 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-amber-50 px-3 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-amber-800 uppercase">
                <Sparkles className="size-3.5" />
                About StudioSpace
              </span>

              <h1 className="mt-5 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Creative work deserves better rooms — and fewer obstacles.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
                StudioSpace is a peer-to-peer marketplace connecting creative
                people with remarkable rooms. We started with a simple
                frustration: finding a space should not take a week of DMs,
                deposits, and dead links.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/studios"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 gap-2 rounded-xl px-6 text-sm font-semibold"
                  )}
                >
                  Explore studios
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/dashboard/studios/new"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-11 gap-2 rounded-xl px-6 text-sm font-semibold"
                  )}
                >
                  <Building2 className="size-4" />
                  List your space
                </Link>
              </div>

              <dl className="mt-10 grid max-w-lg grid-cols-2 gap-x-8 gap-y-5 border-t border-border/70 pt-6 sm:grid-cols-4">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <dd className="text-2xl font-semibold tracking-tight">
                      {stat.value}
                    </dd>
                    <dt className="mt-0.5 text-[11px] text-muted-foreground">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-foreground/10">
              <Image
                src="/background.jpg"
                alt="A creative studio space"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/15 bg-black/35 p-4 text-white backdrop-blur-md sm:inset-x-5 sm:bottom-5">
                <p className="text-[10px] font-medium tracking-[0.16em] text-white/55 uppercase">
                  Our belief
                </p>
                <p className="mt-1 text-sm leading-relaxed text-white/90">
                  The best rooms are already out there. They just need a better
                  way to be found.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Our mission"
            title="Make great space accessible, hour by hour"
            description="A marketplace only works when both sides feel safe, seen, and fairly paid. That principle shapes every decision we make."
          />

          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              StudioSpace began in a borrowed photo studio in Los Angeles. A
              small crew needed four hours of daylight and a cyc wall; the host
              had a beautiful room sitting empty between shoots. The only thing
              missing was a way to connect the two without a phone tree and a
              cash deposit.
            </p>
            <p>
              Today the marketplace spans photo studios, sound stages, podcast
              rooms, music suites, and art workshops across the country. The
              details differ, but the promise is the same: see the real space,
              see the real price, pick your hours, and show up ready to work.
            </p>
            <p>
              For hosts, that means turning idle hours into income without
              giving up control of the room. For creators, it means access to
              spaces that would otherwise be out of reach — and a support team
              that answers when plans change.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-[#0c0b09] py-20 text-white lg:py-24">
        <div className="shell">
          <SectionHeading
            eyebrow="What we stand for"
            title="Four principles behind every booking"
            description="They are not slogans. They are the rules we use when a product decision could go either way."
            invert
            align="center"
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <article
                key={value.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-colors hover:border-amber-300/30 hover:bg-white/[0.07]"
              >
                <span className="grid size-10 place-items-center rounded-xl border border-amber-300/20 bg-amber-400/10 text-amber-300">
                  <value.icon className="size-5" />
                </span>
                <h2 className="mt-4 text-base font-semibold text-white">
                  {value.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-20 lg:py-24">
        <SectionHeading
          eyebrow="The marketplace"
          title="One platform, five kinds of room"
          description="Every category has its own rhythm, gear, and house rules. The booking experience stays consistent."
          action={{ href: "/studios", label: "Browse every space" }}
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STUDIO_CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={{
                pathname: "/studios",
                query: { category: category.slug },
              }}
              className="group relative flex min-h-48 flex-col justify-end overflow-hidden rounded-2xl p-4 text-white ring-1 ring-foreground/10"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, 240px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5" />
              <div className="relative">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: category.accent }}
                />
                <h3 className="mt-2 text-sm font-semibold">{category.name}</h3>
                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-white/65">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border/70 bg-secondary/40 py-20 lg:py-24">
        <div className="shell grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8">
            <span className="grid size-11 place-items-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-200/70">
              <Headphones className="size-5" />
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              Real people, seven days a week
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Our support team is made up of producers, photographers, and
              hosts. They know what it means when a light breaks or a location
              falls through. Average first response is under two hours during
              support hours.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/how-it-works"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-10 rounded-xl px-5"
                )}
              >
                Read how it works
              </Link>
              <Link
                href="/studios"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-10 rounded-xl px-5"
                )}
              >
                Find a space
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <FactCard
              icon={Users}
              title="For creators"
              description="Book by the hour, keep your budget predictable, and get help if plans shift."
            />
            <FactCard
              icon={Building2}
              title="For hosts"
              description="List free, set your own terms, and keep every dollar of your hourly rate."
            />
            <FactCard
              icon={MapPin}
              title="Where we are"
              description="Los Angeles, New York, Austin, Chicago, Atlanta, Portland, Miami, and Seattle."
            />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

function FactCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-card p-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-foreground/70">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}
