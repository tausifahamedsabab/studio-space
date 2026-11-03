"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  TriangleAlert,
} from "lucide-react"

import { loginAction, type AuthFormState } from "@/actions/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DEMO_CREDENTIALS } from "@/lib/constants"

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    loginAction,
    {}
  )
  const [email, setEmail] = useState(state.values?.email ?? "")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.18em] text-amber-600 uppercase">
        Welcome back
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Log in to StudioSpace
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Pick up where you left off — manage bookings, message hosts, and keep
        your listings current.
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-300/40 bg-amber-50/70 p-3.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber-400/20 text-amber-700">
          <Sparkles className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-amber-900">Demo account</p>
          <p className="mt-0.5 truncate text-xs text-amber-800/80">
            {DEMO_CREDENTIALS.email} · {DEMO_CREDENTIALS.password}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="xs"
          className="shrink-0 border-amber-300/60 bg-white/70 text-amber-900 hover:bg-white"
          onClick={() => {
            setEmail(DEMO_CREDENTIALS.email)
            setPassword(DEMO_CREDENTIALS.password)
          }}
        >
          Fill
        </Button>
      </div>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        {next && <input type="hidden" name="next" value={next} />}

        {state.error && (
          <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
            <TriangleAlert />
            <AlertDescription className="text-destructive">
              {state.error}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@studio.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(state.fieldErrors?.email)}
              className="h-11 rounded-xl pl-9"
              required
            />
          </div>
          {state.fieldErrors?.email && (
            <p className="text-xs text-destructive">{state.fieldErrors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <span className="text-xs text-muted-foreground">
              Minimum 8 characters
            </span>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(state.fieldErrors?.password)}
              className="h-11 rounded-xl pr-10 pl-9"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {state.fieldErrors?.password && (
            <p className="text-xs text-destructive">
              {state.fieldErrors.password}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="mt-1 h-11 w-full rounded-xl text-sm font-semibold"
        >
          {pending ? "Logging in…" : "Log in"}
          {!pending && <ArrowRight className="size-4" />}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to StudioSpace?{" "}
        <Link
          href={next ? { pathname: "/register", query: { next } } : "/register"}
          className="font-semibold text-foreground underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  )
}
