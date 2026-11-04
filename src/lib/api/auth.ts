import type { PublicUser } from "@/lib/types"

import { isMockMode } from "./config"
import { apiFetch, apiRequest } from "./client"
import { applySetCookies } from "./cookies"
import { ApiError, isApiError } from "./errors"
import { mapUser, unwrapObject } from "./mappers"
import { mockLogin, mockRegister, mockResolveSession } from "./mock/store"

export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = {
  name: string
  email: string
  password: string
  photoUrl?: string
}

function responseCookies(response: Response) {
  if (typeof response.headers.getSetCookie === "function") {
    return response.headers.getSetCookie()
  }
  const header = response.headers.get("set-cookie")
  return header ? [header] : []
}

export async function registerUser(input: RegisterInput): Promise<PublicUser> {
  if (isMockMode()) {
    return mockRegister(input)
  }

  const response = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  })
  await applySetCookies(responseCookies(response))
  return unwrapObject(await response.json(), mapUser)
}

export async function loginUser(input: LoginInput): Promise<PublicUser> {
  if (isMockMode()) {
    const user = await mockLogin(input)
    if (!user) {
      throw new ApiError("Incorrect email or password.", 401)
    }
    return user
  }

  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  })
  await applySetCookies(responseCookies(response))
  return unwrapObject(await response.json(), mapUser)
}

export async function logoutUser() {
  if (isMockMode()) return

  try {
    const response = await apiRequest("/auth/logout", { method: "POST" })
    await applySetCookies(responseCookies(response))
  } catch (error) {
    if (!isApiError(error) || error.status !== 401) throw error
  }
}

/**
 * Resolves the current user from the session cookie. In mock mode the token is
 * the mock session value; in live mode it calls the backend with the incoming
 * cookies and any backend-set cookie (e.g. a rotated JWT) is ignored here.
 */
export async function getCurrentUser(
  token: string | undefined
): Promise<PublicUser | null> {
  if (isMockMode()) {
    return mockResolveSession(token)
  }

  try {
    const body = await apiFetch<unknown>("/auth/me")
    const user = unwrapObject(body, mapUser)
    return user.id ? user : null
  } catch (error) {
    if (isApiError(error) && error.status === 401) return null
    throw error
  }
}

export function googleAuthUrl(next: string) {
  const params = new URLSearchParams({ next })
  return `/api/auth/google?${params.toString()}`
}
