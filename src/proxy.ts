import { NextResponse, type NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const SESSION_COOKIE = "studiospace_session"
const BETTER_AUTH_COOKIE = "better-auth.session_token"
const BACKEND_JWT_SECRET =
  process.env.JWT_SECRET || "studiospace-dev-secret-change-me"
const BACKEND_JWT_ISSUER = "studiospace-api"
const TTL_SECONDS = 60 * 60 * 24 * 7

type SessionClaims = { sub?: string; email?: string; name?: string }

/** True when the cookie carries a JWT signed by the current secret. */
function isFreshBackendToken(token: string) {
  try {
    jwt.verify(token, BACKEND_JWT_SECRET, {
      issuer: BACKEND_JWT_ISSUER,
    })
    return true
  } catch {
    return false
  }
}

/**
 * Edge-level gate for private routes. An unauthenticated visitor (no session
 * cookie at all) is redirected before the segment renders, which keeps Cache
 * Components' instant-UI validation happy. Logged-in users pass straight
 * through, so refreshing a private route never bounces them to /login — the
 * server components then validate the session properly via requireUser().
 *
 * Also self-heals the backend session cookie: if it was signed with a
 * different/older secret (e.g. after rotating JWT_SECRET or reusing a dev DB),
 * it is re-signed with the current secret so the Express API accepts it.
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value

  if (token) {
    if (isFreshBackendToken(token)) return NextResponse.next()

    // Stale token: re-sign it only when an actual BetterAuth session is
    // present, using its (auth-cookie-protected) claims.
    const betterAuthCookie = request.cookies.get(BETTER_AUTH_COOKIE)?.value
    if (!betterAuthCookie) return redirectLogin(request)

    const claims = jwt.decode(token) as SessionClaims | null
    if (!claims?.sub) return redirectLogin(request)

    const fresh = jwt.sign(
      { sub: claims.sub, email: claims.email, name: claims.name },
      BACKEND_JWT_SECRET,
      { issuer: BACKEND_JWT_ISSUER, expiresIn: TTL_SECONDS }
    )
    const response = NextResponse.next()
    response.cookies.set("studiospace_session", fresh, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: TTL_SECONDS,
    })
    return response
  }

  return redirectLogin(request)
}

function redirectLogin(request: NextRequest) {
  const login = new URL("/login", request.url)
  login.searchParams.set("next", request.nextUrl.pathname)
  return NextResponse.redirect(login)
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/my-listings/:path*",
    "/add-studio/:path*",
    "/my-bookings/:path*",
    "/studios/edit/:path*",
  ],
}
