import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto"
import { promisify } from "node:util"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { connection } from "next/server"

import { getUserById, toPublicUser } from "./data"
import type { PublicUser } from "./types"

const scrypt = promisify(scryptCallback)

const SESSION_COOKIE = "studiospace_session"
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

function getSecret() {
  return (
    process.env.AUTH_SECRET ??
    "studiospace-local-development-secret-please-change-in-production"
  )
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const derived = (await scrypt(password, salt, 64)) as Buffer
  return `${salt}:${derived.toString("hex")}`
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, key] = stored.split(":")
  if (!salt || !key) return false
  const derived = (await scrypt(password, salt, 64)) as Buffer
  const keyBuffer = Buffer.from(key, "hex")
  if (keyBuffer.length !== derived.length) return false
  return timingSafeEqual(keyBuffer, derived)
}

export function createSessionToken(userId: string) {
  const expires = Date.now() + SESSION_TTL_SECONDS * 1000
  const payload = `${userId}.${expires}`
  const signature = createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url")
  return `${payload}.${signature}`
}

export function readSessionToken(token: string): string | null {
  const lastDot = token.lastIndexOf(".")
  if (lastDot === -1) return null

  const payload = token.slice(0, lastDot)
  const signature = token.slice(lastDot + 1)
  const expected = createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url")

  const provided = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (
    provided.length !== expectedBuffer.length ||
    !timingSafeEqual(provided, expectedBuffer)
  ) {
    return null
  }

  const separator = payload.lastIndexOf(".")
  if (separator === -1) return null
  const userId = payload.slice(0, separator)
  const expires = Number(payload.slice(separator + 1))
  if (!userId || !Number.isFinite(expires) || Date.now() > expires) return null
  return userId
}

export async function setSessionCookie(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, createSessionToken(userId), {
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
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null
  const userId = readSessionToken(token)
  if (!userId) return null
  const user = await getUserById(userId)
  return user ? toPublicUser(user) : null
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
