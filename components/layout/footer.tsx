import * as React from "react"
import { HeartIcon } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground pb-4 sm:flex-row sm:gap-3",
        className
      )}
    >
      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <span>Made with</span>
        <HeartIcon className="size-3 text-rose-500 fill-rose-500 inline-block" />
        <span>by</span>
        <a
          href="http://swasthk.space/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
        >
          Swasthik
        </a>
      </p>
      <span className="hidden text-border sm:inline">•</span>
      <p className="text-[11px] text-muted-foreground/80">
        © {new Date().getFullYear()} Oweee. All rights reserved.
      </p>
    </footer>
  )
}
