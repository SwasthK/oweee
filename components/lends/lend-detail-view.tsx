"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LendWithAuditLogs } from "@/types/lend"
import { deleteLendAction } from "@/lib/actions/lends"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Clock,
  CheckCircle,
  LinkIcon,
  TrashIcon,
  Calendar,
  CreditCard,
  Clipboard,
  AlertTriangle,
  ChevronLeftIcon,
  PencilIcon,
} from "@/components/ui/icons"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { PaymentDialog } from "@/components/dashboard/payment-dialog"
import { EditLendDialog } from "./edit-lend-dialog"
import { ShareLendDialog } from "./share-lend-dialog"
import { AuditTimeline } from "@/components/audit/audit-timeline"
import { useIsOverdue } from "@/hooks/use-is-overdue"
import { formatMoney } from "@/lib/currency"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface LendDetailViewProps {
  lend: LendWithAuditLogs
}

function getDueDateInfo(
  dueDate: Date | string | null | undefined,
  isClosed: boolean
): { text: string; isOverdue: boolean } | null {
  if (!dueDate || isClosed) return null
  const due = new Date(dueDate)
  const now = new Date()
  const dueDay = new Date(
    due.getFullYear(),
    due.getMonth(),
    due.getDate()
  ).getTime()
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime()
  const diffDays = Math.round((dueDay - today) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    const abs = Math.abs(diffDays)
    return {
      text: abs === 1 ? "1 day overdue" : `${abs} days overdue`,
      isOverdue: true,
    }
  }
  if (diffDays === 0) {
    return { text: "Due today", isOverdue: false }
  }
  if (diffDays === 1) {
    return { text: "Due tomorrow", isOverdue: false }
  }
  return { text: `Due in ${diffDays} days`, isOverdue: false }
}

