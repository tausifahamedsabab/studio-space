# StudioSpace

StudioSpace is a peer-to-peer marketplace for booking creative spaces by the hour — photo studios, sound stages, podcast rooms, music suites, and art workshops. This repository is the Next.js frontend for the project.

The app is designed to work in two modes:

- **Mock mode (default)** — a development-only, in-memory adapter with seeded studios, users, and bookings. No backend is required.
- **Live mode** — talks to the Express/MongoDB API in the sibling `studio-space-server` repository through HTTP-only session cookies.

> **Live site:** _add the deployed URL here before submitting._

## Features

- Browse and filter studios by category, city, price, and rating
- Studio detail pages with galleries, amenities, house rules, reviews, and a booking calendar
- Booking requests with availability checks, service fees, and refundable security deposits
- Email/password registration and login, plus Google OAuth entry points when the API is live
- Host dashboard: overview, my listings, add studio, edit studio, delete listing
- Guest dashboard: my bookings with pending, confirmed, completed, and cancelled states
- Direct image uploads from the browser to imgbb
- Responsive UI built on Tailwind CSS v4 and shadcn `base-nova` / Base UI primitives
- Toast and modal feedback instead of browser alerts

## Routes

| Route                     | Description                      |
| ------------------------- | -------------------------------- |
| `/`                       | Marketing home page              |
| `/studios`                | Searchable studio marketplace    |
| `/studios/[id]`           | Studio detail and booking widget |
| `/studios/edit/[id]`      | Edit one of your listings        |
| `/login`, `/register`     | Authentication                   |
| `/dashboard`              | Account overview                 |
| `/add-studio`             | Create a listing                 |
| `/my-listings`            | Manage your listings             |
| `/my-bookings`            | Manage your bookings             |
| `/about`, `/how-it-works` | Informational pages              |

The legacy dashboard routes (`/dashboard/studios`, `/dashboard/studios/new`, `/dashboard/bookings`) redirect to the canonical routes above.

## Tech stack

- Next.js 16 App Router (Cache Components, typed routes, React Compiler)
- React 19
- TypeScript
- Tailwind CSS v4 (CSS-first configuration in `src/app/globals.css`)
- shadcn `base-nova` components on Base UI primitives
- Swiper, lucide-react, date-fns
- Express + MongoDB backend in `studio-space-server` (not part of this repository)

## Getting started

Use npm — `package-lock.json` is the only lockfile.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

### Demo account (mock mode)

```text
Email:    demo@studiospace.com
Password: studio123
```

The other seeded hosts (`maya@studiospace.com`, `theo@studiospace.com`, `nina@studiospace.com`) use the same password.

## Environment variables

Copy `.env.example` to `.env.local` and adjust as needed.

| Variable                                   | Default                                         | Purpose                                                                                                                      |
| ------------------------------------------ | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `API_MODE`                                 | `mock`                                          | Set to `live` to use the Express API; anything else keeps mock mode.                                                         |
| `API_BASE_URL`                             | `https://studio-space-server-smoky.vercel.app/` | Server-side base URL for the Express API.                                                                                    |
| `NEXT_PUBLIC_API_URL`                      | falls back to `API_BASE_URL`                    | Kept for local compatibility; `API_BASE_URL` takes precedence.                                                               |
| `NEXT_PUBLIC_IMGBB_API_KEY`                | empty                                           | Enables direct browser uploads to imgbb. Without it, the form falls back to pasting image URLs.                              |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | empty                                           | Enables the Google sign-in buttons (`/api/auth/google`). The authorized redirect URI is `<origin>/api/auth/google/callback`. |

`API_MODE`, `API_BASE_URL`, and `NEXT_PUBLIC_IMGBB_API_KEY` in `next.config.ts` are read when the dev server starts, so restart after changing them.

### Mock mode

Mock mode is the default. Data lives in memory on the server (`src/lib/api/mock/store.ts`) and resets when the dev server restarts. Auth uses an HTTP-only `studiospace_session` cookie containing a mock user token. Uploads to imgbb still work if `NEXT_PUBLIC_IMGBB_API_KEY` is set.

### Live mode

Set `API_MODE=live` in `.env.local` and start the Express API:

```bash
# in C:\projects\studio-space-server
npm install
npm run dev
```

Live-mode API requests are made server-side to `${API_BASE_URL}/api/*`. Login copies the API's `Set-Cookie` header onto the Next.js response, keeping the signed JWT session cookie HTTPOnly and first-party. Each request resolves the session with `GET /api/auth/me`.

The API is expected to expose:

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/google        # receives the verified Google ID token

GET    /api/studios
GET    /api/studios/featured
GET    /api/studios/mine
GET    /api/studios/cities
GET    /api/studios/categories
GET    /api/studios/:id
GET    /api/studios/:id/availability
GET    /api/studios/:id/reviews
POST   /api/studios
PATCH  /api/studios/:id
DELETE /api/studios/:id

GET    /api/bookings/mine
POST   /api/bookings
POST   /api/bookings/:id/cancel
```

Error responses use `{ "message": string, "fieldErrors"?: Record<string, string> }` with `400`, `401`, `403`, `404`, `409`, or `500` status codes. New bookings are created with `pending` status; only `confirmed` bookings block availability.

## Scripts

```bash
npm run dev       # Turbopack dev server on :3000
npm run lint      # ESLint
npm run build     # Production build (also type-checks)
npm start         # Run the production build
npx tsc --noEmit  # Standalone type check
```

A few lint errors exist in generated UI components (`carousel.tsx`, `use-mobile.ts`) and are unrelated to the application code.

## Project structure

```text
src/
  actions/           # Thin server actions that proxy the API layer
  app/               # App Router routes
  components/        # UI, auth, dashboard, home, and studio components
  lib/
    api/             # HTTP client, mappers, mock adapter, live services
    auth.ts          # Session facade (mock/live)
    data.ts          # Data facade used by server components
    imgbb.ts         # Browser-side imgbb upload helper
```
