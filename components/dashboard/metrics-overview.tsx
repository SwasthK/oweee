"use client"

import { LendMetrics } from "@/types/lend"
import { Card } from "@/components/ui/card"
import { CoinStack, CheckCircle, Clock } from "@/components/ui/icons"
import { getCurrencySymbol, DEFAULT_CURRENCY, formatMoney } from "@/lib/currency"
import { SettlementChart } from "./settlement-chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MetricsOverviewProps {
  metrics: LendMetrics
  currency?: string
  onCurrencyChange?: (currency: string) => void
  availableCurrencies?: string[]
}

export function MetricsOverview({
  metrics,
  currency = DEFAULT_CURRENCY,
  onCurrencyChange,
  availableCurrencies: propCurrencies,
}: MetricsOverviewProps) {
  const availableCurrencies =
    propCurrencies ||
    metrics.currencies ||
    Object.keys(metrics.byCurrency || {})

  const hasMultipleCurrencies = availableCurrencies.length > 1

  // Resolve the active currency to display (always exactly one currency, preventing layout growth)
  const activeCurrency =
    currency !== "all" && availableCurrencies.includes(currency)
      ? currency
      : availableCurrencies[0] || DEFAULT_CURRENCY

  const activeMetric = metrics.byCurrency?.[activeCurrency] || {
    currency: activeCurrency,
    totalLent: metrics.totalLent,
    totalPaid: metrics.totalPaid,
    totalOutstanding: metrics.totalOutstanding,
    activeCount: metrics.activeCount,
    closedCount: metrics.closedCount,
  }

  const total = activeMetric.totalLent
  const settled = activeMetric.totalPaid
  const totalCount = activeMetric.activeCount + activeMetric.closedCount
  const settledPercent =
    total > 0 ? Math.min(100, Math.round((settled / total) * 100)) : 0

  return (
    <Card className="relative overflow-hidden border-border/60 bg-card/50 p-5 transition-all hover:bg-card/60">
      {/* Top Header with Currency Chooser Dropdown if multiple exist */}
      {hasMultipleCurrencies && (
        <div className="mb-4 flex items-center justify-between border-b border-border/40 pb-3">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Financial Summary
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Currency:</span>
            <Select
              value={activeCurrency}
              onValueChange={(val) => {
                if (val) onCurrencyChange?.(val)
              }}
            >
              <SelectTrigger
                size="sm"
                className="h-8 rounded-lg border-border/60 bg-muted/40 px-2.5 text-xs font-medium text-foreground hover:bg-muted/60"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableCurrencies.map((c) => {
                  const sym = getCurrencySymbol(c)
                  const count =
                    (metrics.byCurrency?.[c]?.activeCount ?? 0) +
                    (metrics.byCurrency?.[c]?.closedCount ?? 0)
                  return (
                    <SelectItem key={c} value={c}>
                      {sym} {c} ({count} {count === 1 ? "lend" : "lends"})
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
        {/* Left Section: Financial Metrics & Progress Bar */}
        <div className="space-y-4 lg:col-span-8">
          {/* 3 Metric Figures */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Total Lent */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CoinStack className="size-3.5 text-muted-foreground/80" />
                <span className="font-medium">Total Lent</span>
              </div>
              <div className="flex h-8 items-center font-heading text-2xl font-bold tracking-tight text-foreground">
                {formatMoney(activeMetric.totalLent, activeCurrency)}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Across {totalCount} {activeCurrency}{" "}
                {totalCount === 1 ? "lend" : "lends"}
              </p>
            </div>

            {/* Total Settled */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle className="size-3.5 text-emerald-500/80" />
                <span className="font-medium">Total Settled</span>
              </div>
              <div className="flex h-8 items-center font-heading text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {formatMoney(activeMetric.totalPaid, activeCurrency)}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {activeMetric.closedCount} fully settled
              </p>
            </div>

            {/* Pending Balance */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5 text-amber-500/80" />
                <span className="font-medium">Pending Balance</span>
              </div>
              <div className="flex h-8 items-center font-heading text-2xl font-bold tracking-tight text-foreground">
                {formatMoney(activeMetric.totalOutstanding, activeCurrency)}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {activeMetric.activeCount} active
              </p>
            </div>
          </div>

          {/* Repayment Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{activeCurrency} Settlement Progress</span>
              <span className="font-mono font-medium text-foreground">
                {settledPercent}% recovered
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${settledPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Section: Compact Chart Inset Box */}
        <div className="flex flex-col items-center justify-center border-t border-border/50 pt-4 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
          <div className="w-full rounded-xl border border-border/40 bg-muted/20 p-3.5">
            <SettlementChart
              metrics={activeMetric}
              currency={activeCurrency}
              variant="embedded"
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
