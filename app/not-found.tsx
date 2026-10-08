import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bank, CoinStack } from "@/components/ui/icons"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Navbar />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-24">
        <div className="flex max-w-md flex-col items-center space-y-6">
          {/* Oweee Mascot */}
          <div className="flex size-20 items-center justify-center rounded-2xl border border-border/60 bg-card p-3 shadow-xs transition-transform hover:scale-105 hover:rotate-3">
            <Image
              src="/logo/oweee.png"
              alt="Oweee mascot"
              width={64}
              height={64}
              style={{ width: "auto", height: "auto" }}
              className="object-contain"
              priority
            />
          </div>

          {/* 404 Badge & Heading */}
          <div className="space-y-2">
            <Badge
              variant="outline"
              className="h-5 border-border/70 bg-muted/30 px-2 font-mono text-[10px] tracking-wider text-muted-foreground uppercase"
            >
              404 · Not Found
            </Badge>

            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Lost in the ledger?
            </h1>

            <p className="text-xs text-muted-foreground sm:text-sm">
              We couldn&apos;t find the page or lend record you&apos;re looking
              for. It may have been removed, closed, or the link could be
              incorrect.
            </p>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <Button
              size="sm"
              render={<Link href="/" />}
              className="gap-1.5 text-xs shadow-xs"
            >
              <Bank className="size-3.5" />
              <span>Back to Dashboard</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              render={<Link href="/" />}
              className="gap-1.5 text-xs"
            >
              <CoinStack className="size-3.5" />
              <span>Browse Lends</span>
            </Button>
          </div>
        </div>
      </main>
      <Footer className="pb-6" />
    </div>
  )
}
