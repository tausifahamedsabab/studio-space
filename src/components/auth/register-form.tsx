"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  TriangleAlert,
  User,
} from "lucide-react"

import { registerAction, type AuthFormState } from "@/actions/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-destructive">{message}</p>
}

export function RegisterForm({
  next,
  intent,
}: {
  next?: string
  intent?: string
}) {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    registerAction,
    {}
  )
  const [showPassword, setShowPassword] = useState(false)
  const isHostIntent = intent === "host"

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.18em] text-amber-600 uppercase">
        {isHostIntent ? "Become a host" : "Get started"}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {isHostIntent ? "List your space on StudioSpace" : "Create your account"}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {isHostIntent
          ? "Create a free account, add your space in minutes, and start meeting the people who will make it part of their process."
          : "Book remarkable rooms by the hour, keep every reservation in one place, and get straight to the work."}
      </p>

      {isHostIntent && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-300/40 bg-amber-50/70 p-3.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber-400/20 text-amber-700">
            <Building2 className="size-4" />
          </span>
          <p className="text-xs leading-relaxed text-amber-900/80">
            <span className="font-semibold text-amber-900">
              Hosts keep 100% of their hourly rate.
            </span>{" "}
            We add a single 7% service fee for creators at checkout — no listing
            fees, no monthly subscription.
          </p>
        </div>
      )}

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
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Alex Rivera"
              defaultValue={state.values?.name}
              aria-invalid={Boolean(state.fieldErrors?.name)}
              className="h-11 rounded-xl pl-9"
              required
            />
          </div>
          <FieldError message={state.fieldErrors?.name} />
        </div>

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
              defaultValue={state.values?.email}
              aria-invalid={Boolean(state.fieldErrors?.email)}
              className="h-11 rounded-xl pl-9"
              required
            />
          </div>
          <FieldError message={state.fieldErrors?.email} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="8+ characters"
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
            <FieldError message={state.fieldErrors?.password} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat password"
                aria-invalid={Boolean(state.fieldErrors?.confirmPassword)}
                className="h-11 rounded-xl pl-9"
                required
              />
            </div>
            <FieldError message={state.fieldErrors?.confirmPassword} />
          </div>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          By creating an account you agree to the StudioSpace Terms of Service
          and Privacy Policy. Every booking is covered by the host guarantee.
        </p>

        <Button
          type="submit"
          disabled={pending}
          className="h-11 w-full rounded-xl text-sm font-semibold"
        >
          {pending
            ? "Creating your account…"
            : isHostIntent
              ? "Create host account"
              : "Create account"}
          {!pending && <ArrowRight className="size-4" />}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={next ? { pathname: "/login", query: { next } } : "/login"}
          className="font-semibold text-foreground underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  )
}
