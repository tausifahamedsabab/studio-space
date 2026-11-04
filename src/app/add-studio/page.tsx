import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { StudioForm } from "@/components/dashboard/studio-form"

export const metadata: Metadata = {
  title: "Add a studio",
  description:
    "List your photo studio, sound stage, podcast room, music suite, or workshop on StudioSpace.",
}

export default function AddStudioPage() {
  return (
    <div className="max-w-3xl">
      <Link
        href="/my-listings"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to my listings
      </Link>

      <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-amber-600 uppercase">
        Hosting
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        List your space
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Tell creators what makes your room special. You set the rate and the
        hours — we handle discovery, availability, and payments. It takes about
        five minutes.
      </p>

      <StudioForm />
    </div>
  )
}
