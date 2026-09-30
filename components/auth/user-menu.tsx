"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "@/lib/auth-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { User as UserIcon, Dashboard } from "@/components/ui/icons"

export function UserMenu() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [signingOut, setSigningOut] = React.useState(false)

  if (isPending) {
    return <Skeleton className="h-8 w-28 rounded-full" />
  }

  if (!session?.user) {
    return null
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
    router.push("/login")
    router.refresh()
  }

  const initials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="group flex cursor-pointer items-center gap-2 rounded-full border border-border/70 bg-card/60 py-1 pr-2.5 pl-1 text-xs transition-colors hover:border-border hover:bg-muted/60 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none"
          >
            <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
              {session.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="size-6 rounded-full object-cover"
                />
              ) : initials ? (
                <span>{initials}</span>
              ) : (
                <UserIcon className="size-3" />
              )}
            </div>
            <span className="hidden max-w-[120px] truncate font-medium text-foreground sm:inline-block">
              {session.user.name || session.user.email}
            </span>
          </button>
        }
      />

      <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-xl">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5">
            <div className="flex flex-col space-y-0.5">
              <p className="text-xs font-semibold text-foreground">
                {session.user.name}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            render={
              <Link href="/" className="flex items-center gap-2 w-full text-xs">
                <Dashboard className="size-3.5 text-muted-foreground" />
                <span>Dashboard</span>
              </Link>
            }
          />
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1" />

        <div className="px-2 py-1 text-[11px] text-muted-foreground flex items-center justify-between">
          <span>Theme toggle</span>
          <kbd className="rounded border border-border px-1 py-0.5 text-[10px] font-mono">
            d
          </kbd>
        </div>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          variant="destructive"
          onClick={handleSignOut}
          disabled={signingOut}
          className="text-xs"
        >
          {signingOut ? (
            <span className="flex items-center gap-1.5">
              <Spinner size="xs" />
              <span>Signing out...</span>
            </span>
          ) : (
            <span>Sign out</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
