"use client"

import * as React from "react"
import { Lend, LendMetrics } from "@/types/lend"
import { MetricsOverview } from "./metrics-overview"
import { FilterBar, StatusFilter } from "./filter-bar"
import { LendCard } from "./lend-card"
import { LendFormDialog } from "./lend-form-dialog"
import { PaymentDialog } from "./payment-dialog"
import { CoinStack } from "@/components/ui/icons"

interface DashboardViewProps {
  initialLends: Lend[]
  metrics: LendMetrics
  userName?: string
}

export function DashboardView({
  initialLends,
  metrics,
  userName,
}: DashboardViewProps) {
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all")
  const [search, setSearch] = React.useState("")
  const [paymentLend, setPaymentLend] = React.useState<Lend | null>(null)
  const [paymentOpen, setPaymentOpen] = React.useState(false)

  // Status counts calculation
  const counts = React.useMemo(() => {
    return {
      all: initialLends.length,
      open: initialLends.filter((l) => l.status === "open").length,
      partial: initialLends.filter((l) => l.status === "partial").length,
      closed: initialLends.filter((l) => l.status === "closed").length,
    }
  }, [initialLends])

  // Filtered lends list
  const filteredLends = React.useMemo(() => {
    return initialLends.filter((item) => {
      // Status filter
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false
      }

      // Search term filter
      if (search.trim()) {
        const query = search.toLowerCase()
        const matchesBorrower = item.borrowerName.toLowerCase().includes(query)
        const matchesNotes = item.notes?.toLowerCase().includes(query) || false
        if (!matchesBorrower && !matchesNotes) {
          return false
        }
      }

      return true
    })
  }, [initialLends, statusFilter, search])

  const handleOpenPayment = (lend: Lend) => {
    setPaymentLend(lend)
    setPaymentOpen(true)
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
          <LendFormDialog />
        </div>
      </div>

      {/* Metrics Stat Cards */}
      <MetricsOverview metrics={metrics} />

      {/* Search and Filters */}
      <div className="pt-2">
        <FilterBar
          status={statusFilter}
          onStatusChange={setStatusFilter}
          search={search}
          onSearchChange={setSearch}
          counts={counts}
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
              {search || statusFilter !== "all"
                ? "No lends match your current filter"
                : "No lends recorded yet"}
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
              {search || statusFilter !== "all"
                ? "Try clearing your search or status filter to see more items."
                : "Click the 'New Lend' button above to track your first loan to a friend."}
            </p>
            {!(search || statusFilter !== "all") && (
              <div className="mt-4">
                <LendFormDialog />
              </div>
            )}
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
