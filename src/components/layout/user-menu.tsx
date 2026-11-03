"use client"

import Link from "next/link"
import {
  CalendarCheck,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Plus,
  Store,
} from "lucide-react"

import { logoutAction } from "@/actions/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getInitials } from "@/lib/format"
import type { PublicUser } from "@/lib/types"

export function UserMenu({ user }: { user: PublicUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label="Open account menu"
            className="flex items-center gap-2 rounded-full border border-border/80 bg-card py-1 pr-2 pl-1 shadow-sm transition-colors hover:bg-muted"
          />
        }
      >
        <Avatar size="sm">
          {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-24 truncate text-sm font-medium lg:block">
          {user.name.split(" ")[0]}
        </span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-64">
        <DropdownMenuLabel className="px-2 py-2">
          <span className="block truncate text-sm font-medium text-foreground">
            {user.name}
          </span>
          <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/dashboard" />}>
          <LayoutDashboard />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/dashboard/studios/new" />}>
          <Plus />
          Add New Studio
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/dashboard/studios" />}>
          <Store />
          My Studio Listings
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/dashboard/bookings" />}>
          <CalendarCheck />
          My Bookings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={logoutAction}>
          <DropdownMenuItem
            variant="destructive"
            render={<button type="submit" className="w-full" />}
          >
            <LogOut />
            Log out
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
