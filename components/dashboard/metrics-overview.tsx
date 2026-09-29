import { LendMetrics } from "@/types/lend"
import { Card } from "@/components/ui/card"
import { CoinStack, CheckCircle, Clock } from "@/components/ui/icons"

interface MetricsOverviewProps {
  metrics: LendMetrics
  currency?: string
}

export function MetricsOverview({ metrics, currency = "$" }: MetricsOverviewProps) {
  const formatMoney = (val: number) => {
    return `${currency}${val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {/* Total Lent */}
      <Card className="relative overflow-hidden border-border/60 bg-card/50 p-4 transition-all hover:bg-card/70">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">Total Lent</span>
          <CoinStack className="size-4 text-muted-foreground/80" />
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground font-heading">
          {formatMoney(metrics.totalLent)}
        </div>
        <div className="mt-1 text-[11px] text-muted-foreground">
          Across {metrics.activeCount + metrics.closedCount} {metrics.activeCount + metrics.closedCount === 1 ? "lend" : "lends"}
        </div>
      </Card>

      {/* Total Received */}
      <Card className="relative overflow-hidden border-border/60 bg-card/50 p-4 transition-all hover:bg-card/70">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">Total Settled</span>
          <CheckCircle className="size-4 text-emerald-500/80" />
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400 font-heading">
          {formatMoney(metrics.totalPaid)}
        </div>
        <div className="mt-1 text-[11px] text-muted-foreground">
          {metrics.closedCount} fully settled
        </div>
      </Card>

      {/* Outstanding Balance */}
      <Card className="relative overflow-hidden border-border/60 bg-card/50 p-4 transition-all hover:bg-card/70">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">Pending Balance</span>
          <Clock className="size-4 text-amber-500/80" />
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground font-heading">
          {formatMoney(metrics.totalOutstanding)}
        </div>
        <div className="mt-1 text-[11px] text-muted-foreground">
          {metrics.activeCount} currently active
        </div>
      </Card>
    </div>
  )
}
