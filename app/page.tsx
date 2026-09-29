import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CoinStack, CheckCircle, Clock, Bank } from "@/components/ui/icons"

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6">
        {session?.user ? (
          <div className="w-full max-w-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
              <div>
                <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                  Hello, {session.user.name}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your lends, track partial settlements, and share public links.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" className="gap-1.5 shadow-xs">
                  <CoinStack className="size-4" />
                  <span>New Lend</span>
                </Button>
              </div>
            </div>

            {/* Dashboard placeholder for Step 3 & 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card className="border-border/60 bg-card/40 p-4">
                <div className="text-xs text-muted-foreground font-medium">Total Lent</div>
                <div className="font-heading text-2xl font-semibold mt-1 text-foreground">$0.00</div>
              </Card>
              <Card className="border-border/60 bg-card/40 p-4">
                <div className="text-xs text-muted-foreground font-medium">Total Received</div>
                <div className="font-heading text-2xl font-semibold mt-1 text-foreground">$0.00</div>
              </Card>
              <Card className="border-border/60 bg-card/40 p-4">
                <div className="text-xs text-muted-foreground font-medium">Outstanding</div>
                <div className="font-heading text-2xl font-semibold mt-1 text-foreground">$0.00</div>
              </Card>
            </div>

            <div className="rounded-xl border border-dashed border-border/80 p-8 text-center bg-muted/10">
              <CoinStack className="mx-auto size-8 text-muted-foreground/60 mb-3" />
              <h3 className="text-sm font-medium text-foreground">No lends tracked yet</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Ready to track your first lend. We&apos;ll build the full lend management flow in the next step.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-3xl flex flex-col items-center text-center space-y-8">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
              <CoinStack className="size-3.5 text-foreground" />
              <span>Personal lending, tracked simply</span>
            </div>

            <div className="space-y-3 max-w-xl">
              <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                Never lose track of what friends owe you.
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Log loans, record partial repayments, maintain an immutable audit trail, and share single-item links without requiring anyone to register.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" render={<Link href="/register" />} className="h-10 px-5 text-sm shadow-xs">
                Start tracking for free
              </Button>
              <Button
                variant="outline"
                size="lg"
                render={<Link href="/login" />}
                className="h-10 px-5 text-sm"
              >
                Sign in
              </Button>
            </div>

            {/* Aesthetic Agentation-inspired Preview */}
            <div className="w-full max-w-md mt-6 pt-6 border-t border-border/40 text-left space-y-2.5">
              <div className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                Sample Lends
              </div>

              <div className="rounded-xl border border-border/80 bg-card/60 p-3.5 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/10">
                    <Bank className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-foreground">Weekend Trip Airbnb</div>
                    <div className="text-[11px] text-muted-foreground">Dave Miller • Due in 5 days</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-foreground">$120.00</div>
                  <Badge variant="outline" className="text-[10px] h-4.5 px-1.5 mt-0.5">
                    <Clock className="size-2.5 mr-1" /> Open
                  </Badge>
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-card/60 p-3.5 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/10">
                    <CheckCircle className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-foreground">Concert Tickets</div>
                    <div className="text-[11px] text-muted-foreground">Sarah Jenkins • Settled</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-foreground">$65.00</div>
                  <Badge variant="secondary" className="text-[10px] h-4.5 px-1.5 mt-0.5">
                    Settled
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
