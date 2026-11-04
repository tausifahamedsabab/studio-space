import { cookies } from "next/headers"

type CookieOptions = {
  path?: string
  domain?: string
  maxAge?: number
  expires?: Date
  httpOnly?: boolean
  secure?: boolean
  sameSite?: "lax" | "strict" | "none"
}

function parseValue(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/**
 * Copies one or more Set-Cookie headers returned by the Express API onto the
 * Next.js response. This is what keeps the HTTPOnly JWT cookie first-party.
 */
export async function applySetCookies(headers: string[]) {
  if (headers.length === 0) return

  const store = await cookies()

  for (const header of headers) {
    const [pair, ...attributes] = header.split(";")
    const separator = pair.indexOf("=")
    if (separator <= 0) continue

    const name = pair.slice(0, separator).trim()
    const value = parseValue(pair.slice(separator + 1).trim())
    const options: CookieOptions = {}

    for (const attribute of attributes) {
      const [rawKey, ...rawValue] = attribute.split("=")
      const key = rawKey.trim().toLowerCase()
      const attributeValue = rawValue.join("=").trim()

      if (key === "path" && attributeValue) options.path = attributeValue
      if (key === "domain" && attributeValue) options.domain = attributeValue
      if (key === "max-age" && attributeValue) {
        const maxAge = Number(attributeValue)
        if (Number.isFinite(maxAge)) options.maxAge = maxAge
      }
      if (key === "expires" && attributeValue) {
        const expires = new Date(attributeValue)
        if (!Number.isNaN(expires.getTime())) options.expires = expires
      }
      if (key === "httponly") options.httpOnly = true
      if (key === "secure") options.secure = true
      if (key === "samesite" && attributeValue) {
        const sameSite = attributeValue.toLowerCase()
        if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
          options.sameSite = sameSite
        }
      }
    }

    store.set(name, value, options)
  }
}
