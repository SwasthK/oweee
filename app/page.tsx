import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getLends, getLendMetrics } from "@/lib/actions/lends"
import { Navbar } from "@/components/layout/navbar"
import { DashboardView } from "@/components/dashboard/dashboard-view"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CoinStack, CheckCircle, Clock, Bank } from "@/components/ui/icons"

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // If user is authenticated, fetch their live dashboard data
  let lendsList: Awaited<ReturnType<typeof getLends>> = []
  let metrics = {
    totalLent: 0,
    totalPaid: 0,
    totalOutstanding: 0,
    activeCount: 0,
    closedCount: 0,
  }

  if (session?.user) {
    lendsList = await getLends()
    metrics = await getLendMetrics()
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Navbar />

      <main className="flex flex-1 flex-col items-center px-4 py-8 sm:px-6 sm:py-10">
        {session?.user ? (
          <DashboardView
            initialLends={lendsList}
            metrics={metrics}
            userName={session.user.name}
          />
        ) : (
          <div className="my-auto flex w-full max-w-3xl flex-col items-center space-y-8 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
              <CoinStack className="size-3.5 text-foreground" />
              <span>Personal lending, tracked simply</span>
            </div>

            <div className="max-w-xl space-y-3">
              <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Never lose track of what friends owe you.
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Log loans, record partial repayments, maintain an immutable
                audit trail, and share single-item links without requiring
                anyone to register.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                render={<Link href="/register" />}
                className="h-10 px-5 text-sm shadow-xs"
              >
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
            <div className="mt-6 w-full max-w-md space-y-2.5 border-t border-border/40 pt-6 text-left">
              <div className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                Sample Lends
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/80 bg-card/60 p-3.5 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg border border-primary/10 bg-primary/5 text-primary">
                    <Bank className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-foreground">
                      Weekend Trip Airbnb
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Dave Miller • Due in 5 days
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-foreground">
                    $120.00
                  </div>
                  <Badge
                    variant="outline"
                    className="mt-0.5 h-4.5 px-1.5 text-[10px]"
                  >
                    <Clock className="mr-1 size-2.5" /> Open
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/80 bg-card/60 p-3.5 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg border border-primary/10 bg-primary/5 text-primary">
                    <CheckCircle className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-foreground">
                      Concert Tickets
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Sarah Jenkins • Settled
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-foreground">
                    $65.00
                  </div>
                  <Badge
                    variant="secondary"
                    className="mt-0.5 h-4.5 px-1.5 text-[10px]"
                  >
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
