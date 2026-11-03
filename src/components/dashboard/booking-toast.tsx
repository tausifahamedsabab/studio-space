"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { toast } from "@/components/ui/toast"

export function BookingToast() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (searchParams.get("booked")) {
      toast.add({
        title: "Session confirmed",
        description: "Your booking is confirmed. Details are in your dashboard.",
        type: "success",
      })
      const params = new URLSearchParams(searchParams.toString())
      params.delete("booked")
      const query = params.toString()
      router.replace(query ? `/dashboard/bookings?${query}` : "/dashboard/bookings")
    } else if (searchParams.get("cancelled") === "1") {
      toast.add({
        title: "Booking cancelled",
        description: "The hours have been released back to the host.",
        type: "info",
      })
      const params = new URLSearchParams(searchParams.toString())
      params.delete("cancelled")
      const query = params.toString()
      router.replace(query ? `/dashboard/bookings?${query}` : "/dashboard/bookings")
    }
  }, [router, searchParams])

  return null
}
