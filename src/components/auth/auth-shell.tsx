import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Check, Sparkles } from "lucide-react"

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
    <section className="relative grid min-h-[calc(100svh-4rem)] overflow-hidden bg-[#080816] lg:grid-cols-2">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#7C3AED]/20 blur-[140px]" />
        <div className="absolute top-1/3 -left-40 h-[24rem] w-[24rem] rounded-full bg-[#A855F7]/15 blur-[160px]" />
        <div className="absolute bottom-[-20rem] right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-[#C084FC]/10 blur-[180px]" />
      </div>

      <div className="flex flex-col px-5 py-10 sm:px-10 lg:px-16 lg:py-14">
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-lg">{children}</div>
        </div>

        <p className="text-center text-xs text-white/40">
          © {year} StudioSpace, Inc. · Built for creative professionals.
        </p>
      </div>

      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/background.jpg"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#080816]/95 via-[#080816]/70 to-[#080816]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.25),transparent_55%)]" />

        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-medium tracking-[0.24em] text-white/80 uppercase backdrop-blur-md">
            <Sparkles className="size-3.5 text-[#C084FC]" />
            StudioSpace
          </span>

          <div>
            <h2 className="max-w-lg text-4xl leading-tight font-semibold tracking-tight text-white">
              Book stunning creative studios with cinematic precision.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
              Discover photo studios, sound stages, podcast rooms, and more. Seamless booking for every production.
            </p>

            <ul className="mt-10 space-y-3">
              {HIGHLIGHTS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-white/80"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-white shadow-[0_10px_40px_-20px_rgba(168,85,247,0.9)]">
                    <Check className="size-3.5" />
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
