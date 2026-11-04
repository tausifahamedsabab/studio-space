import { Suspense } from "react"
import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/login-form"
import { googleAuthUrl } from "@/lib/api/auth"
import { isMockMode } from "@/lib/api/config"

export const metadata: Metadata = {
  title: "Log in",
  description:
    "Log in to StudioSpace to manage your bookings, listings, and creative spaces.",
}

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <Suspense fallback={<AuthFormFallback />}>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  )
}

async function LoginContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const next = typeof params.next === "string" ? params.next : undefined

  return (
    <AuthShell>
      <LoginForm
        next={next}
        googleUrl={isMockMode() ? undefined : googleAuthUrl(next ?? "/dashboard")}
      />
    </AuthShell>
  )
}

function AuthFormFallback() {
  return (
    <AuthShell>
      <div className="space-y-4">
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="h-9 w-64 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="mt-8 h-12 w-full animate-pulse rounded-xl bg-muted" />
        <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
        <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
        <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
      </div>
    </AuthShell>
  )
}
