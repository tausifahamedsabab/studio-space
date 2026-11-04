"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { toast } from "@/components/ui/toast"

export function BookingToast() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const booked = searchParams.get("booked")
    const cancelled = searchParams.get("cancelled") === "1"

    if (booked) {
      toast.add({
        title: "Booking requested",
        description:
          "Your session is pending host approval. You will see the status update here.",
        type: "success",
      })
    } else if (cancelled) {
      toast.add({
        title: "Booking cancelled",
        description: "The hours have been released back to the host.",
        type: "info",
      })
    } else {
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    params.delete("booked")
    params.delete("cancelled")
    const query = params.toString()
    router.replace(query ? `/my-bookings?${query}` : "/my-bookings")
  }, [router, searchParams])

  return null
}
