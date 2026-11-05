"use server"

import { redirect } from "next/navigation"

import {
  clearSessionCookie,
  safeNextPath,
  setSessionCookie,
} from "@/lib/auth"
import {
  clearBackendSession,
  establishBackendSession,
  loginWithAuth,
  logoutWithAuth,
  registerWithAuth,
} from "@/lib/auth-live"
import { isMockMode } from "@/lib/api/config"
import { loginUser, registerUser } from "@/lib/api/auth"
import type { PublicUser } from "@/lib/types"

export type AuthFormState = {
  error?: string
  fieldErrors?: Record<string, string>
  values?: Record<string, string>
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidPassword(password: string) {
  if (password.length < 6) return false
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  return hasUppercase && hasLowercase
}

function authError(error: unknown, values: Record<string, string>): AuthFormState {
  if (error instanceof Error) {
    return { error: error.message, values }
  }
  return {
    error: "Something went wrong. Please try again.",
    values,
  }
}

async function finalizeAuth(user: PublicUser) {
  if (isMockMode()) {
    await setSessionCookie(user.id)
    return
  }
  // BetterAuth already set its session cookie; mint the JWT the Express API
  // validates on protected studio/booking mutations (Challenge 1).
  await establishBackendSession(user)
}

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")
  const next = safeNextPath(formData.get("next"))

  if (!email || !password) {
    return {
      error: "Enter your email and password to continue.",
      values: { email },
    }
  }

  if (!EMAIL_PATTERN.test(email)) {
    return {
      error: "Enter a valid email address.",
      values: { email },
    }
  }

  try {
    const user = isMockMode()
      ? await loginUser({ email, password })
      : await loginWithAuth({ email, password })
    await finalizeAuth(user)
  } catch (error) {
    return authError(error, { email })
  }

  redirect(next || "/")
}

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const photoUrl = String(formData.get("photoUrl") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")
  const next = safeNextPath(formData.get("next"))
  const fieldErrors: Record<string, string> = {}

  if (name.length < 2) fieldErrors.name = "Enter your full name."
  if (!EMAIL_PATTERN.test(email)) {
    fieldErrors.email = "Enter a valid email address."
  }
  if (!isValidPassword(password)) {
    fieldErrors.password =
      "Password must be at least 6 characters and include an uppercase and a lowercase letter."
  }
  if (password !== confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match."
  }

  // Photo URL is optional: only validate if the user provided one.
  if (photoUrl) {
    try {
      const url = new URL(photoUrl)
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        fieldErrors.photoUrl = "Use an http:// or https:// image URL."
      }
    } catch {
      fieldErrors.photoUrl = "Enter a valid image URL, or leave it blank."
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: { name, email, photoUrl } }
  }

  try {
    const user = isMockMode()
      ? await registerUser({
          name,
          email,
          password,
          photoUrl: photoUrl || undefined,
        })
      : await registerWithAuth({
          name,
          email,
          password,
          photoUrl: photoUrl || undefined,
        })
    await finalizeAuth(user)
  } catch (error) {
    return authError(error, { name, email, photoUrl })
  }

  redirect(next)
}

export async function logoutAction() {
  try {
    await logoutWithAuth()
  } catch {
    // Clearing the local cookie below is still the right fallback.
  }
  await clearSessionCookie()
  redirect("/")
}
