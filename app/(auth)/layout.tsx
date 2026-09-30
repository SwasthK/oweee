import * as React from "react"
import Link from "next/link"
import { Logo } from "@/components/layout/logo"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { ArrowLeft } from "@/components/ui/icons"

import { Footer } from "@/components/layout/footer"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-svh flex flex-col justify-between bg-background">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to home</span>
        </Link>

        <ThemeToggle />
      </header>

      {/* Center Main */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6">
        <div className="flex w-full max-w-[400px] flex-col items-center gap-5">
          <Logo size="lg" />
          {children}
        </div>
      </main>

      {/* Unified Footer */}
      <Footer className="py-4 pb-4" />
    </div>
  )
}
