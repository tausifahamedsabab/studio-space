import Link from "next/link"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import { getSessionUser } from "@/lib/auth"
import { UserMenu } from "./user-menu"

export async function HeaderAuth() {
  const user = await getSessionUser()

  if (!user) {
    return (
      <div className="flex items-center gap-1.5">
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "px-3")}
        >
          Log in
        </Link>
        <Link
          href="/register"
          className={cn(
            buttonVariants({ size: "lg" }),
            "px-4 shadow-sm shadow-amber-500/20"
          )}
        >
          Get started
        </Link>
      </div>
    )
  }

  return <UserMenu user={user} />
}

export function HeaderAuthFallback() {
  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      <div className="h-8 w-16 animate-pulse rounded-lg bg-muted" />
      <div className="h-8 w-24 animate-pulse rounded-lg bg-muted" />
    </div>
  )
}
