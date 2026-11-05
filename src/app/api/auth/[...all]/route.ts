import { toNextJsHandler } from "better-auth/next-js"

import { betterAuthInstance } from "@/lib/server-auth"

/**
 * Mounts BetterAuth's entire endpoint surface under /api/auth:
 * sign-in/email, sign-up/email, get-session, sign-out, sign-in/social, and
 * the Google OAuth callback.
 */
const auth = betterAuthInstance()

if (!auth) {
  throw new Error(
    "BetterAuth is not configured. Set MONGODB_URI and API_MODE=live."
  )
}

export const { GET, POST } = toNextJsHandler(auth.handler)
