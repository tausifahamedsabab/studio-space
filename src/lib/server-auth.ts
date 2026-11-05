import { MongoClient } from "mongodb"
import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"

import { isMockMode } from "./api/config"

/**
 * BetterAuth owns authentication in live mode: email/password sign-in,
 * sessions in MongoDB, and the Google social provider. Sessions are stored in
 * an HTTPOnly cookie on this origin, which is what lets server components
 * resolve the current user directly.
 *
 * The client connects lazily on first query, so it is safe to build the
 * config at module scope.
 */
const globalCache = globalThis as unknown as {
  __studioBetterAuth?: ReturnType<typeof createAuth>
}

function createAuth() {
  const client = new MongoClient(process.env.MONGODB_URI!, {
    serverSelectionTimeoutMS: 8000,
    maxPoolSize: 5,
  })

  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    appName: "studiospace",
    database: mongodbAdapter(client.db(process.env.MONGODB_DB ?? "studioSpace")),
    trustedOrigins: [
      "http://localhost:3000",
      ...(process.env.NEXT_PUBLIC_APP_URL
        ? [process.env.NEXT_PUBLIC_APP_URL]
        : []),
    ],
    session: {
      expiresIn: 60 * 60 * 24 * 7,
    },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
    },
    socialProviders: {
      ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            },
          }
        : {}),
    },
  })
}

/**
 * Returns the BetterAuth instance in live mode. In mock mode there is no
 * MongoDB connection to piggyback on, so callers keep using the mock store.
 */
export function betterAuthInstance() {
  if (isMockMode() || !process.env.MONGODB_URI) return null
  globalCache.__studioBetterAuth ??= createAuth()
  return globalCache.__studioBetterAuth
}
