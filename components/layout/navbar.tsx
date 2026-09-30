"use client"

import Link from "next/link"
import { useSession } from "@/lib/auth-client"
import { Logo } from "./logo"
import { ThemeToggle } from "./theme-toggle"
import { UserMenu } from "@/components/auth/user-menu"
import { Button } from "@/components/ui/button"
import { GithubIcon } from "@/components/ui/icons"

export function Navbar() {
  const { data: session, isPending } = useSession()

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between">
        <Logo />

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-xs"
            render={
              <a
                href="https://github.com/SwasthK/oweee"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
              />
            }
            className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <GithubIcon className="size-4" />
          </Button>

          <ThemeToggle />

          {!isPending && !session?.user && (
            <Button
              size="sm"
              render={<Link href="/login" />}
              className="text-xs"
            >
              Get Started
            </Button>
          )}

          {!isPending && session?.user && <UserMenu />}
        </div>
      </div>
    </header>
  )
}
