"use client"

import { Trash, TriangleAlert } from "lucide-react"

import { deleteStudioAction } from "@/actions/studios"
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

export function DeleteStudioButton({
  studioId,
  studioTitle,
}: {
  studioId: string
  studioTitle: string
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          />
        }
      >
        <Trash className="size-3.5" />
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <TriangleAlert />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete “{studioTitle}”?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the listing from the marketplace and cancels the
            ability to book it. Existing bookings are not deleted, but this
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep listing</AlertDialogCancel>
          <form action={deleteStudioAction}>
            <input type="hidden" name="studioId" value={studioId} />
            <AlertDialogAction
              type="submit"
              variant="destructive"
              className="w-full sm:w-auto"
            >
              <Trash className="size-4" />
              Delete listing
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
