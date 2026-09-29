"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { recordPaymentAction } from "@/lib/actions/lends"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, CheckCircle } from "@/components/ui/icons"
import { Lend } from "@/types/lend"

interface PaymentDialogProps {
  lend: Lend | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentDialog({ lend, open, onOpenChange }: PaymentDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [amount, setAmount] = React.useState("")
  const [note, setNote] = React.useState("")

  const totalAmount = lend ? Number(lend.amount) : 0
  const paidAmount = lend ? Number(lend.paidAmount) : 0
  const remaining = Math.max(0, totalAmount - paidAmount)

  React.useEffect(() => {
    if (lend) {
      setAmount(remaining.toFixed(2))
      setNote("")
      setError(null)
    }
  }, [lend, remaining])

  if (!lend) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const paymentVal = parseFloat(amount)
    if (isNaN(paymentVal) || paymentVal <= 0) {
      setError("Please enter a valid amount greater than zero.")
      return
    }

    setLoading(true)

    try {
      const res = await recordPaymentAction({
        lendId: lend.id,
        amount: paymentVal,
        note: note.trim() || undefined,
      })

      if (res.success) {
        onOpenChange(false)
        router.refresh()
      }
    } catch (err: any) {
      setError(err?.message || "Failed to record payment.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border/80 bg-card p-6 shadow-lg sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg tracking-tight font-heading">
            Record Repayment
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Log a partial or full payment from {lend.borrowerName}.
          </DialogDescription>
        </DialogHeader>

        {/* Balance Breakdown Card */}
        <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 space-y-2 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Total Lent:</span>
            <span className="font-medium text-foreground">${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Previously Paid:</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              ${paidAmount.toFixed(2)}
            </span>
          </div>
          <div className="border-t border-border/60 pt-1.5 flex justify-between font-medium">
            <span className="text-foreground">Remaining Balance:</span>
            <span className="text-foreground font-semibold text-sm">
              ${remaining.toFixed(2)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive">
              <AlertTriangle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="paymentAmount" className="text-xs font-medium">
                Payment Amount *
              </Label>
              <button
                type="button"
                onClick={() => setAmount(remaining.toFixed(2))}
                className="text-[11px] text-primary hover:underline font-medium"
              >
                Pay Full (${remaining.toFixed(2)})
              </button>
            </div>
            <div className="relative">
              <Input
                id="paymentAmount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                className="text-xs pl-7 font-mono font-medium"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                $
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="paymentNote" className="text-xs font-medium">
              Note (Optional)
            </Label>
            <Input
              id="paymentNote"
              placeholder="e.g. Venmo transfer, cash, lunch deduction"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={loading}
              className="text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={loading} className="gap-1.5 text-xs">
              <CheckCircle className="size-3.5" />
              <span>{loading ? "Recording..." : "Save Payment"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
