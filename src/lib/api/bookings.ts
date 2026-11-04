import type { Booking, Studio } from "@/lib/types"

import { isMockMode } from "./config"
import { apiFetch, apiRequest } from "./client"
import { isApiError } from "./errors"
import { mapBooking, unwrapList, unwrapObject } from "./mappers"
import {
  mockCancelBooking,
  mockCreateBooking,
  mockGetBookingsForUser,
} from "./mock/store"

export async function getBookingsForUser(userId: string): Promise<Booking[]> {
  if (isMockMode()) return mockGetBookingsForUser(userId)

  const body = await apiFetch<unknown>("/bookings/mine")
  return unwrapList(body, mapBooking)
}

export async function createBooking(input: {
  studio: Studio
  userId: string
  userName: string
  date: string
  startTime: string
  hours: number
  total: number
}): Promise<Booking> {
  if (isMockMode()) return mockCreateBooking(input)

  const body = await apiFetch<unknown>("/bookings", {
    method: "POST",
    body: JSON.stringify({
      studioId: input.studio.id,
      date: input.date,
      startTime: input.startTime,
      hours: input.hours,
    }),
  })
  return unwrapObject(body, mapBooking)
}

export async function cancelBooking(
  bookingId: string,
  userId: string
): Promise<boolean> {
  if (isMockMode()) return mockCancelBooking(bookingId, userId)

  try {
    await apiRequest(`/bookings/${encodeURIComponent(bookingId)}/cancel`, {
      method: "POST",
    })
    return true
  } catch (error) {
    if (isApiError(error) && error.status === 404) return false
    throw error
  }
}
