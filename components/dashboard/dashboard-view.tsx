"use client"

import * as React from "react"
import { Lend, LendMetrics, CurrencyMetric } from "@/types/lend"
import { DEFAULT_CURRENCY, getSavedCurrency, saveCurrency } from "@/lib/currency"
import { MetricsOverview } from "./metrics-overview"
import { FilterBar, StatusFilter } from "./filter-bar"
import { LendCard } from "./lend-card"
import { LendFormDialog } from "./lend-form-dialog"
import { PaymentDialog } from "./payment-dialog"
import { Button } from "@/components/ui/button"
import { CoinStack } from "@/components/ui/icons"

interface DashboardViewProps {
  initialLends: Lend[]
  metrics?: LendMetrics
  userName?: string
  defaultCurrency?: string
}

export function DashboardView({
  initialLends,
  userName,
  defaultCurrency,
}: DashboardViewProps) {
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("open")
  const [currencyFilter, setCurrencyFilter] = React.useState<string>(
    () => defaultCurrency || (typeof window !== "undefined" ? getSavedCurrency() : DEFAULT_CURRENCY)
  )
  const [search, setSearch] = React.useState("")
  const [paymentLend, setPaymentLend] = React.useState<Lend | null>(null)
  const [paymentOpen, setPaymentOpen] = React.useState(false)

  // Currencies present across lends
  const availableCurrencies = React.useMemo(() => {
    const set = new Set<string>()
    for (const l of initialLends) {
      if (l.currency) set.add(l.currency.toUpperCase())
    }
    return Array.from(set)
  }, [initialLends])

  // Recalculate per-currency metrics from live lends list
  const metrics: LendMetrics = React.useMemo(() => {
    const byCurrency: Record<string, CurrencyMetric> = {}
    let activeCount = 0
    let closedCount = 0

    for (const item of initialLends) {
      const amount = Number(item.amount) || 0
      const paid = Number(item.paidAmount) || 0
      const curr = (item.currency || DEFAULT_CURRENCY).toUpperCase()

      if (!byCurrency[curr]) {
        byCurrency[curr] = {
          currency: curr,
          totalLent: 0,
          totalPaid: 0,
          totalOutstanding: 0,
          activeCount: 0,
          closedCount: 0,
        }
      }

      byCurrency[curr].totalLent += amount
      byCurrency[curr].totalPaid += paid
      byCurrency[curr].totalOutstanding = Math.max(
        0,
        byCurrency[curr].totalLent - byCurrency[curr].totalPaid
      )

      if (item.status === "closed") {
        byCurrency[curr].closedCount++
        closedCount++
      } else {
        byCurrency[curr].activeCount++
        activeCount++
      }
    }

    const currencies = Object.keys(byCurrency)
    const primaryCurrency = currencies[0] || DEFAULT_CURRENCY
    const primaryMetric = byCurrency[primaryCurrency] || {
      currency: primaryCurrency,
      totalLent: 0,
      totalPaid: 0,
      totalOutstanding: 0,
      activeCount: 0,
      closedCount: 0,
    }

    return {
      totalLent: primaryMetric.totalLent,
      totalPaid: primaryMetric.totalPaid,
      totalOutstanding: primaryMetric.totalOutstanding,
      activeCount,
      closedCount,
      byCurrency,
      currencies,
      primaryCurrency,
    }
  }, [initialLends])

  // Search and currency matches across all lends
  const searchMatches = React.useMemo(() => {
    return initialLends.filter((item) => {
      const matchesCurrency =
        currencyFilter === "all" ||
        (item.currency || DEFAULT_CURRENCY).toUpperCase() ===
          currencyFilter.toUpperCase()
      if (!matchesCurrency) return false

      if (!search.trim()) return true
      const query = search.toLowerCase().trim()
      const matchesBorrower = item.borrowerName.toLowerCase().includes(query)
      const matchesNotes = item.notes?.toLowerCase().includes(query) || false
      return matchesBorrower || matchesNotes
    })
  }, [initialLends, search, currencyFilter])

  // Status counts based on current search query and currency filter
  const counts = React.useMemo(() => {
    return {
      open: searchMatches.filter(
        (l) => l.status === "open" || l.status === "partial"
      ).length,
      closed: searchMatches.filter((l) => l.status === "closed").length,
      all: searchMatches.length,
    }
  }, [searchMatches])

  // Filtered lends list (applies active status tab over search & currency matches)
  const filteredLends = React.useMemo(() => {
    return searchMatches.filter((item) => {
      if (statusFilter === "open") {
        return item.status === "open" || item.status === "partial"
      }
      if (statusFilter === "closed") {
        return item.status === "closed"
      }
      return true
    })
  }, [searchMatches, statusFilter])

  const handleOpenPayment = (lend: Lend) => {
    setPaymentLend(lend)
    setPaymentOpen(true)
  }

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrencyFilter(newCurrency)
    if (newCurrency && newCurrency !== "all") {
      saveCurrency(newCurrency)
    }
  }

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/50 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            {userName ? `Welcome back, ${userName}` : "Your Lends"}
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Track money lent, log partial payments, and manage transparent audit
            trails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <LendFormDialog
            defaultCurrency={
              currencyFilter !== "all" ? currencyFilter : defaultCurrency
            }
          />
        </div>
      </div>

      {/* Metrics Stat Cards */}
      <MetricsOverview
        metrics={metrics}
        currency={currencyFilter}
        onCurrencyChange={handleCurrencyChange}
        availableCurrencies={availableCurrencies}
      />

      {/* Search and Filters */}
      <div className="pt-2">
        <FilterBar
          status={statusFilter}
          onStatusChange={setStatusFilter}
          search={search}
          onSearchChange={setSearch}
          counts={counts}
          currency={currencyFilter}
          onCurrencyChange={handleCurrencyChange}
          availableCurrencies={availableCurrencies}
        />
      </div>

      {/* Lends List */}
      <div className="space-y-3 pt-1">
        {filteredLends.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {filteredLends.map((lend) => (
              <LendCard
                key={lend.id}
                lend={lend}
                onRecordPayment={handleOpenPayment}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/80 bg-muted/10 p-10 text-center">
            <CoinStack className="mx-auto mb-3 size-9 text-muted-foreground/50" />
            <h3 className="text-sm font-medium text-foreground">
              {initialLends.length === 0
                ? "No lends recorded yet"
                : search.trim()
                  ? searchMatches.length === 0
                    ? `No lends match "${search.trim()}"`
                    : `No ${statusFilter === "open" ? "open" : "settled"} lends match "${search.trim()}"`
                  : statusFilter === "open"
                    ? "No open lends right now"
                    : `No ${statusFilter} lends found`}
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
              {initialLends.length === 0
                ? "Click the 'New Lend' button above to track your first loan to a friend."
                : search.trim()
                  ? searchMatches.length === 0
                    ? "We couldn't find any lend records matching your search. Check for typos or clear your search."
                    : `Found ${searchMatches.length} matching ${searchMatches.length === 1 ? "record" : "records"} under other tabs.`
                  : statusFilter === "open" && initialLends.length > 0
                    ? "All your recorded lends are settled. Switch to Settled or All to see them."
                    : "Try switching tabs to see other records."}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {initialLends.length === 0 ? (
                <LendFormDialog />
              ) : search.trim() ? (
                searchMatches.length > 0 ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStatusFilter("all")}
                      className="text-xs cursor-pointer"
                    >
                      View in All ({searchMatches.length})
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearch("")}
                      className="text-xs cursor-pointer"
                    >
                      Clear search
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearch("")}
                    className="text-xs cursor-pointer"
                  >
                    Clear search
                  </Button>
                )
              ) : (
                <>
                  {statusFilter !== "all" && initialLends.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStatusFilter("all")}
                      className="text-xs cursor-pointer"
                    >
                      View All ({initialLends.length})
                    </Button>
                  )}
                  {currencyFilter !== "all" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrencyFilter("all")}
                      className="text-xs cursor-pointer"
                    >
                      View All currencies
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentDialog
        lend={paymentLend}
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
      />
    </div>
  )
}
