"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  deletePaymentSettingsAction,
  upsertPaymentSettingsAction,
} from "@/lib/actions/payment-settings"
import { UPI_ID_REGEX } from "@/lib/validations/payment.schema"
import { buildUpiUri } from "@/lib/upi"
import { UpiQrCode } from "@/components/share/upi-qr-code"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
  AlertTriangle,
  CheckCircle,
  ChevronLeftIcon,
} from "@/components/ui/icons"

interface PaymentSettingsFormProps {
  initialUpiId: string
  initialUpiName: string
  defaultName: string
}

export function PaymentSettingsForm({
  initialUpiId,
  initialUpiName,
  defaultName,
}: PaymentSettingsFormProps) {
  const router = useRouter()
  const [upiId, setUpiId] = React.useState(initialUpiId)
  const [upiName, setUpiName] = React.useState(initialUpiName)
  const [loading, setLoading] = React.useState<"save" | "remove" | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [saved, setSaved] = React.useState(false)

  const hasSaved = initialUpiId.length > 0
  const isValidUpi = UPI_ID_REGEX.test(upiId.trim())
  const previewName = upiName.trim() || defaultName

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaved(false)

    if (!isValidUpi) {
      setError("Enter a valid UPI ID (e.g. name@okbank)")
      return
    }

    setLoading("save")

    try {
      const res = await upsertPaymentSettingsAction({
        upiId: upiId.trim(),
        upiName: upiName.trim() || undefined,
      })

      if (res.success) {
        setSaved(true)
        router.refresh()
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save UPI details."
      setError(message)
    } finally {
      setLoading(null)
    }
  }

  const handleRemove = async () => {
    setError(null)
    setSaved(false)
    setLoading("remove")

    try {
      const res = await deletePaymentSettingsAction()

      if (res.success) {
        setUpiId("")
        setUpiName("")
        router.refresh()
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to remove UPI details."
      setError(message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="w-full max-w-xl space-y-6">
      <div className="flex items-center gap-2 text-xs">
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeftIcon className="size-3.5" />
          <span>Dashboard</span>
        </Link>
        <span className="text-muted-foreground/40">/</span>
        <span className="font-semibold text-foreground">Payment Methods</span>
      </div>

      <Card className="space-y-5 p-6">
        <div className="space-y-1">
          <h1 className="font-heading text-lg font-bold tracking-tight text-foreground">
            Payment Methods
          </h1>
          <p className="text-xs text-muted-foreground">
            Add the ways friends can pay you back. Each method shows up on your
            shared lend links for the currencies it supports.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-border/50 bg-muted/20 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <h2 className="text-sm font-semibold text-foreground">UPI</h2>
              <p className="text-[11px] text-muted-foreground">
                Friends scan a QR code with the remaining amount pre-filled.
              </p>
            </div>
            <Badge variant="outline" className="shrink-0 text-[10px]">
              INR only
            </Badge>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive">
              <AlertTriangle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="size-4 shrink-0" />
              <span>UPI details saved.</span>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="upiId" className="text-xs font-medium">
                  UPI ID *
                </Label>
                <Input
                  id="upiId"
                  required
                  placeholder="yourname@okbank"
                  autoComplete="off"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  disabled={loading !== null}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="upiName" className="text-xs font-medium">
                  Payee Name
                </Label>
                <Input
                  id="upiName"
                  placeholder={defaultName}
                  maxLength={50}
                  value={upiName}
                  onChange={(e) => setUpiName(e.target.value)}
                  disabled={loading !== null}
                  className="text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  Shown in your friend&apos;s UPI app. Defaults to your account
                  name.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="flex size-[132px] items-center justify-center rounded-xl bg-white p-2.5">
                {isValidUpi ? (
                  <UpiQrCode
                    value={buildUpiUri({
                      upiId: upiId.trim(),
                      name: previewName,
                    })}
                    size={112}
                  />
                ) : (
                  <span className="px-2 text-center text-[11px] text-neutral-400">
                    Enter a UPI ID to preview
                  </span>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground">
                Preview (no amount)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            {hasSaved && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={loading !== null}
                className="gap-1.5 text-xs"
              >
                {loading === "remove" ? (
                  <>
                    <Spinner size="xs" />
                    <span>Removing...</span>
                  </>
                ) : (
                  "Remove"
                )}
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={loading !== null}
              className="gap-1.5 text-xs"
            >
              {loading === "save" ? (
                <>
                  <Spinner size="xs" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>

        <p className="text-[11px] text-muted-foreground">
          UPI is the only payment method for now, so lends in other currencies
          won&apos;t show payment options yet.
        </p>
      </Card>
    </div>
  )
}
