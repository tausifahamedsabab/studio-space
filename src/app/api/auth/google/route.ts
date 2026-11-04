import { NextResponse, type NextRequest } from "next/server"

import { safeNextPath } from "@/lib/auth"

/**
 * Starts the Google OAuth dance. The browser is redirected to Google's
 * consent screen; the callback route exchanges the code server-side and
 * hands the verified ID token to the Express API.
 */
export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const origin = new URL(request.url).origin

  if (!clientId) {
    return NextResponse.redirect(`${origin}/login?googleUnavailable=1`)
  }

  const next = safeNextPath(
    new URL(request.url).searchParams.get("next") ?? "/dashboard"
  )

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
    state: Buffer.from(JSON.stringify({ next })).toString("base64url"),
  })

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  )
}
