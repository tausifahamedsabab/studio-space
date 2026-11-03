"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { toast } from "@/components/ui/toast"

export function StudioToast() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (searchParams.get("created")) {
      toast.add({
        title: "Listing is live",
        description: "Your studio is now discoverable on the marketplace.",
        type: "success",
      })
      const params = new URLSearchParams(searchParams.toString())
      params.delete("created")
      const query = params.toString()
      router.replace(query ? `/dashboard/studios?${query}` : "/dashboard/studios")
    } else if (searchParams.get("deleted") === "1") {
      toast.add({
        title: "Listing removed",
        description: "The space is no longer visible on the marketplace.",
        type: "info",
      })
      const params = new URLSearchParams(searchParams.toString())
      params.delete("deleted")
      const query = params.toString()
      router.replace(query ? `/dashboard/studios?${query}` : "/dashboard/studios")
    }
  }, [router, searchParams])

  return null
}
