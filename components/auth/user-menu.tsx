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
      <div className="size-8 rounded-full bg-muted/60 animate-pulse border border-border" />
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
        <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium">
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
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-medium leading-none text-foreground">
            {session.user.name}
          </span>
          <span className="text-[10px] text-muted-foreground leading-none mt-0.5 truncate max-w-[140px]">
            {session.user.email}
          </span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="xs"
        className="text-xs text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-md"
        onClick={handleSignOut}
        disabled={signingOut}
      >
        {signingOut ? "..." : "Sign out"}
      </Button>
    </div>
  )
}
