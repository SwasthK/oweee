"use client"

import * as React from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  Clock,
  Calendar,
  Clipboard,
} from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Logo } from "@/components/layout/logo"
import { useIsOverdue } from "@/hooks/use-is-overdue"
import { formatMoney } from "@/lib/currency"

import { AuditLogDetails } from "@/types/lend"

interface PublicLendViewProps {
  lend: {
    id: string
    borrowerName: string
    amount: string
    paidAmount: string
    currency: string
    status: "open" | "partial" | "closed"
    lentAt: Date
    dueDate: Date | null
    notes: string | null
    isPublic: boolean
    createdAt: Date
    auditLogs: Array<{
      id: string
      action: string
      details: AuditLogDetails | null
      createdAt: Date
    }>
  }
}

export function PublicLendView({ lend }: PublicLendViewProps) {
  const totalAmount = Number(lend.amount) || 0
  const paidAmount = Number(lend.paidAmount) || 0
  const remaining = Math.max(0, totalAmount - paidAmount)
  const progressPercent =
    totalAmount > 0
      ? Math.min(100, Math.round((paidAmount / totalAmount) * 100))
      : 0

  const isClosed = lend.status === "closed"
  const isPartial = lend.status === "partial"

  const isOverdue = useIsOverdue(lend.dueDate, isClosed)

  const formattedLentDate = new Date(lend.lentAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const formattedDueDate = lend.dueDate
    ? new Date(lend.dueDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null

  // Filter audit logs for public display (created and payments)
  const publicActivity = lend.auditLogs.filter(
    (log) =>
      log.action === "created" ||
      log.action === "payment_recorded" ||
      log.action === "status_changed"
  )

  return (
    <div className="mx-auto w-full max-w-xl space-y-6 px-4 py-6">
      {/* Top Brand Bar */}
      <div className="flex items-center justify-between">
        <Logo />

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      {/* Main Ledger Card */}
      <Card className="space-y-6 overflow-hidden border-border/80 bg-card/60 p-6 shadow-sm">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border/50 pb-5">
          <div className="space-y-1">
            <div className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              Shared Lending Record
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Loan for {lend.borrowerName}
            </h1>
            <p className="text-xs text-muted-foreground">
              Lent on {formattedLentDate}
            </p>
          </div>

          <div className="shrink-0 text-right">
            {isClosed ? (
              <Badge
                variant="secondary"
                className="h-6 border border-emerald-500/20 bg-emerald-500/10 px-2.5 text-xs text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle className="mr-1 size-3.5" /> Settled
              </Badge>
            ) : isPartial ? (
              <Badge
                variant="outline"
                className="h-6 border-blue-500/20 bg-blue-500/10 px-2.5 text-xs text-blue-600 dark:text-blue-400"
              >
                <Clock className="mr-1 size-3.5" /> Partial
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="h-6 border-amber-500/20 bg-amber-500/10 px-2.5 text-xs text-amber-600 dark:text-amber-400"
              >
                <Clock className="mr-1 size-3.5" /> Open
              </Badge>
            )}
          </div>
        </div>

        {/* Big Numbers Breakdown */}
        <div className="grid grid-cols-2 gap-4 rounded-xl border border-border/50 bg-muted/30 p-4">
          <div>
            <div className="text-[11px] font-medium text-muted-foreground">
              Total Loaned
            </div>
            <div className="mt-0.5 font-heading text-xl font-semibold text-foreground">
              {formatMoney(totalAmount, lend.currency)}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-medium text-muted-foreground">
              Remaining Balance
            </div>
            <div
              className={cn(
                "mt-0.5 font-heading text-xl font-bold",
                isClosed
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-foreground"
              )}
            >
              {formatMoney(remaining, lend.currency)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              Paid:{" "}
              <strong className="text-foreground">
                {formatMoney(paidAmount, lend.currency)}
              </strong>
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              {progressPercent}% settled
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                isClosed ? "bg-emerald-500" : "bg-blue-500"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Due Date & Purpose */}
        <div className="space-y-2.5 border-t border-border/50 pt-4 text-xs">
          {formattedDueDate && (
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                <span>Expected Repayment:</span>
              </span>
              <span
                className={cn(
                  "font-medium",
                  isOverdue
                    ? "font-semibold text-destructive"
                    : "text-foreground"
                )}
              >
                {formattedDueDate}
                {isOverdue && (
                  <span className="ml-1 text-[10px] font-bold uppercase">
                    (Overdue)
                  </span>
                )}
              </span>
            </div>
          )}

          {lend.notes && (
            <div className="space-y-1 pt-1">
              <div className="text-[11px] font-medium text-muted-foreground">
                Purpose / Memo:
              </div>
              <div className="rounded-lg border border-border/40 bg-muted/40 p-3 text-xs text-foreground italic">
                &ldquo;{lend.notes}&rdquo;
              </div>
            </div>
          )}
        </div>

        {/* Transparent History Section */}
        {publicActivity.length > 0 && (
          <div className="space-y-3 border-t border-border/50 pt-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Clipboard className="size-3.5" />
              <span>Payment & Status History</span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {publicActivity.map((log) => {
                const details = log.details || {}
                const date = new Date(log.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }
                )

                return (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-xs"
                  >
                    <div>
                      {log.action === "created" && (
                        <span className="text-muted-foreground">
                          Loan initiated for{" "}
                          {formatMoney(details.amount || 0, lend.currency)}
                        </span>
                      )}
                      {log.action === "payment_recorded" && (
                        <div className="space-y-0.5">
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            +{formatMoney(details.paymentAmount || 0, lend.currency)}{" "}
                            payment logged
                          </span>
                          {details.note && (
                            <span className="block text-[11px] text-muted-foreground italic">
                              &ldquo;{details.note}&rdquo;
                            </span>
                          )}
                        </div>
                      )}
                      {log.action === "status_changed" && (
                        <span className="text-muted-foreground">
                          Status updated to{" "}
                          <strong className="capitalize">
                            {details.newStatus}
                          </strong>
                        </span>
                      )}
                    </div>
                    <time className="ml-2 shrink-0 font-mono text-[10px] text-muted-foreground">
                      {date}
                    </time>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Security note & promo banner */}
      <div className="space-y-3 pt-2 text-center">
        <p className="text-[11px] text-muted-foreground">
          🔒 This public link only provides isolated access to this specific
          loan record.
        </p>

        <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 text-left sm:flex-row">
          <div>
            <div className="text-xs font-semibold text-foreground">
              Track your own lending with Oweee
            </div>
            <div className="text-[11px] text-muted-foreground">
              Free, private, and effortless loan tracking with friends.
            </div>
          </div>

          <Button
            size="xs"
            render={<Link href="/register" />}
            className="shrink-0 text-xs"
          >
            Start for free
          </Button>
        </div>
      </div>
    </div>
  )
}
