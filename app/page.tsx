import { headers, cookies } from "next/headers"
import { auth } from "@/lib/auth"
import { getLends, getLendMetrics } from "@/lib/actions/lends"
import { Navbar } from "@/components/layout/navbar"
import { DashboardView } from "@/components/dashboard/dashboard-view"
import { LandingView } from "@/components/landing/landing-view"
import { LendMetrics } from "@/types/lend"
import { DEFAULT_CURRENCY, DEFAULT_CURRENCY_STORAGE_KEY } from "@/lib/currency"

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const cookieStore = await cookies()
  const defaultCurrency =
    cookieStore.get(DEFAULT_CURRENCY_STORAGE_KEY)?.value || DEFAULT_CURRENCY

  // If user is authenticated, fetch their live dashboard data
  let lendsList: Awaited<ReturnType<typeof getLends>> = []
  let metrics: LendMetrics = {
    totalLent: 0,
    totalPaid: 0,
    totalOutstanding: 0,
    activeCount: 0,
    closedCount: 0,
    byCurrency: {},
    currencies: [],
    primaryCurrency: defaultCurrency,
  }

  if (session?.user) {
    lendsList = await getLends()
    metrics = await getLendMetrics()
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Navbar />

      <main className="flex flex-1 flex-col items-center px-4 sm:px-6">
        {session?.user ? (
          <DashboardView
            initialLends={lendsList}
            metrics={metrics}
            userName={session.user.name}
            defaultCurrency={defaultCurrency}
          />
        ) : (
          <LandingView />
        )}
      </main>
    </div>
  )
}
