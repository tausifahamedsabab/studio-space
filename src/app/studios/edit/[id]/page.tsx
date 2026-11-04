import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { StudioForm } from "@/components/dashboard/studio-form"
import { requireUser } from "@/lib/auth"
import { getStudioById } from "@/lib/data"

export const metadata: Metadata = {
  title: "Edit studio",
}

export default function EditStudioPage({
  params,
}: PageProps<"/studios/edit/[id]">) {
  return (
    <Suspense fallback={<EditStudioSkeleton />}>
      <EditStudio params={params} />
    </Suspense>
  )
}

async function EditStudio({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [user, { id }] = await Promise.all([requireUser(), params])
  const studio = await getStudioById(id)

  if (!studio || studio.hostId !== user.id) notFound()

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
        Edit your listing
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Update the details, pricing, and availability of {studio.title}. Changes
        go live as soon as you save.
      </p>

      <StudioForm studio={studio} />
    </div>
  )
}

function EditStudioSkeleton() {
  return (
    <div className="max-w-3xl">
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-5 h-3 w-20 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-9 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
      <div className="mt-8 h-96 animate-pulse rounded-2xl bg-muted" />
    </div>
  )
}
