import Link from "next/link"
import {
  ArrowRight,
  CalendarCheck,
  CreditCard,
  Search,
  Sparkles,
} from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import { SectionHeading } from "@/components/section-heading"

const STEPS = [
  {
    icon: Search,
    title: "Find the space",
    description:
      "Search by city, category, or the kind of light you need. Every listing shows real photos, gear, and house rules up front.",
    detail: "12 curated spaces and counting",
  },
  {
    icon: CalendarCheck,
    title: "Pick your hours",
    description:
      "Choose a date and see live availability down to the hour. No back-and-forth emails, no guessing whether the room is free.",
    detail: "Live availability, updated instantly",
  },
  {
    icon: CreditCard,
    title: "Book with confidence",
    description:
      "Transparent pricing with one simple service fee. Your booking is confirmed the moment you check out, and protected by our host guarantee.",
    detail: "Secure checkout · 7% service fee",
  },
  {
    icon: Sparkles,
    title: "Show up and create",
    description:
      "Your host has the room ready and knows you are coming. Load in, get to work, and leave the logistics to us.",
    detail: "Real hosts, real support",
  },
] as const

export function HowBookingWorks() {
  return (
    <section className="shell py-20 lg:py-24">
      <SectionHeading
        eyebrow="How booking works"
        title="From idea to call sheet in four steps"
        description="StudioSpace keeps the whole process in one place — discovery, availability, payment, and the people who make the day run smoothly."
        align="center"
      />

      <div className="relative mt-14">
        <div
          aria-hidden="true"
          className="absolute top-9 right-[12%] left-[12%] hidden border-t border-dashed border-border lg:block"
        />

        <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="group relative flex flex-col">
              <div className="flex items-center gap-3">
                <span className="grid size-[4.5rem] shrink-0 place-items-center rounded-2xl border border-border/80 bg-card text-amber-600 shadow-sm ring-1 ring-foreground/5 transition-colors group-hover:border-amber-300/70 group-hover:bg-amber-50">
                  <step.icon className="size-6" />
                </span>
                <span className="text-4xl font-semibold tracking-tighter text-border tabular-nums select-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
              <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
                <span className="size-1.5 rounded-full bg-amber-500" />
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-14 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/70 bg-secondary/60 px-6 py-5 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Not sure where to start?</span>{" "}
          Tell us what you are shooting and we will point you to the right room.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/how-it-works"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-9 rounded-xl")}
          >
            Read the full guide
          </Link>
          <Link
            href="/studios"
            className={cn(buttonVariants({ size: "lg" }), "h-9 rounded-xl px-4")}
          >
            Explore studios
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
