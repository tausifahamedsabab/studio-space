import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarCheck,
  Check,
  CreditCard,
  Headphones,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import { cn } from "cn"

import { CtaBand } from "@/components/home/cta-band"
import { SectionHeading } from "@/components/section-heading"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { buttonVariants } from "@/components/ui/button"
import { calculateTotals, formatCurrency } from "@/lib/format"

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How StudioSpace works for creators and hosts — discovery, live availability, transparent pricing, and real support before, during, and after every booking.",
}

const STEPS = [
  {
    icon: Search,
    title: "Find the space",
    description:
      "Search by city, category, rate, or the kind of light you need. Every listing shows real photos, included gear, capacity, and house rules before you commit.",
    bullets: [
      "Filter by space type, city, and hourly cap",
      "Compare capacity, size, and minimum hours",
      "See verified reviews from real bookings",
    ],
  },
  {
    icon: CalendarCheck,
    title: "Pick your hours",
    description:
      "Choose a date and see live availability down to the hour. Booked windows are blocked automatically, so there is no back-and-forth with the host.",
    bullets: [
      "Live availability across the next 90 days",
      "Hourly start times from 8am to 8pm",
      "Instant book or host approval, clearly marked",
    ],
  },
  {
    icon: CreditCard,
    title: "Book with confidence",
    description:
      "One transparent hourly rate plus a 7% service fee. Your booking is confirmed the moment you check out and protected by the StudioSpace host guarantee.",
    bullets: [
      "No hidden cleaning or platform charges",
      "Free cancellation up to 48 hours before",
      "Protected if a space is not as described",
    ],
  },
  {
    icon: Sparkles,
    title: "Show up and create",
    description:
      "Your host has the room ready and knows you are coming. Load in, get to work, and leave the logistics to us — including support if anything changes.",
    bullets: [
      "Exact address shared after confirmation",
      "Real people on call seven days a week",
      "Rebook in seconds if plans shift",
    ],
  },
] as const

const CREATOR_POINTS = [
  "Browse every space without an account",
  "See live availability before you commit",
  "Pay one clear hourly rate plus a 7% fee",
  "Get help from a real person if plans change",
] as const

const HOST_POINTS = [
  "List your space free — no monthly fee",
  "Set your own rate, hours, and minimum",
  "Keep 100% of what you charge per hour",
  "Turn on instant book to fill gaps faster",
] as const

const FAQS = [
  {
    question: "What exactly is StudioSpace?",
    answer:
      "StudioSpace is a peer-to-peer marketplace for creative space. Photographers, filmmakers, podcasters, musicians, and makers book rooms by the hour directly from the people who run them — photo studios, sound stages, podcast rooms, music suites, and art workshops.",
  },
  {
    question: "How does availability work?",
    answer:
      "Every studio publishes its open hours, and confirmed bookings block those hours automatically. The booking calendar on each listing shows the next 90 days, so the slot you pick is the slot you get. If someone books the same window a moment before you, checkout will ask you to choose another time.",
  },
  {
    question: "What fees does StudioSpace charge?",
    answer:
      "Creators pay the host's hourly rate plus a 7% service fee, shown as a separate line before checkout. There are no cleaning fees or surprise platform charges. Hosts keep 100% of their hourly rate — StudioSpace does not take a cut of the host's side.",
  },
  {
    question: "Can I cancel or change a booking?",
    answer:
      "Yes. You can cancel a confirmed booking from your dashboard and the hours are released back to the host immediately. We recommend cancelling at least 48 hours ahead so the host has time to rebook. To change your time, cancel and book the new window from the studio page.",
  },
  {
    question: "What is the host guarantee?",
    answer:
      "If a space is not as described, is unavailable when you arrive, or the host cancels at the last minute, StudioSpace will help you find a comparable space or refund your booking in full. Every host is identity-checked and every listing is reviewed before it goes live.",
  },
  {
    question: "How do I list my own space?",
    answer:
      "Create a free account, open your dashboard, and choose Add studio. Add photos, a description, amenities, your hourly rate, and your minimum booking. Most listings take about five minutes to publish and go live on the marketplace right away.",
  },
  {
    question: "Who do I contact if something goes wrong?",
    answer:
      "Use the support link in the footer or reply to your booking confirmation. A real member of the StudioSpace team will get back to you, and our average first response time is under two hours during support hours, seven days a week.",
  },
  {
    question: "Do I need insurance or special equipment?",
    answer:
      "Requirements vary by space. Each listing spells out house rules, load-in details, and what gear is included. If you are bringing a large crew, rigging, or specialty equipment, mention it when you book so the host can prepare.",
  },
] as const

