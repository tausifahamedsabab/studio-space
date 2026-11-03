"use client"

import { CalendarX, TriangleAlert } from "lucide-react"

import { cancelBookingAction } from "@/actions/bookings"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function CancelBookingButton({
  bookingId,
  studioTitle,
  dateLabel,
}: {
  bookingId: string
  studioTitle: string
  dateLabel: string
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground hover:border-destructive/40 hover:text-destructive"
          />
        }
      >
        Cancel
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <CalendarX />
          </AlertDialogMedia>
          <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
          <AlertDialogDescription>
            Your session at <span className="font-medium text-foreground">{studioTitle}</span>{" "}
            on {dateLabel} will be released back to the host. You can rebook
            another time from the studio page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep booking</AlertDialogCancel>
          <form action={cancelBookingAction}>
            <input type="hidden" name="bookingId" value={bookingId} />
            <AlertDialogAction
              type="submit"
              variant="destructive"
              className="w-full sm:w-auto"
            >
              <TriangleAlert className="size-4" />
              Cancel booking
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
