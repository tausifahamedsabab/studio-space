import { Suspense } from "react"

import { HeaderAuth, HeaderAuthFallback } from "./header-auth"
import { HeaderShell } from "./header-shell"

export function SiteHeader() {
  return (
    <HeaderShell
      auth={
        <Suspense fallback={<HeaderAuthFallback />}>
          <HeaderAuth />
        </Suspense>
      }
    />
  )
}