export default function HowItWorksPage() {
  const sample = calculateTotals(120, 3)

  return (
    <>
      <section className="relative overflow-hidden bg-[#0c0b09] text-white">
        <Image
          src="/background.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0b09] via-[#0c0b09]/85 to-[#0c0b09]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09] via-transparent to-transparent" />

        <div className="shell relative py-20 lg:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-[11px] font-medium tracking-[0.16em] text-white/75 uppercase backdrop-blur-md">
            <Sparkles className="size-3.5 text-amber-300" />
            How it works
          </span>

          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Book a creative space without the
            <span className="text-amber-300"> back-and-forth.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-pretty text-white/65 sm:text-base">
            StudioSpace puts discovery, availability, payment, and support in
            one place. Here is exactly what happens from the first search to the
            last load-out.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/studios"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 gap-2 rounded-xl px-6 text-sm font-semibold shadow-lg shadow-amber-500/20"
              )}
            >
              Explore studios
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/add-studio"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/10"
            >
              <Building2 className="size-4" />
              List your space
            </Link>
          </div>

          <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-6">
            <div>
              <dt className="text-[10px] font-medium tracking-[0.16em] text-white/40 uppercase">
                Curated spaces
              </dt>
              <dd className="mt-1 text-2xl font-semibold">12+</dd>
            </div>
            <div>
              <dt className="text-[10px] font-medium tracking-[0.16em] text-white/40 uppercase">
                Avg. response
              </dt>
              <dd className="mt-1 text-2xl font-semibold">2 hrs</dd>
            </div>
            <div>
              <dt className="text-[10px] font-medium tracking-[0.16em] text-white/40 uppercase">
                Service fee
              </dt>
              <dd className="mt-1 text-2xl font-semibold">7%</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="shell py-20 lg:py-24">
        <SectionHeading
          eyebrow="The flow"
          title="Four steps from idea to call sheet"
          description="No emails, no deposits over DMs, no guessing whether the room is free. Every step is built into the same booking."
          align="center"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {STEPS.map((step, index) => (
            <article
              key={step.title}
              className="group relative flex flex-col rounded-2xl border border-border/80 bg-card p-6 transition-colors hover:border-amber-300/70"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-200/70">
                  <step.icon className="size-5" />
                </span>
                <span className="text-3xl font-semibold tracking-tighter text-border tabular-nums select-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h2 className="mt-5 text-xl font-semibold tracking-tight">
                {step.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
              <ul className="mt-5 space-y-2">
                {step.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2 text-xs leading-relaxed text-foreground/75"
                  >
                    <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70">
                      <Check className="size-2.5" />
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border/70 bg-secondary/40 py-20 lg:py-24">
        <div className="shell grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-amber-800 uppercase ring-1 ring-amber-200/70">
              <Search className="size-3.5" />
              For creators
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              Find the room, lock the hours, get to work.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Everything you need to plan a shoot or session is on the listing,
              and everything you need after you book is in your dashboard.
            </p>
            <ul className="mt-5 space-y-2.5">
              {CREATOR_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 text-sm text-foreground/80"
                >
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200/70">
                    <Check className="size-3" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href="/studios"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-6 h-10 rounded-xl px-5"
              )}
            >
              Browse studios
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-emerald-800 uppercase ring-1 ring-emerald-200/70">
              <Building2 className="size-3.5" />
              For hosts
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              Turn empty hours into booked sessions.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              List your space free, set the terms that work for you, and meet
              creators who will treat the room well.
            </p>
            <ul className="mt-5 space-y-2.5">
              {HOST_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 text-sm text-foreground/80"
                >
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70">
                    <Check className="size-3" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href="/add-studio"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "mt-6 h-10 rounded-xl px-5"
              )}
            >
              List your space
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="shell py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Transparent pricing"
              title="You see the whole number before you book"
              description="No cleaning fees, no surprise platform charges, no deposit held hostage. Just the host's hourly rate and one clearly labeled service fee."
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <PricingPoint
                icon={Wallet}
                title="Host rate"
                description="Set by the host, shown per hour on every listing."
              />
              <PricingPoint
                icon={CreditCard}
                title="7% service fee"
                description="Covers payments, support, and the host guarantee."
              />
              <PricingPoint
                icon={ShieldCheck}
                title="Protected"
                description="Refunded or rebooked if the space is not as described."
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-6">
            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Example booking
            </p>
            <p className="mt-1 text-sm font-semibold">3 hours at $120 / hr</p>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Hourly rate × 3</dt>
                <dd className="font-medium tabular-nums">
                  {formatCurrency(sample.subtotal)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Service fee (7%)</dt>
                <dd className="font-medium tabular-nums">
                  {formatCurrency(sample.serviceFee)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-border/70 pt-3">
                <dt className="font-semibold">Total</dt>
                <dd className="text-lg font-semibold tabular-nums">
                  {formatCurrency(sample.total)}
                </dd>
              </div>
            </dl>

            <p className="mt-4 flex items-start gap-2 rounded-xl bg-secondary/70 p-3 text-xs leading-relaxed text-muted-foreground">
              <BadgeCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              The host keeps their full hourly rate. StudioSpace only charges the
              creator-side service fee.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border/70 bg-secondary/40 py-20 lg:py-24">
        <div className="shell grid items-start gap-10 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24">
            <SectionHeading
              eyebrow="FAQ"
              title="Questions, answered"
              description="Still unsure about something? Our team is one message away."
            />
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border/80 bg-card p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700">
                <Headphones className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">Talk to a human</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Seven days a week, average first response under two hours.
                </p>
                <Link
                  href="/about"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800"
                >
                  Contact the team
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <Accordion className="rounded-2xl border border-border/80 bg-card px-5">
            {FAQS.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="py-4 text-sm font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

function PricingPoint({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-card p-4">
      <span className="grid size-9 place-items-center rounded-xl bg-secondary text-foreground/70">
        <Icon className="size-4" />
      </span>
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
