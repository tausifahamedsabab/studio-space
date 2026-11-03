"use server"

import { redirect } from "next/navigation"

import {
  clearSessionCookie,
  hashPassword,
  safeNextPath,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth"
import { createUser, getUserByEmail } from "@/lib/data"

export type AuthFormState = {
  error?: string
  fieldErrors?: Record<string, string>
  values?: Record<string, string>
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

  const user = await getUserByEmail(email)
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return {
      error: "Email or password is incorrect. Please try again.",
      values: { email },
    }
  }

  await setSessionCookie(user.id)
  redirect(next)
}

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")
  const next = safeNextPath(formData.get("next"))
  const fieldErrors: Record<string, string> = {}

  if (name.length < 2) fieldErrors.name = "Enter your full name."
  if (!EMAIL_PATTERN.test(email)) {
    fieldErrors.email = "Enter a valid email address."
  }
  if (password.length < 8) {
    fieldErrors.password = "Use at least 8 characters."
  }
  if (password !== confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match."
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: { name, email } }
  }

  const existing = await getUserByEmail(email)
  if (existing) {
    return {
      error: "An account with that email already exists. Try logging in.",
      fieldErrors: { email: "This email is already registered." },
      values: { name, email },
    }
  }

  const passwordHash = await hashPassword(password)
  const user = await createUser({ name, email, passwordHash })
  await setSessionCookie(user.id)
  redirect(next === "/dashboard" ? "/dashboard?welcome=1" : next)
}

export async function logoutAction() {
  await clearSessionCookie()
  redirect("/")
}
