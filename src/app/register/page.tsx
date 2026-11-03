import { Suspense } from "react"
import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Create a StudioSpace account to book creative spaces or list your own studio by the hour.",
}

export default function RegisterPage({ searchParams }: PageProps<"/register">) {
  return (
    <Suspense fallback={<AuthFormFallback />}>
      <RegisterContent searchParams={searchParams} />
    </Suspense>
  )
}

async function RegisterContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const next = typeof params.next === "string" ? params.next : undefined
  const intent = typeof params.intent === "string" ? params.intent : undefined

  return (
    <AuthShell>
      <RegisterForm next={next} intent={intent} />
    </AuthShell>
  )
}

function AuthFormFallback() {
  return (
    <AuthShell>
      <div className="space-y-4">
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="h-9 w-72 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="mt-8 h-12 w-full animate-pulse rounded-xl bg-muted" />
        <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-12 animate-pulse rounded-xl bg-muted" />
          <div className="h-12 animate-pulse rounded-xl bg-muted" />
        </div>
        <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
      </div>
    </AuthShell>
  )
}
