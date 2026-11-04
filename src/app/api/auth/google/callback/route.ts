import { NextResponse, type NextRequest } from "next/server"

import { API_BASE_URL, isLiveMode } from "@/lib/api/config"
import { applySetCookies } from "@/lib/api/cookies"
import { safeNextPath } from "@/lib/auth"

type State = { next?: string }

function readState(value: string | null): State {
  if (!value) return {}
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString()) as State
  } catch {
    return {}
  }
}

/**
 * Finishes the Google OAuth dance: exchanges the code with Google, sends the
 * verified ID token to the Express API, copies the HTTPOnly session cookie
 * the API returned onto this first-party origin, and bounces the user back.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const origin = url.origin
  const state = readState(url.searchParams.get("state"))
  const code = url.searchParams.get("code")
  const error = url.searchParams.get("error")

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?googleError=${encodeURIComponent(error)}`
    )
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!code || !clientId || !clientSecret || !isLiveMode()) {
    return NextResponse.redirect(`${origin}/login?googleError=configuration`)
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${origin}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
      signal: AbortSignal.timeout(15_000),
    })

    if (!tokenResponse.ok) {
      return NextResponse.redirect(`${origin}/login?googleError=token`)
    }

    const tokens = (await tokenResponse.json()) as { id_token?: string }
    if (!tokens.id_token) {
      return NextResponse.redirect(`${origin}/login?googleError=token`)
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ idToken: tokens.id_token }),
      signal: AbortSignal.timeout(15_000),
    })

    if (!response.ok) {
      return NextResponse.redirect(`${origin}/login?googleError=api`)
    }

    await applySetCookies(response.headers.getSetCookie())
  } catch {
    return NextResponse.redirect(`${origin}/login?googleError=network`)
  }

  const next = safeNextPath(state.next ?? "/dashboard")
  return NextResponse.redirect(`${origin}${next}`)
}
