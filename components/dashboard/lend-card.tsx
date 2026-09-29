"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Lend } from "@/types/lend"
import { deleteLendAction, toggleShareAction } from "@/lib/actions/lends"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Clock,
  CheckCircle,
  ShareIcon,
  TrashIcon,
  CopyIcon,
  CheckIcon,
  ExternalLinkIcon,
  Calendar,
} from "@/components/ui/icons"
import { cn } from "@/lib/utils"

interface LendCardProps {
  lend: Lend
  onRecordPayment: (lend: Lend) => void
}

export function LendCard({ lend, onRecordPayment }: LendCardProps) {
  const router = useRouter()
  const [copied, setCopied] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const totalAmount = Number(lend.amount) || 0
  const paidAmount = Number(lend.paidAmount) || 0
  const remaining = Math.max(0, totalAmount - paidAmount)
  const progressPercent = totalAmount > 0 ? Math.min(100, Math.round((paidAmount / totalAmount) * 100)) : 0

  const isClosed = lend.status === "closed"
  const isPartial = lend.status === "partial"

  // Check if overdue
  const isOverdue =
    !isClosed && lend.dueDate && new Date(lend.dueDate).getTime() < Date.now()

  const handleCopyShareLink = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Ensure public sharing is enabled if copying
    if (!lend.isPublic) {
      await toggleShareAction({ lendId: lend.id, isPublic: true })
    }

    const shareUrl = `${window.location.origin}/share/${lend.shareToken}`
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    router.refresh()
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm(`Are you sure you want to delete the lend for ${lend.borrowerName}?`)) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteLendAction(lend.id)
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
    <Card className="group relative overflow-hidden border-border/70 bg-card/60 p-4 transition-all hover:border-foreground/20 hover:shadow-xs">
      <div className="flex flex-col gap-3">
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-foreground uppercase border border-border/80">
              {lend.borrowerName.slice(0, 2)}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  href={`/lends/${lend.id}`}
                  className="font-medium text-sm text-foreground hover:underline truncate"
                >
                  {lend.borrowerName}
                </Link>
                {lend.isPublic && (
                  <Badge variant="outline" className="text-[9px] h-4 px-1 text-muted-foreground border-border/50">
                    Public
                  </Badge>
                )}
              </div>

              {lend.borrowerContact && (
                <div className="text-[11px] text-muted-foreground truncate">
                  {lend.borrowerContact}
                </div>
              )}
            </div>
          </div>

          {/* Status Badge & Total Amount */}
          <div className="text-right shrink-0">
            <div className="font-heading text-base font-semibold text-foreground">
              ${totalAmount.toFixed(2)}
            </div>

            <div className="mt-0.5">
              {isClosed ? (
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] h-4.5 px-1.5"
                >
                  <CheckCircle className="size-2.5 mr-0.5" /> Settled
                </Badge>
              ) : isPartial ? (
                <Badge
                  variant="outline"
                  className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px] h-4.5 px-1.5"
                >
                  <Clock className="size-2.5 mr-0.5" /> Partial
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] h-4.5 px-1.5"
                >
                  <Clock className="size-2.5 mr-0.5" /> Open
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
                ${paidAmount.toFixed(2)} paid ({progressPercent}%)
              </span>
              <span className="font-medium text-foreground">
                ${remaining.toFixed(2)} left
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {lend.notes && (
          <p className="text-xs text-muted-foreground/90 line-clamp-1 italic">
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
                  isOverdue ? "text-destructive font-medium" : "text-muted-foreground"
                )}
              >
                <span>Due: {formattedDueDate}</span>
                {isOverdue && <span className="text-[10px] uppercase font-bold">(Overdue)</span>}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Record Payment Button */}
            {!isClosed && (
              <Button
                variant="outline"
                size="xs"
                onClick={() => onRecordPayment(lend)}
                className="h-6.5 text-[11px] px-2 rounded-md hover:border-foreground/30"
              >
                Record Payment
              </Button>
            )}

            {/* Quick Share Button */}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleCopyShareLink}
              title={copied ? "Copied public link!" : "Copy public share link"}
              className="size-6.5 text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <CheckIcon className="size-3 text-emerald-500" />
              ) : (
                <ShareIcon className="size-3" />
              )}
            </Button>

            {/* View Details Link */}
            <Link
              href={`/lends/${lend.id}`}
              className="inline-flex size-6.5 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80"
              title="View timeline & audit log"
            >
              <ExternalLinkIcon className="size-3" />
            </Link>

            {/* Delete Button */}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete lend"
              className="size-6.5 text-muted-foreground hover:text-destructive"
            >
              <TrashIcon className="size-3" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
