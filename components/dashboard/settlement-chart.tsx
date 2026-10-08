"use client"

import * as React from "react"
import { Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card } from "@/components/ui/card"
import { ChartPie } from "@/components/ui/icons"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LendMetrics } from "@/types/lend"
import { getCurrencySymbol, DEFAULT_CURRENCY } from "@/lib/currency"
import { cn } from "@/lib/utils"

interface SettlementChartProps {
  metrics: LendMetrics
  currency?: string
  className?: string
  variant?: "card" | "embedded"
  isAllCurrencies?: boolean
}

const chartConfig = {
  settled: {
    label: "Settled",
    theme: {
      light: "#10b981", // emerald-500
      dark: "#34d399", // emerald-400
    },
  },
  pending: {
    label: "Pending",
    theme: {
      light: "#f59e0b", // amber-500
      dark: "#fbbf24", // amber-400
    },
  },
} satisfies ChartConfig

const emptySubscribe = () => () => {}

export function SettlementChart({
  metrics,
  currency = DEFAULT_CURRENCY,
  className,
  variant = "card",
  isAllCurrencies = false,
}: SettlementChartProps) {
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const symbol = getCurrencySymbol(currency)
  const formatMoney = (val: number) => {
    return `${symbol}${val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const totalCount = metrics.activeCount + metrics.closedCount
  const total = isAllCurrencies ? totalCount : metrics.totalLent
  const settled = isAllCurrencies ? metrics.closedCount : metrics.totalPaid
  const pending = isAllCurrencies
    ? metrics.activeCount
    : metrics.totalOutstanding
  const hasData = total > 0
  const settledPercent = hasData
    ? Math.min(100, Math.round((settled / total) * 100))
    : 0

  const chartData = hasData
    ? [
        {
          status: "settled",
          amount: settled,
          fill: "var(--color-settled)",
        },
        {
          status: "pending",
          amount: pending,
          fill: "var(--color-pending)",
        },
      ]
    : [
        {
          status: "empty",
          amount: 1,
          fill: "currentColor",
        },
      ]

  const chartInner = (
    <div
      className={cn(
        "flex flex-col justify-between",
        variant === "card" ? "h-full w-full" : "w-full",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <Tooltip>
          <TooltipTrigger
            render={
              <span className="flex cursor-default items-center gap-1.5 font-medium hover:text-foreground">
                <span>Recovery Rate</span>
              </span>
            }
          />
          <TooltipContent>
            {isAllCurrencies
              ? "Percentage of lends settled across all currencies"
              : `Percentage of ${currency} lent funds settled`}
          </TooltipContent>
        </Tooltip>
        <div className="flex items-center gap-1">
          <ChartPie className="size-3.5 text-muted-foreground/80" />
        </div>
      </div>

      {/* Donut Chart with Center Percentage */}
      <div className="relative my-1 flex h-[76px] w-full items-center justify-center">
        {mounted ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-square h-[76px] w-[76px]"
          >
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              {hasData && (
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value, name) => (
                        <div className="flex items-center gap-1.5 font-medium">
                          <span className="text-muted-foreground capitalize">
                            {name === "settled" ? "Settled:" : "Pending:"}
                          </span>
                          <span className="font-mono font-semibold text-foreground">
                            {isAllCurrencies
                              ? `${value} ${Number(value) === 1 ? "lend" : "lends"}`
                              : formatMoney(Number(value))}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
              )}
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="status"
                innerRadius={23}
                outerRadius={34}
                strokeWidth={1.5}
                stroke="var(--color-card)"
                startAngle={90}
                endAngle={-270}
                className={!hasData ? "text-muted/40" : undefined}
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="size-[68px] rounded-full border-[7px] border-muted/50" />
        )}

        {/* Center Percentage Display */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-heading text-sm leading-none font-bold tracking-tight text-foreground">
            {hasData ? `${settledPercent}%` : "0%"}
          </span>
          <span className="mt-0.5 text-[9px] leading-tight font-medium text-muted-foreground">
            {hasData
              ? isAllCurrencies
                ? `${settled}/${total}`
                : "Settled"
              : "No lends"}
          </span>
        </div>
      </div>

      {/* Legend Footer */}
      <div className="flex items-center justify-center gap-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
          <span>Settled</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="size-1.5 shrink-0 rounded-full bg-amber-500" />
          <span>Pending</span>
        </div>
      </div>
    </div>
  )

  if (variant === "embedded") {
    return chartInner
  }

  return (
    <Card
      className={cn(
        "relative flex flex-col justify-between overflow-hidden border-border/60 bg-card/50 p-4 transition-all hover:bg-card/70",
        className
      )}
    >
      {chartInner}
    </Card>
  )
}
