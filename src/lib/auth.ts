import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { connection } from "next/server"

import {
  betterAuthSession,
  clearBackendSession,
} from "./auth-live"
import { isMockMode } from "./api/config"
import { mockResolveSession } from "./api/mock/store"
import type { PublicUser } from "./types"

const SESSION_COOKIE = "studiospace_session"
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

/**
 * Mock mode keeps a namespaced token in the backend-session cookie so pages
 * share one read path; BetterAuth owns the live-mode session cookie instead.
 */
export async function setSessionCookie(userId: string) {
  if (!isMockMode()) return

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, `mock:${userId}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  })
  await clearBackendSession()
}

export async function getSessionUser(): Promise<PublicUser | null> {
  // Session expiry depends on the current time, so this must run at request
  // time rather than during prerendering.
  await connection()
  const store = await cookies()

  const cookieValue = store.get(SESSION_COOKIE)?.value
  if (cookieValue?.startsWith("mock:")) {
    return mockResolveSession(cookieValue)
  }

  if (isMockMode()) return null

  // Live mode: BetterAuth resolves the session from its own cookie.
  return betterAuthSession()
}

export async function requireUser(): Promise<PublicUser> {
  const user = await getSessionUser()
  if (!user) redirect("/login")
  return user
}

export function safeNextPath(value: FormDataEntryValue | null | undefined) {
  if (typeof value !== "string") return "/dashboard"
  if (!value.startsWith("/") || value.startsWith("//")) return "/dashboard"
  return value
}
