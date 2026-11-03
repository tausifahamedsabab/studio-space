import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  Headphones,
  LifeBuoy,
  ShieldCheck,
  Wallet,
} from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import { SectionHeading } from "@/components/section-heading"

const GUARANTEES = [
  {
    icon: BadgeCheck,
    title: "Verified spaces",
    description:
      "Every host is identity-checked and every listing is reviewed before it goes live. What you see is what you walk into.",
  },
  {
    icon: ShieldCheck,
    title: "Protected bookings",
    description:
      "If a space is not as described or cancels at the last minute, we will help you rebook or refund the full amount.",
  },
  {
    icon: Wallet,
    title: "Transparent pricing",
    description:
      "One clear hourly rate and a 7% service fee. No cleaning surprises, no hidden platform charges at checkout.",
  },
  {
    icon: LifeBuoy,
    title: "Creator support",
    description:
      "Real people on call before, during, and after your session — because a shoot day should not depend on a contact form.",
  },
] as const

export function HostGuarantee() {
  return (
    <section className="relative overflow-hidden bg-[#0c0b09] py-20 text-white lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-24 size-[28rem] rounded-full bg-amber-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-24 size-[24rem] rounded-full bg-orange-600/10 blur-3xl"
      />

      <div className="shell relative">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Host guarantee & creator support"
              title="Book like the space is already yours"
              description="A marketplace only works when both sides feel safe. We put real checks, real protection, and real humans behind every booking."
              invert
            />

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/how-it-works"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-10 gap-2 rounded-xl px-5 text-sm font-semibold shadow-lg shadow-amber-500/20"
                )}
              >
                How the guarantee works
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/10"
              >
                <Headphones className="size-4" />
                Talk to the team
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <dt className="text-[10px] font-medium tracking-[0.16em] text-white/40 uppercase">
                  Avg. response
                </dt>
                <dd className="mt-1 text-xl font-semibold text-white">2 hrs</dd>
              </div>
              <div>
                <dt className="text-[10px] font-medium tracking-[0.16em] text-white/40 uppercase">
                  Rebook success
                </dt>
                <dd className="mt-1 text-xl font-semibold text-white">98%</dd>
              </div>
              <div>
                <dt className="text-[10px] font-medium tracking-[0.16em] text-white/40 uppercase">
                  Support hours
                </dt>
                <dd className="mt-1 text-xl font-semibold text-white">7 days</dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {GUARANTEES.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-colors hover:border-amber-300/30 hover:bg-white/[0.07]"
              >
                <span className="grid size-10 place-items-center rounded-xl border border-amber-300/20 bg-amber-400/10 text-amber-300">
                  <item.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
