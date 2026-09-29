"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { User as UserIcon } from "@/components/ui/icons"

export function UserMenu() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [signingOut, setSigningOut] = React.useState(false)

  if (isPending) {
    return (
      <div className="size-8 animate-pulse rounded-full border border-border bg-muted/60" />
    )
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
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 pl-2">
        <div className="flex size-7 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-medium text-primary">
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="size-7 rounded-full object-cover"
            />
          ) : initials ? (
            <span>{initials}</span>
          ) : (
            <UserIcon className="size-3.5" />
          )}
        </div>
        <div className="hidden flex-col text-left sm:flex">
          <span className="text-xs leading-none font-medium text-foreground">
            {session.user.name}
          </span>
          <span className="mt-0.5 max-w-[140px] truncate text-[10px] leading-none text-muted-foreground">
            {session.user.email}
          </span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="xs"
        className="rounded-md text-xs text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        onClick={handleSignOut}
        disabled={signingOut}
      >
        {signingOut ? "..." : "Sign out"}
      </Button>
    </div>
  )
}
