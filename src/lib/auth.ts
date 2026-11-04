import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { connection } from "next/server"

import { getCurrentUser } from "./api/auth"
import { isMockMode } from "./api/config"
import type { PublicUser } from "./types"

const SESSION_COOKIE = "studiospace_session"
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

/**
 * In live mode the JWT cookie is owned by the Express API; login/register
 * already copied its Set-Cookie header onto the Next response. The mock mode
 * keeps a namespaced token in the same cookie so pages can share one read path.
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
  cookieStore.delete(SESSION_COOKIE)
}

export async function getSessionUser(): Promise<PublicUser | null> {
  // Session expiry depends on the current time, so this must run at request
  // time rather than during prerendering.
  await connection()
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value

  // No incoming cookies means there is no backend session to validate.
  if (!isMockMode() && store.getAll().length === 0) return null

  return getCurrentUser(token)
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
