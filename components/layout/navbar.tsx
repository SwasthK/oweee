"use client"

import Link from "next/link"
import { useSession } from "@/lib/auth-client"
import { Logo } from "./logo"
import { ThemeToggle } from "./theme-toggle"
import { UserMenu } from "@/components/auth/user-menu"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const { data: session, isPending } = useSession()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {!isPending && !session?.user && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                render={<Link href="/login" />}
                className="text-xs"
              >
                Sign in
              </Button>
              <Button
                size="sm"
                render={<Link href="/register" />}
                className="text-xs"
              >
                Get Started
              </Button>
            </div>
          )}

          {!isPending && session?.user && <UserMenu />}
        </div>
      </div>
    </header>
  )
}
