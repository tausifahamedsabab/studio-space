import { cookies } from "next/headers"

import { API_BASE_URL } from "./config"
import { ApiError } from "./errors"

type ApiRequestInit = RequestInit & {
  /** Override the forwarded cookie header (used by /auth/me). */
  cookie?: string
}

function apiUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${API_BASE_URL}/api${normalized}`
}

async function forwardedCookies() {
  const store = await cookies()
  return store
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ")
}

export async function apiRequest(
  path: string,
  init: ApiRequestInit = {}
): Promise<Response> {
  const { cookie, headers: initHeaders, ...rest } = init
  const headers = new Headers(initHeaders)

  const cookieHeader = cookie ?? (await forwardedCookies())
  if (cookieHeader) headers.set("cookie", cookieHeader)
  if (rest.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json")
  }
  headers.set("accept", "application/json")

  const response = await fetch(apiUrl(path), {
    ...rest,
    headers,
    cache: "no-store",
    signal: rest.signal ?? AbortSignal.timeout(15_000),
  })

  if (!response.ok) {
    const body = (await response
      .clone()
      .json()
      .catch(() => null)) as
      | { message?: string; error?: string; fieldErrors?: Record<string, string> }
      | null

    throw new ApiError(
      body?.message ?? body?.error ?? response.statusText ?? "Request failed",
      response.status,
      body?.fieldErrors
    )
  }

  return response
}

export async function apiFetch<T>(
  path: string,
  init: ApiRequestInit = {}
): Promise<T> {
  const response = await apiRequest(path, init)
  if (response.status === 204) return null as T

  const text = await response.text()
  if (!text) return null as T

  return JSON.parse(text) as T
}
