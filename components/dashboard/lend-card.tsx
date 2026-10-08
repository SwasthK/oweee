"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Lend } from "@/types/lend"
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
  ChevronRightIcon,
} from "@/components/ui/icons"
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Spinner } from "@/components/ui/spinner"
import { ShareLendDialog } from "@/components/lends/share-lend-dialog"
import { cn } from "@/lib/utils"

interface LendCardProps {
  lend: Lend
  onRecordPayment: (lend: Lend) => void
}

export function LendCard({ lend, onRecordPayment }: LendCardProps) {
  const router = useRouter()
  const [shareOpen, setShareOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

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

  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteLendAction(lend.id)
      setDeleteOpen(false)
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

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest("[role='dialog']") ||
      target.closest("[data-slot='alert-dialog-content']")
    ) {
      return
    }
    router.push(`/lends/${lend.id}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      const target = e.target as HTMLElement
      if (target.closest("button") || target.closest("a")) {
        return
      }
      e.preventDefault()
      router.push(`/lends/${lend.id}`)
    }
  }

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="group relative cursor-pointer overflow-hidden border-border/70 bg-card/60 p-4 transition-all hover:border-foreground/30 hover:bg-card/90 hover:shadow-xs focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden"
    >
      <div className="flex flex-col gap-3">
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-muted text-xs font-semibold text-foreground uppercase">
              {lend.borrowerName.slice(0, 2)}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                  {lend.borrowerName}
                </span>
              </div>

              {lend.borrowerContact && (
                <div className="truncate text-[11px] text-muted-foreground">
                  {lend.borrowerContact}
                </div>
              )}
            </div>
          </div>

          {/* Status Badge & Total Amount */}
          <div className="shrink-0 text-right">
            <div className="font-heading text-base font-semibold text-foreground">
              {formatMoney(totalAmount, lend.currency)}
            </div>

            <div className="mt-0.5">
              {isClosed ? (
                <Badge
                  variant="secondary"
                  className="h-4.5 border border-emerald-500/20 bg-emerald-500/10 px-1.5 text-[10px] text-emerald-600 dark:text-emerald-400"
                >
                  <CheckCircle className="mr-0.5 size-2.5" /> Settled
                </Badge>
              ) : isPartial ? (
                <Badge
                  variant="outline"
                  className="h-4.5 border-blue-500/20 bg-blue-500/10 px-1.5 text-[10px] text-blue-600 dark:text-blue-400"
                >
                  <Clock className="mr-0.5 size-2.5" /> Partial
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="h-4.5 border-amber-500/20 bg-amber-500/10 px-1.5 text-[10px] text-amber-600 dark:text-amber-400"
                >
                  <Clock className="mr-0.5 size-2.5" /> Open
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar (if partial) or Notes */}
        {isPartial && (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">
                {formatMoney(paidAmount, lend.currency)} paid ({progressPercent}
                %)
              </span>
              <span className="font-medium text-foreground">
                {formatMoney(remaining, lend.currency)} left
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {lend.notes && (
          <p className="line-clamp-1 text-xs text-muted-foreground/90 italic">
            &ldquo;{lend.notes}&rdquo;
          </p>
        )}

        {/* Dates & Quick Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-2.5 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              <span>{formattedLentDate}</span>
            </span>

            {formattedDueDate && (
              <span
                className={cn(
                  "flex items-center gap-1",
                  isOverdue
                    ? "font-medium text-destructive"
                    : "text-muted-foreground"
                )}
              >
                <span>Due: {formattedDueDate}</span>
                {isOverdue && (
                  <span className="text-[10px] font-bold uppercase">
                    (Overdue)
                  </span>
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Record Payment Button */}
            {!isClosed && (
              <Button
                variant="outline"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation()
                  onRecordPayment(lend)
                }}
                className="h-6.5 cursor-pointer rounded-md px-2 text-[11px] hover:border-foreground/30"
              >
                Record Payment
              </Button>
            )}

            {/* Quick Share Link Button */}
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setShareOpen(true)
                    }}
                    className="size-7 cursor-pointer text-muted-foreground hover:text-foreground"
                  >
                    <LinkIcon className="size-3.5" />
                  </Button>
                }
              />
              <TooltipContent>Share public link</TooltipContent>
            </Tooltip>

            {/* Delete Button */}
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setDeleteOpen(true)
                    }}
                    disabled={isDeleting}
                    className="size-7 cursor-pointer text-muted-foreground hover:text-destructive"
                  >
                    <TrashIcon className="size-3.5" />
                  </Button>
                }
              />
              <TooltipContent>Delete lend</TooltipContent>
            </Tooltip>

            {/* Chevron indicator to view details */}
            <div className="flex items-center pl-1 text-muted-foreground/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-foreground">
              <ChevronRightIcon className="size-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lend Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the loan for{" "}
              <strong className="text-foreground">{lend.borrowerName}</strong>?
              This record will be moved to deleted and hidden from your active
              dashboard.
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
    </Card>
  )
}
