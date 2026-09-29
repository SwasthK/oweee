"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LendWithAuditLogs } from "@/types/lend"
import { deleteLendAction, toggleShareAction } from "@/lib/actions/lends"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Clock,
  CheckCircle,
  ShareIcon,
  TrashIcon,
  CheckIcon,
  Calendar,
  CreditCard,
  Clipboard,
} from "@/components/ui/icons"
import { PaymentDialog } from "@/components/dashboard/payment-dialog"
import { EditLendDialog } from "./edit-lend-dialog"
import { AuditTimeline } from "@/components/audit/audit-timeline"
import { useIsOverdue } from "@/hooks/use-is-overdue"
import { cn } from "@/lib/utils"

interface LendDetailViewProps {
  lend: LendWithAuditLogs
}

export function LendDetailView({ lend }: LendDetailViewProps) {
  const router = useRouter()
  const [copied, setCopied] = React.useState(false)
  const [paymentOpen, setPaymentOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [togglingShare, setTogglingShare] = React.useState(false)

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

  const handleCopyLink = async () => {
    if (!lend.isPublic) {
      setTogglingShare(true)
      await toggleShareAction({ lendId: lend.id, isPublic: true })
      setTogglingShare(false)
    }

    const shareUrl = `${window.location.origin}/share/${lend.shareToken}`
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    router.refresh()
  }

  const handleToggleShare = async () => {
    setTogglingShare(true)
    await toggleShareAction({ lendId: lend.id, isPublic: !lend.isPublic })
    setTogglingShare(false)
    router.refresh()
  }

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete the lend for ${lend.borrowerName}?`
      )
    ) {
      return
    }

    try {
      await deleteLendAction(lend.id)
      router.push("/")
      router.refresh()
    } catch (err) {
      console.error(err)
    }
  }

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

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Top Breadcrumb & Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="text-base leading-none">‹</span>
          <span>Back to dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="xs"
            onClick={() => setEditOpen(true)}
            className="h-7 rounded-md px-2.5 text-xs"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleDelete}
            title="Delete lend"
            className="size-7 text-muted-foreground hover:text-destructive"
          >
            <TrashIcon className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/50 pb-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl border border-border/80 bg-muted text-sm font-semibold text-foreground uppercase">
            {lend.borrowerName.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                {lend.borrowerName}
              </h1>
              {isClosed ? (
                <Badge
                  variant="secondary"
                  className="h-5 border border-emerald-500/20 bg-emerald-500/10 px-2 text-[10px] text-emerald-600 dark:text-emerald-400"
                >
                  <CheckCircle className="mr-1 size-3" /> Settled
                </Badge>
              ) : isPartial ? (
                <Badge
                  variant="outline"
                  className="h-5 border-blue-500/20 bg-blue-500/10 px-2 text-[10px] text-blue-600 dark:text-blue-400"
                >
                  <Clock className="mr-1 size-3" /> Partial
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="h-5 border-amber-500/20 bg-amber-500/10 px-2 text-[10px] text-amber-600 dark:text-amber-400"
                >
                  <Clock className="mr-1 size-3" /> Open
                </Badge>
              )}
            </div>
            {lend.borrowerContact && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {lend.borrowerContact}
              </p>
            )}
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          {!isClosed && (
            <Button
              size="sm"
              onClick={() => setPaymentOpen(true)}
              className="gap-1.5 text-xs shadow-xs"
            >
              <CreditCard className="size-3.5" />
              <span>Record Payment</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            disabled={togglingShare}
            className="gap-1.5 text-xs"
          >
            {copied ? (
              <CheckIcon className="size-3.5 text-emerald-500" />
            ) : (
              <ShareIcon className="size-3.5" />
            )}
            <span>{copied ? "Copied Link!" : "Share Link"}</span>
          </Button>
        </div>
      </div>

      {/* Grid: Financial Overview & Audit Stream */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column: Loan Summary */}
        <div className="space-y-4 md:col-span-1">
          {/* Amount Card */}
          <Card className="space-y-4 border-border/70 bg-card/60 p-4">
            <div className="space-y-1">
              <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                Total Lent
              </span>
              <div className="font-heading text-3xl font-bold tracking-tight text-foreground">
                ${totalAmount.toFixed(2)}
              </div>
            </div>

            {/* Repayment Progress */}
            <div className="space-y-1.5 border-t border-border/50 pt-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Paid so far:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  ${paidAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Outstanding:</span>
                <span className="font-semibold text-foreground">
                  ${remaining.toFixed(2)}
                </span>
              </div>

              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    isClosed ? "bg-emerald-500" : "bg-blue-500"
                  )}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-right text-[10px] text-muted-foreground">
                {progressPercent}% settled
              </div>
            </div>

            {/* Dates & Purpose */}
            <div className="space-y-2 border-t border-border/50 pt-3 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  <span>Lent Date:</span>
                </span>
                <span className="font-medium text-foreground">
                  {formattedLentDate}
                </span>
              </div>

              {formattedDueDate && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Due Date:</span>
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
                <div className="pt-2">
                  <div className="mb-1 text-[11px] font-medium text-muted-foreground">
                    Notes & Purpose:
                  </div>
                  <div className="rounded-lg border border-border/40 bg-muted/40 p-2.5 text-xs text-foreground italic">
                    &ldquo;{lend.notes}&rdquo;
                  </div>
                </div>
              )}
            </div>

            {/* Sharing Setting */}
            <div className="space-y-2 border-t border-border/50 pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-foreground">
                    Public Sharing
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {lend.isPublic
                      ? "Link is publicly viewable"
                      : "Only you can see this lend"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleShare}
                  disabled={togglingShare}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    lend.isPublic ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block size-4 transform rounded-full bg-background shadow-xs ring-0 transition duration-200 ease-in-out",
                      lend.isPublic ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              {lend.isPublic && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex w-full cursor-pointer items-center justify-between rounded-md border border-border/60 bg-muted/30 px-2 py-1.5 text-left text-[11px] text-muted-foreground transition-colors hover:bg-muted/60"
                  >
                    <span className="truncate">
                      /share/{lend.shareToken.slice(0, 12)}...
                    </span>
                    <span className="ml-1 shrink-0 text-[10px] font-medium text-primary">
                      {copied ? "Copied" : "Copy"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Audit Timeline */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clipboard className="size-4 text-foreground" />
              <h2 className="font-heading text-sm font-semibold tracking-tight text-foreground">
                Activity & Audit Trail
              </h2>
            </div>
            <span className="text-[11px] text-muted-foreground">
              {lend.auditLogs.length}{" "}
              {lend.auditLogs.length === 1 ? "event" : "events"} recorded
            </span>
          </div>

          <Card className="border-border/70 bg-card/60 p-5">
            <AuditTimeline logs={lend.auditLogs} />
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentDialog
        lend={lend}
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
      />

      {/* Edit Modal */}
      <EditLendDialog lend={lend} open={editOpen} onOpenChange={setEditOpen} />
    </div>
  )
}
