"use client"

import Link from "next/link"
import { CoinStack } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2 group select-none", className)}>
      <div className="flex size-8 items-center justify-center rounded-lg border border-border/80 bg-muted/60 text-foreground transition-colors group-hover:bg-muted group-hover:border-foreground/20">
        <CoinStack className="size-4.5 text-foreground" />
      </div>
      <div className="flex flex-col">
        <span className="font-heading text-sm font-semibold tracking-tight text-foreground">
          Oweee
        </span>
      </div>
    </Link>
  )
}
