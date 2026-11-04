"use client"

import Link from "next/link"
import { useActionState, useEffect, useState } from "react"
import { ArrowRight, Eye, EyeOff, Lock, Mail, TriangleAlert } from "lucide-react"

import { loginAction, type AuthFormState } from "@/actions/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export function LoginForm({
  next,
  googleUrl,
}: {
  next?: string
  googleUrl?: string
}) {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    loginAction,
    {}
  )
  const [email, setEmail] = useState(state.values?.email ?? "")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!state.error) return

    toast.add({ title: "Login failed", description: state.error, type: "error" })
  }, [state])

  const handleGoogleLogin = () => {
    if (googleUrl) {
      window.location.assign(googleUrl)
      return
    }

    toast.add({
      title: "Google sign-in",
      description:
        "Google OAuth is handled by the API. Run in live mode to enable it.",
      type: "info",
    })
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111127]/80 p-6 shadow-[0_40px_120px_-60px_rgba(124,58,237,0.9)] backdrop-blur-xl sm:p-8">
      <div className="mb-6 space-y-2">
        <p className="text-xs font-semibold tracking-[0.28em] text-[#C084FC] uppercase">
          Login
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Sign in to StudioSpace
        </h1>
        <p className="text-sm leading-relaxed text-white/60">
          Access your bookings, manage listings, and keep your creative schedule on track.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        {next && <input type="hidden" name="next" value={next} />}

        {state.error && (
          <Alert variant="destructive" className="border-red-500/40 bg-red-500/10 text-red-200">
            <TriangleAlert />
            <AlertDescription className="text-red-200">
              {state.error}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-white/80">
            Email
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40" />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(state.fieldErrors?.email)}
              className="h-11 rounded-xl border-white/10 bg-white/5 pl-9 text-white placeholder:text-white/40"
              required
            />
          </div>
          {state.fieldErrors?.email && (
            <p className="text-xs text-red-300">{state.fieldErrors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-white/80">
              Password
            </Label>
            <Link href="#" className="text-xs text-[#C084FC] hover:text-[#d8b4fe]">
              Forgot Password
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(state.fieldErrors?.password)}
              className="h-11 rounded-xl border-white/10 bg-white/5 pr-10 pl-9 text-white placeholder:text-white/40"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-white/50 transition-colors hover:bg-white/5 hover:text-white"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {state.fieldErrors?.password && (
            <p className="text-xs text-red-300">{state.fieldErrors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="mt-1 h-11 w-full rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-sm font-semibold text-white shadow-[0_20px_60px_-30px_rgba(168,85,247,0.9)] hover:from-[#8b5cf6] hover:to-[#a855f7]"
        >
          {pending ? "Logging in…" : "Login"}
          {!pending && <ArrowRight className="size-4" />}
        </Button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-white/40">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        className="mt-4 h-11 w-full rounded-xl border-white/10 bg-white/5 text-sm font-medium text-white hover:bg-white/10"
      >
        <GoogleIcon />
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm text-white/60">
        Don&apos;t have an account?{" "}
        <Link
          href={next ? { pathname: "/register", query: { next } } : "/register"}
          className="font-semibold text-[#C084FC] hover:text-[#d8b4fe]"
        >
          Register
        </Link>
      </p>
    </div>
  )
}
