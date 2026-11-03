import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Check, Sparkles, Star } from "lucide-react"

import { Logo } from "@/components/layout/logo"

const HIGHLIGHTS = [
  "Live availability and instant confirmation",
  "Verified hosts and a real host guarantee",
  "One clear hourly rate — no hidden fees",
] as const

async function getCopyrightYear() {
  "use cache"
  return new Date().getFullYear()
}

export async function AuthShell({ children }: { children: React.ReactNode }) {
  const year = await getCopyrightYear()

  return (
    <section className="grid min-h-[calc(100svh-4rem)] lg:grid-cols-2">
      <div className="flex flex-col px-5 py-10 sm:px-10 lg:px-14 lg:py-14">
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          © {year} StudioSpace, Inc. · Built for people who
          make things.
        </p>
      </div>

      <div className="relative hidden overflow-hidden bg-[#0c0b09] lg:block">
        <Image
          src="/background.jpg"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09] via-[#0c0b09]/55 to-[#0c0b09]/20" />

        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-[11px] font-medium tracking-[0.16em] text-white/75 uppercase backdrop-blur-md">
            <Sparkles className="size-3.5 text-amber-300" />
            Create. Book. Produce.
          </span>

          <div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className="size-4 fill-amber-300 text-amber-300"
                />
              ))}
            </div>
            <blockquote className="mt-5 max-w-md text-2xl leading-snug font-medium tracking-tight text-balance text-white">
              “The room was exactly as pictured, the host was waiting, and the
              whole booking took less time than my coffee order.”
            </blockquote>
            <p className="mt-5 text-sm text-white/55">
              Jordan Ellis · Photographer, Los Angeles
            </p>

            <ul className="mt-10 space-y-3 border-t border-white/10 pt-8">
              {HIGHLIGHTS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-white/70"
                >
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-amber-300/15 text-amber-300">
                    <Check className="size-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
