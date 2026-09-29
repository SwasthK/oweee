import * as React from "react"
import { LendAuditLog } from "@/types/lend"
import { Badge } from "@/components/ui/badge"
import {
  CoinStack,
  CheckCircle,
  Clock,
  Clipboard,
  ShareIcon,
  TrashIcon,
} from "@/components/ui/icons"
import { cn } from "@/lib/utils"

interface AuditTimelineProps {
  logs: LendAuditLog[]
  currency?: string
}

export function AuditTimeline({ logs, currency = "$" }: AuditTimelineProps) {
  if (logs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 p-6 text-center text-xs text-muted-foreground">
        No activity recorded yet.
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
          iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          badge: <Badge variant="secondary" className="text-[10px] h-4.5 px-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Repayment</Badge>,
        }
      case "status_changed":
        return {
          title: "Status Changed",
          icon: Clock,
          iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
          badge: null,
        }
      case "share_toggled":
        return {
          title: "Share Link Toggled",
          icon: ShareIcon,
          iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
          badge: null,
        }
      case "deleted":
        return {
          title: "Lend Deleted",
          icon: TrashIcon,
          iconBg: "bg-destructive/10 text-destructive border-destructive/20",
          badge: <Badge variant="destructive" className="text-[10px] h-4.5 px-1.5">Deleted</Badge>,
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
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-border/60">
      {logs.map((log) => {
        const config = getActionConfig(log.action)
        const IconComponent = config.icon
        const details = (log.details as Record<string, any>) || {}

        const formattedDate = new Date(log.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })

        return (
          <div key={log.id} className="relative group">
            {/* Timeline bullet / icon node */}
            <div
              className={cn(
                "absolute -left-6 top-0 flex size-5.5 -translate-x-1/2 items-center justify-center rounded-full border bg-background text-[11px] shadow-2xs transition-transform group-hover:scale-110",
                config.iconBg
              )}
            >
              <IconComponent className="size-3" />
            </div>

            {/* Event Content */}
            <div className="rounded-xl border border-border/60 bg-card/40 p-3.5 space-y-1.5 hover:bg-card/70 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    {config.title}
                  </span>
                  {config.badge}
                </div>
                <time className="text-[11px] text-muted-foreground font-mono">
                  {formattedDate}
                </time>
              </div>

              {/* Event specific details */}
              {log.action === "created" && (
                <p className="text-xs text-muted-foreground">
                  Original loan of <span className="font-semibold text-foreground">{currency}{Number(details.amount || 0).toFixed(2)}</span> created for <span className="font-medium text-foreground">{details.borrowerName}</span>.
                </p>
              )}

              {log.action === "payment_recorded" && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    Recorded payment of <span className="font-semibold text-emerald-600 dark:text-emerald-400">+{currency}{Number(details.paymentAmount || 0).toFixed(2)}</span>.
                    {details.newPaid !== undefined && (
                      <span> Total paid is now <span className="font-medium text-foreground">{currency}{Number(details.newPaid).toFixed(2)}</span>.</span>
                    )}
                  </p>
                  {details.newStatus && (
                    <p className="text-[11px]">
                      Status transitioned from <span className="capitalize font-medium text-foreground">{details.previousStatus}</span> to <span className="capitalize font-semibold text-foreground">{details.newStatus}</span>.
                    </p>
                  )}
                  {details.note && (
                    <p className="text-[11px] italic text-muted-foreground/80">
                      Note: &ldquo;{details.note}&rdquo;
                    </p>
                  )}
                </div>
              )}

              {log.action === "status_changed" && (
                <p className="text-xs text-muted-foreground">
                  Status changed from <span className="capitalize font-medium text-foreground">{details.previousStatus}</span> to <span className="capitalize font-semibold text-foreground">{details.newStatus}</span>.
                </p>
              )}

              {log.action === "share_toggled" && (
                <p className="text-xs text-muted-foreground">
                  Public share link was {details.isPublic ? <span className="text-emerald-600 dark:text-emerald-400 font-medium">enabled</span> : <span className="text-muted-foreground font-medium">disabled</span>}.
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
