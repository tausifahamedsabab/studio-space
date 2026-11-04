"use server"

import { redirect } from "next/navigation"

import { loginUser, logoutUser, registerUser } from "@/lib/api/auth"
import { isApiError } from "@/lib/api/errors"
import {
  clearSessionCookie,
  safeNextPath,
  setSessionCookie,
} from "@/lib/auth"

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
  if (isApiError(error)) {
    return {
      error: error.message,
      fieldErrors: error.fieldErrors,
      values,
    }
  }
  return {
    error: "Something went wrong. Please try again.",
    values,
  }
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

  let userId: string
  try {
    const user = await loginUser({ email, password })
    userId = user.id
  } catch (error) {
    return authError(error, { email })
  }

  await setSessionCookie(userId)
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

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: { name, email, photoUrl } }
  }

  try {
    await registerUser({ name, email, password, photoUrl: photoUrl || undefined })
  } catch (error) {
    return authError(error, { name, email, photoUrl })
  }

  // Sign the new account in right away. If the API requires a separate login
  // and it fails, fall back to the login screen with a helpful flag.
  try {
    const user = await loginUser({ email, password })
    await setSessionCookie(user.id)
  } catch {
    redirect(`/login?registered=1`)
  }

  redirect(next)
}

export async function logoutAction() {
  try {
    await logoutUser()
  } catch {
    // Clearing the local cookie below is still the right fallback.
  }
  await clearSessionCookie()
  redirect("/")
}
