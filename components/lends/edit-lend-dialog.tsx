"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Lend } from "@/types/lend"
import { updateLendAction } from "@/lib/actions/lends"
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
import { AlertTriangle } from "@/components/ui/icons"

interface EditLendDialogProps {
  lend: Lend
  open: boolean
  onOpenChange: (open: boolean) => void
}

function EditLendForm({
  lend,
  onCancel,
  onSuccess,
}: {
  lend: Lend
  onCancel: () => void
  onSuccess: () => void
}) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [borrowerName, setBorrowerName] = React.useState(lend.borrowerName)
  const [borrowerContact, setBorrowerContact] = React.useState(
    lend.borrowerContact || ""
  )
  const [amount, setAmount] = React.useState(lend.amount)
  const [dueDate, setDueDate] = React.useState(
    lend.dueDate ? new Date(lend.dueDate).toISOString().split("T")[0] : ""
  )
  const [notes, setNotes] = React.useState(lend.notes || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount greater than zero.")
      return
    }

    if (!borrowerName.trim()) {
      setError("Friend's name cannot be empty.")
      return
    }

    setLoading(true)

    try {
      const res = await updateLendAction({
        id: lend.id,
        borrowerName: borrowerName.trim(),
        borrowerContact: borrowerContact.trim() || undefined,
        amount: numAmount,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        notes: notes.trim() || undefined,
      })

      if (res.success) {
        onSuccess()
        router.refresh()
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update lend."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive">
          <AlertTriangle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="editBorrowerName" className="text-xs font-medium">
            Friend&apos;s Name *
          </Label>
          <Input
            id="editBorrowerName"
            required
            value={borrowerName}
            onChange={(e) => setBorrowerName(e.target.value)}
            disabled={loading}
            className="text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="editAmount" className="text-xs font-medium">
              Total Amount *
            </Label>
            <div className="relative">
              <Input
                id="editAmount"
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                className="pl-7 text-xs"
              />
              <span className="absolute top-1/2 left-2.5 -translate-y-1/2 text-xs text-muted-foreground">
                $
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="editDueDate" className="text-xs font-medium">
              Due Date
            </Label>
            <Input
              id="editDueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={loading}
              className="text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="editContact" className="text-xs font-medium">
            Contact Info
          </Label>
          <Input
            id="editContact"
            placeholder="Email or phone"
            value={borrowerContact}
            onChange={(e) => setBorrowerContact(e.target.value)}
            disabled={loading}
            className="text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="editNotes" className="text-xs font-medium">
            Notes
          </Label>
          <Input
            id="editNotes"
            placeholder="Notes or purpose"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
            className="text-xs"
          />
        </div>
      </div>

      <DialogFooter className="pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={loading}
          className="text-xs"
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={loading} className="text-xs">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function EditLendDialog({
  lend,
  open,
  onOpenChange,
}: EditLendDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border/80 bg-card p-6 shadow-lg sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg tracking-tight">
            Edit Lend Details
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Update friend details, amount, due date, or notes.
          </DialogDescription>
        </DialogHeader>

        {open && (
          <EditLendForm
            key={lend.id + String(lend.updatedAt)}
            lend={lend}
            onCancel={() => onOpenChange(false)}
            onSuccess={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
