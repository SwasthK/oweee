import { LendAuditLog, AuditLogDetails } from "@/types/lend"
import { Badge } from "@/components/ui/badge"
import {
  CoinStack,
  CheckCircle,
  Clock,
  Clipboard,
  ShareIcon,
  TrashIcon,
} from "@/components/ui/icons"
import { DEFAULT_CURRENCY, formatMoney } from "@/lib/currency"
import { cn } from "@/lib/utils"

interface AuditTimelineProps {
  logs: LendAuditLog[]
  currency?: string
}

export function AuditTimeline({ logs, currency = DEFAULT_CURRENCY }: AuditTimelineProps) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 py-8 text-center">
        <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Clipboard className="size-4" />
        </div>
        <p className="mt-2 text-xs font-medium text-foreground">No activity recorded yet</p>
        <p className="text-[11px] text-muted-foreground">
          Payments and changes will appear here automatically.
        </p>
      </div>
    )
  }

  const getActionConfig = (action: string) => {
    switch (action) {
      case "created":
        return {
          title: "Lend Created",
          icon: CoinStack,
          iconBg: "bg-primary/10 text-primary border-primary/20",
          badge: null,
        }
      case "payment_recorded":
        return {
          title: "Payment Recorded",
          icon: CheckCircle,
          iconBg:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          badge: (
            <Badge
              variant="secondary"
              className="h-4.5 border-emerald-500/20 bg-emerald-500/10 px-1.5 text-[10px] text-emerald-600 dark:text-emerald-400"
            >
              Repayment
            </Badge>
          ),
        }
      case "status_changed":
        return {
          title: "Status Changed",
          icon: Clock,
          iconBg:
            "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
          badge: null,
        }
      case "share_toggled":
        return {
          title: "Share Link Toggled",
          icon: ShareIcon,
          iconBg:
            "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
          badge: null,
        }
      case "deleted":
        return {
          title: "Lend Deleted",
          icon: TrashIcon,
          iconBg: "bg-destructive/10 text-destructive border-destructive/20",
          badge: (
            <Badge variant="destructive" className="h-4.5 px-1.5 text-[10px]">
              Deleted
            </Badge>
          ),
        }
      case "updated":
      default:
        return {
          title: "Lend Updated",
          icon: Clipboard,
          iconBg: "bg-muted text-foreground border-border",
          badge: null,
        }
    }
  }

  return (
    <div className="relative space-y-6 pl-6 before:absolute before:top-2 before:bottom-2 before:left-2.5 before:w-px before:bg-border/60">
      {logs.map((log) => {
        const config = getActionConfig(log.action)
        const IconComponent = config.icon
        const details: AuditLogDetails = (log.details as AuditLogDetails) || {}

        const formattedDate = new Date(log.createdAt).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }
        )

        return (
          <div key={log.id} className="group relative">
            {/* Timeline bullet / icon node */}
            <div
              className={cn(
                "absolute top-0 -left-6 flex size-5.5 -translate-x-1/2 items-center justify-center rounded-full border bg-background text-[11px] shadow-2xs transition-transform group-hover:scale-110",
                config.iconBg
              )}
            >
              <IconComponent className="size-3" />
            </div>

            {/* Event Content */}
            <div className="space-y-1.5 rounded-xl border border-border/60 bg-card/40 p-3.5 transition-colors hover:bg-card/70">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    {config.title}
                  </span>
                  {config.badge}
                </div>
                <time className="font-mono text-[11px] text-muted-foreground">
                  {formattedDate}
                </time>
              </div>

              {/* Event specific details */}
              {log.action === "created" && (
                <p className="text-xs text-muted-foreground">
                  Original loan of{" "}
                  <span className="font-semibold text-foreground">
                    {formatMoney(details.amount || 0, currency)}
                  </span>{" "}
                  created for{" "}
                  <span className="font-medium text-foreground">
                    {details.borrowerName}
                  </span>
                  .
                </p>
              )}

              {log.action === "payment_recorded" && (
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      +{formatMoney(details.paymentAmount || 0, currency)}
                    </span>
                    {details.newPaid !== undefined && (
                      <span className="font-mono text-[11px] text-muted-foreground">
                        Cumulative: {formatMoney(details.newPaid, currency)}
                      </span>
                    )}
                  </div>

                  {details.note && (
                    <div className="rounded-md border border-border/40 bg-muted/40 px-2.5 py-1 text-[11px] text-foreground/90 italic">
                      &ldquo;{details.note}&rdquo;
                    </div>
                  )}

                  {details.newStatus && details.previousStatus !== details.newStatus && (
                    <p className="text-[11px] text-muted-foreground">
                      Loan status transitioned from{" "}
                      <span className="font-medium text-foreground capitalize">
                        {details.previousStatus}
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold text-foreground capitalize">
                        {details.newStatus}
                      </span>
                      .
                    </p>
                  )}
                </div>
              )}

              {log.action === "status_changed" && (
                <p className="text-xs text-muted-foreground">
                  Status changed from{" "}
                  <span className="font-medium text-foreground capitalize">
                    {details.previousStatus}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-foreground capitalize">
                    {details.newStatus}
                  </span>
                  .
                </p>
              )}

              {log.action === "share_toggled" && (
                <p className="text-xs text-muted-foreground">
                  Public share link was{" "}
                  {details.isPublic ? (
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      enabled
                    </span>
                  ) : (
                    <span className="font-medium text-muted-foreground">
                      disabled
                    </span>
                  )}
                  .
                </p>
              )}

              {log.action === "updated" && (
                <p className="text-xs text-muted-foreground">
                  Loan details or notes updated.
                </p>
              )}

              {log.action === "deleted" && (
                <p className="text-xs text-destructive">
                  Loan was moved to deleted.
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
