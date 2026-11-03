import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Building2, Sparkles } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"

export function CtaBand() {
  return (
    <section className="shell py-20 lg:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-[#0c0b09] text-white">
        <Image
          src="/background.jpg"
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0b09] via-[#0c0b09]/85 to-[#0c0b09]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09]/80 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col gap-8 px-6 py-12 sm:px-10 sm:py-16 lg:flex-row lg:items-end lg:justify-between lg:px-14 lg:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-[11px] font-medium tracking-[0.16em] text-white/75 uppercase backdrop-blur-md">
              <Sparkles className="size-3.5 text-amber-300" />
              For hosts and creators
            </span>
            <h2 className="mt-5 text-3xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              A great space should be
              <span className="text-amber-300"> fully booked.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-pretty text-white/65 sm:text-base">
              List your studio in minutes, set your own hours and rate, and meet
              the people who will make it part of their process. Or find your
              next room and get straight to the work.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/register?intent=host"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 gap-2 rounded-xl px-6 text-sm font-semibold shadow-lg shadow-amber-500/20"
              )}
            >
              <Building2 className="size-4" />
              List your space
            </Link>
            <Link
              href="/studios"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/10"
            >
              Explore studios
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
