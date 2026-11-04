"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { toast } from "@/components/ui/toast"

export function StudioToast() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const created = searchParams.get("created")
    const updated = searchParams.get("updated")
    const deleted = searchParams.get("deleted") === "1"

    if (created) {
      toast.add({
        title: "Listing is live",
        description: "Your studio is now discoverable on the marketplace.",
        type: "success",
      })
    } else if (updated) {
      toast.add({
        title: "Listing updated",
        description: "Your changes are live on the marketplace.",
        type: "success",
      })
    } else if (deleted) {
      toast.add({
        title: "Listing removed",
        description: "The space is no longer visible on the marketplace.",
        type: "info",
      })
    } else {
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    params.delete("created")
    params.delete("updated")
    params.delete("deleted")
    const query = params.toString()
    router.replace(query ? `/my-listings?${query}` : "/my-listings")
  }, [router, searchParams])

  return null
}
