import { headers as nextHeaders, cookies } from "next/headers"
import jwt from "jsonwebtoken"

import { betterAuthInstance } from "./server-auth"
import type { PublicUser } from "./types"

/** The fields BetterAuth exposes on its user document. */
type BetterAuthUser = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string | null
  createdAt?: string | Date
}

// Shared with the Express API so its auth middleware can verify mutations
// (Challenge 1: JWT in an HTTPOnly cookie protecting server-side mutations).
const BACKEND_COOKIE = "studiospace_session"
const BACKEND_TTL_SECONDS = 60 * 60 * 24 * 7
const BACKEND_JWT_SECRET =
  process.env.JWT_SECRET || "studiospace-dev-secret-change-me"

function mapAuthUser(user: BetterAuthUser | undefined | null): PublicUser {
  const avatar = typeof user?.image === "string" ? user.image : ""
  return {
    id: user?.id ?? "",
    name: user?.name ?? "StudioSpace member",
    email: user?.email ?? "",
    avatar,
    photoUrl: avatar || undefined,
    createdAt: user?.createdAt
      ? new Date(user.createdAt).toISOString()
      : new Date(0).toISOString(),
  }
}

/** Copies the BetterAuth Set-Cookie header(s) onto the app's first-party response. */
async function copyAuthCookies(headers: Headers) {
  const setCookie = headers.getSetCookie()
  if (setCookie.length === 0) return

  const store = await cookies()
  for (const header of setCookie) {
    const pair = header.split(";")[0]
    const separator = pair.indexOf("=")
    if (separator <= 0) continue
    const name = pair.slice(0, separator).trim()
    let value = pair.slice(separator + 1).trim()
    try {
      value = decodeURIComponent(value)
    } catch {
      // keep raw value
    }
    if (value === "") {
      store.delete(name)
      continue
    }
    const maxAge = /max-age=(\d+)/i.exec(header)?.[1]
    store.set(name, value, {
      httpOnly: /httponly/i.test(header),
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      ...(maxAge && Number(maxAge) ? { maxAge: Number(maxAge) } : {}),
    })
  }
}

/**
 * Signs the short-lived JWT the Express API expects in its HTTPOnly cookie
 * for the owner-checked studio and booking mutations.
 */
export async function establishBackendSession(user: PublicUser) {
  if (!user.id) return
  const token = jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    BACKEND_JWT_SECRET,
    { issuer: "studiospace-api", expiresIn: BACKEND_TTL_SECONDS }
  )
  const store = await cookies()
  store.set(BACKEND_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: BACKEND_TTL_SECONDS,
  })
}

export async function clearBackendSession() {
  const store = await cookies()
  store.delete(BACKEND_COOKIE)
}

/** View of the current user resolved straight from BetterAuth. */
export async function betterAuthSession(): Promise<PublicUser | null> {
  const auth = betterAuthInstance()
  if (!auth) return null

  try {
    const session = await auth.api.getSession({
      headers: await nextHeaders(),
    })
    if (!session?.user) return null
    return mapAuthUser(session.user as BetterAuthUser)
  } catch (error) {
    console.error("[studiospace] BetterAuth session lookup failed:", error)
    return null
  }
}

export async function registerWithAuth(input: {
  name: string
  email: string
  password: string
  photoUrl?: string
}): Promise<PublicUser> {
  const auth = betterAuthInstance()
  if (!auth) {
    throw new Error(
      "Live mode requires MONGODB_URI. Run without API_MODE=live for mock mode."
    )
  }

  try {
    const { response, headers } = await auth.api.signUpEmail({
      body: {
        name: input.name,
        email: input.email,
        password: input.password,
        image: input.photoUrl || undefined,
      },
      returnHeaders: true as const,
    })

    await copyAuthCookies(headers)
    return mapAuthUser("user" in response ? response.user : undefined)
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw error
    }
    throw new Error("Could not create your account.")
  }
}

export async function loginWithAuth(input: {
  email: string
  password: string
}): Promise<PublicUser> {
  const auth = betterAuthInstance()
  if (!auth) {
    throw new Error(
      "Live mode requires MONGODB_URI. Run without API_MODE=live for mock mode."
    )
  }

  try {
    const { response, headers } = await auth.api.signInEmail({
      body: { email: input.email, password: input.password },
      returnHeaders: true as const,
    })

    await copyAuthCookies(headers)
    return mapAuthUser("user" in response ? response.user : undefined)
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw error
    }
    throw new Error("Incorrect email or password.")
  }
}

export async function logoutWithAuth(): Promise<void> {
  const auth = betterAuthInstance()
  if (!auth) return

  try {
    const { headers } = await auth.api.signOut({
      headers: await nextHeaders(),
      returnHeaders: true as const,
    })
    await copyAuthCookies(headers)
  } catch {
    // Clearing the app cookie below is still the right fallback.
  }
}