export function LendDetailView({ lend }: LendDetailViewProps) {
  const router = useRouter()
  const [shareOpen, setShareOpen] = React.useState(false)
  const [paymentOpen, setPaymentOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)

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
  const dueDateInfo = getDueDateInfo(lend.dueDate, isClosed)

  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteLendAction(lend.id)
      setDeleteOpen(false)
      router.push("/")
      router.refresh()
    } catch (err) {
      console.error(err)
      setIsDeleting(false)
    }
  }

  const formattedLentDate = new Date(lend.lentAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const formattedDueDate = lend.dueDate
    ? new Date(lend.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null

  return (
    <div className="w-full max-w-5xl space-y-6">
      {/* 1. Breadcrumbs & Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Breadcrumb Path */}
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeftIcon className="size-3.5" />
            <span>Dashboard</span>
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">
            {lend.borrowerName}
          </span>
        </div>

        {/* Action Button Cluster */}
        <div className="flex items-center gap-2">
          {!isClosed && (
            <Button
              size="sm"
              onClick={() => setPaymentOpen(true)}
              className="gap-1.5 text-xs shadow-xs font-medium cursor-pointer"
            >
              <CreditCard className="size-3.5" />
              <span>Record Payment</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShareOpen(true)}
            className="gap-1.5 text-xs cursor-pointer"
          >
            <LinkIcon className="size-3.5" />
            <span>Share Link</span>
            {lend.isPublic && (
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
            className="gap-1.5 text-xs cursor-pointer"
          >
            <PencilIcon className="size-3.5" />
            <span>Edit</span>
          </Button>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setDeleteOpen(true)}
                  disabled={isDeleting}
                  className="size-8 text-muted-foreground hover:text-destructive cursor-pointer"
                >
                  <TrashIcon className="size-3.5" />
                </Button>
              }
            />
            <TooltipContent>Delete lend record</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* 2. Hero Profile & Balance Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-linear-to-b from-card to-card/60 p-6 shadow-xs backdrop-blur-xs">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          {/* Left: Borrower Identity & Meta */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-muted/80 font-heading text-lg font-bold tracking-tight text-foreground shadow-xs uppercase">
              {lend.borrowerName.slice(0, 2)}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {lend.borrowerName}
                </h1>

                {/* Status Badges */}
                {isClosed ? (
                  <Badge
                    variant="secondary"
                    className="h-5.5 border-emerald-500/20 bg-emerald-500/10 px-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 gap-1"
                  >
                    <CheckCircle className="size-3" /> Settled
                  </Badge>
                ) : isPartial ? (
                  <Badge
                    variant="outline"
                    className="h-5.5 border-blue-500/20 bg-blue-500/10 px-2 text-xs font-medium text-blue-600 dark:text-blue-400 gap-1"
                  >
                    <Clock className="size-3" /> Partially Repaid
                  </Badge>
                ) : isOverdue ? (
                  <Badge
                    variant="destructive"
                    className="h-5.5 px-2 text-xs font-medium gap-1"
                  >
                    <AlertTriangle className="size-3" /> Overdue
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="h-5.5 border-amber-500/20 bg-amber-500/10 px-2 text-xs font-medium text-amber-600 dark:text-amber-400 gap-1"
                  >
                    <Clock className="size-3" /> Open
                  </Badge>
                )}
              </div>

              {/* Sub-row details */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {lend.borrowerContact && (
                  <span className="font-mono text-[11px] text-foreground/80">
                    {lend.borrowerContact}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  <span>Lent on {formattedLentDate}</span>
                </span>
                {formattedDueDate && (
                  <span
                    className={cn(
                      "flex items-center gap-1 font-medium",
                      isOverdue ? "text-destructive" : "text-muted-foreground"
                    )}
                  >
                    <span>Due: {formattedDueDate}</span>
                    {dueDateInfo && (
                      <span
                        className={cn(
                          "rounded-sm px-1.5 py-0.2 text-[10px]",
                          dueDateInfo.isOverdue
                            ? "bg-destructive/10 text-destructive font-semibold"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {dueDateInfo.text}
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Balance Callout */}
          <div className="flex flex-col sm:items-end justify-center rounded-xl sm:rounded-none bg-muted/40 sm:bg-transparent p-4 sm:p-0 border border-border/40 sm:border-none">
            <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              {isClosed ? "Final Status" : "Remaining Balance"}
            </span>
            <div
              className={cn(
                "font-heading text-3xl sm:text-4xl font-extrabold tracking-tight",
                isClosed ? "text-emerald-500" : "text-foreground"
              )}
            >
              {formatMoney(remaining, lend.currency)}
            </div>
            <span className="text-[11px] text-muted-foreground">
              {isClosed
                ? "All dues settled in full"
                : `${formatMoney(paidAmount, lend.currency)} paid of ${formatMoney(totalAmount, lend.currency)}`}
            </span>
          </div>
        </div>

        {/* Progress Strip */}
        <div className="mt-5 border-t border-border/50 pt-4 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">Repayment Progress</span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground">
                {progressPercent}%
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {formatMoney(paidAmount, lend.currency)}
              </span>{" "}
              paid of{" "}
              <span className="font-semibold text-foreground">
                {formatMoney(totalAmount, lend.currency)}
              </span>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isClosed ? "bg-emerald-500" : "bg-primary"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content: Split 2-Column Grid (Log + Sidebar) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Activity & Audit Trail (lg:col-span-2) */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border/70 bg-card/60 p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg border border-border/80 bg-muted text-foreground">
                  <Clipboard className="size-3.5" />
                </div>
                <div>
                  <h2 className="font-heading text-sm font-semibold tracking-tight text-foreground">
                    Repayment & Activity Log
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Audit trail of repayments, adjustments, and status changes
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-[11px] font-mono">
                {lend.auditLogs.length}{" "}
                {lend.auditLogs.length === 1 ? "event" : "events"}
              </Badge>
            </div>

            <div className="pt-4">
              <AuditTimeline logs={lend.auditLogs} currency={lend.currency} />
            </div>
          </Card>
        </div>

        {/* Right Column: Sidebar (lg:col-span-1) */}
        <div className="space-y-5 lg:col-span-1">
          {/* Quick Repayment CTA (if open) */}
          {!isClosed && (
            <Card className="border-primary/20 bg-linear-to-b from-primary/5 to-card/60 p-5 shadow-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold tracking-wider text-primary uppercase">
                  Quick Action
                </span>
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  Receive Repayment
                </h3>
                <p className="text-xs text-muted-foreground">
                  Record a partial or full payment from {lend.borrowerName}.
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-lg border border-border/60 bg-background/60 p-2.5 text-xs">
                <span className="text-muted-foreground">Current Due:</span>
                <span className="font-semibold text-foreground">
                  {formatMoney(remaining, lend.currency)}
                </span>
              </div>

              <Button
                onClick={() => setPaymentOpen(true)}
                className="mt-3.5 w-full gap-1.5 text-xs shadow-xs font-medium cursor-pointer"
              >
                <CreditCard className="size-3.5" />
                <span>Record Payment</span>
              </Button>
            </Card>
          )}

          {/* Public Sharing Card */}
          <Card className="border-border/70 bg-card/60 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg border border-border/80 bg-muted text-primary">
                  <LinkIcon className="size-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-foreground">
                    Public Share Link
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    Read-only ledger for friend
                  </p>
                </div>
              </div>

              {lend.isPublic ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Disabled
                </span>
              )}
            </div>

            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              {lend.isPublic
                ? "Anyone with the link can view this loan and repayment history without logging in."
                : "Sharing is disabled. Turn it on to give your friend a live link to this balance."}
            </p>

            <div className="mt-4 pt-3 border-t border-border/50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShareOpen(true)}
                className="w-full gap-1.5 text-xs cursor-pointer"
              >
                <LinkIcon className="size-3.5" />
                <span>Manage Public Link</span>
              </Button>
            </div>
          </Card>

          {/* Notes & Memo Card (if notes present) */}
          {lend.notes && (
            <Card className="border-border/70 bg-card/60 p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <h3 className="text-xs font-semibold text-foreground">
                  Notes & Purpose
                </h3>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setEditOpen(true)}
                  className="h-6 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Edit
                </Button>
              </div>
              <div className="pt-3">
                <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 text-xs text-foreground/90 leading-relaxed italic">
                  &ldquo;{lend.notes}&rdquo;
                </div>
              </div>
            </Card>
          )}
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

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lend Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the loan for{" "}
              <strong className="text-foreground">{lend.borrowerName}</strong>?
              This record will be moved to deleted and hidden from your active dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="gap-1.5"
            >
              {isDeleting ? (
                <>
                  <Spinner size="xs" />
                  <span>Deleting...</span>
                </>
              ) : (
                "Delete Lend"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Share Dialog */}
      <ShareLendDialog
        lend={lend}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
    </div>
  )
}
