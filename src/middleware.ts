import { NextResponse, type NextRequest } from "next/server"

const SESSION_COOKIE = "studiospace_session"

/**
 * Edge-level gate for private routes. An unauthenticated visitor (no session
 * cookie at all) is redirected before the segment renders, which keeps Cache
 * Components' instant-UI validation happy. Logged-in users pass straight
 * through, so refreshing a private route never bounces them to /login — the
 * server components then validate the JWT properly via requireUser().
 */
export function middleware(request: NextRequest) {
  if (request.cookies.get(SESSION_COOKIE)) return NextResponse.next()

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
