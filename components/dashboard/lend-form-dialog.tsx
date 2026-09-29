"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { createLendAction } from "@/lib/actions/lends"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { AddCircle, AlertTriangle } from "@/components/ui/icons"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Spinner } from "@/components/ui/spinner"
import { CURRENCIES, DEFAULT_CURRENCY, getCurrencySymbol } from "@/lib/currency"

interface LendFormDialogProps {
  children?: React.ReactNode
}

export function LendFormDialog({ children }: LendFormDialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [borrowerName, setBorrowerName] = React.useState("")
  const [borrowerContact, setBorrowerContact] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [currency, setCurrency] = React.useState(DEFAULT_CURRENCY)
  const [lentAt, setLentAt] = React.useState<Date | undefined>(new Date())
  const [dueDate, setDueDate] = React.useState<Date | undefined>(undefined)
  const [notes, setNotes] = React.useState("")
  const [isPublic, setIsPublic] = React.useState(false)

  const resetForm = () => {
    setBorrowerName("")
    setBorrowerContact("")
    setAmount("")
    setCurrency(DEFAULT_CURRENCY)
    setLentAt(new Date())
    setDueDate(undefined)
    setNotes("")
    setIsPublic(false)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount greater than zero.")
      return
    }

    if (!borrowerName.trim()) {
      setError("Please enter your friend's name.")
      return
    }

    setLoading(true)

    try {
      const res = await createLendAction({
        borrowerName: borrowerName.trim(),
        borrowerContact: borrowerContact.trim() || undefined,
        amount: numAmount,
        currency,
        lentAt: lentAt || new Date(),
        dueDate: dueDate || undefined,
        notes: notes.trim() || undefined,
        isPublic,
      })

      if (res.success) {
        resetForm()
        setOpen(false)
        router.refresh()
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to create lend. Please try again."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        if (!val) resetForm()
      }}
    >
      <DialogTrigger
        render={
          children ? (
            (children as React.ReactElement)
          ) : (
            <Button size="sm" className="gap-1.5 shadow-xs">
              <AddCircle className="size-4" />
              <span>New Lend</span>
            </Button>
          )
        }
      />

      <DialogContent className="max-w-md border-border/80 bg-card p-6 shadow-lg sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg tracking-tight">
            Record New Lend
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Track money lent to a friend with optional due dates and public
            sharing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive">
              <AlertTriangle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="borrowerName" className="text-xs font-medium">
                Friend&apos;s Name *
              </Label>
              <Input
                id="borrowerName"
                placeholder="e.g. John Doe"
                required
                value={borrowerName}
                onChange={(e) => setBorrowerName(e.target.value)}
                disabled={loading}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="amount" className="text-xs font-medium">
                Amount *
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={loading}
                  className="pl-7 text-xs"
                />
                <span className="absolute top-1/2 left-2.5 -translate-y-1/2 text-xs text-muted-foreground">
                  {getCurrencySymbol(currency)}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="currency" className="text-xs font-medium">
                Currency
              </Label>
              <Select
                value={currency}
                onValueChange={(val) => {
                  if (val) setCurrency(val)
                }}
                disabled={loading}
              >
                <SelectTrigger id="currency" className="w-full text-xs">
                  <SelectValue placeholder="Select currency">
                    {CURRENCIES.find((c) => c.code === currency)?.label || currency}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code} className="text-xs">
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lentAt" className="text-xs font-medium">
                Date Lent
              </Label>
              <DatePicker
                id="lentAt"
                date={lentAt}
                setDate={setLentAt}
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dueDate" className="text-xs font-medium">
                Due Date (Optional)
              </Label>
              <DatePicker
                id="dueDate"
                date={dueDate}
                setDate={setDueDate}
                placeholder="No due date"
                clearable
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="borrowerContact" className="text-xs font-medium">
                Contact Info (Optional)
              </Label>
              <Input
                id="borrowerContact"
                placeholder="Email, phone or handle"
                value={borrowerContact}
                onChange={(e) => setBorrowerContact(e.target.value)}
                disabled={loading}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="notes" className="text-xs font-medium">
                Notes / Purpose
              </Label>
              <Input
                id="notes"
                placeholder="e.g. Dinner split, concert tickets, rent advance"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={loading}
                className="text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-1 sm:col-span-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                disabled={loading}
                className="size-3.5 rounded border-border text-primary focus:ring-ring"
              />
              <Label
                htmlFor="isPublic"
                className="cursor-pointer text-xs font-normal text-muted-foreground"
              >
                Enable public shareable link immediately
              </Label>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="gap-1.5 text-xs"
            >
              {loading ? (
                <>
                  <Spinner size="xs" />
                  <span>Creating...</span>
                </>
              ) : (
                "Create Lend"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
