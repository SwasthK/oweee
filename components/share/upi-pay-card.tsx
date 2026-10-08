"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  CopyIcon,
  ExternalLinkIcon,
  Info,
} from "@/components/ui/icons"
import { UpiQrCode } from "@/components/share/upi-qr-code"
import { formatMoney } from "@/lib/currency"
import { buildUpiUri } from "@/lib/upi"

interface UpiPayCardProps {
  upiId: string
  upiName: string | null
  amount: number
  note: string
}

export function UpiPayCard({ upiId, upiName, amount, note }: UpiPayCardProps) {
  const [copied, setCopied] = React.useState(false)
  const uri = buildUpiUri({ upiId, name: upiName, amount, note })

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy UPI ID:", err)
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-border/50 bg-muted/30 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-xs font-semibold text-foreground">UPI</div>
          <div className="text-[11px] text-muted-foreground">
            Scan with any UPI app to pay {formatMoney(amount, "INR")}. The
            amount is pre-filled.
          </div>
        </div>
        <Badge variant="outline" className="shrink-0 text-[10px]">
          INR
        </Badge>
      </div>

      <div className="flex justify-center">
        <div className="rounded-xl bg-white p-3">
          <UpiQrCode
            value={uri}
            size={176}
            title={`UPI QR code to pay ${upiName || upiId}`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 rounded-lg border border-border/40 bg-background/60 px-3 py-2">
          <div className="min-w-0">
            {upiName && (
              <div className="truncate text-[11px] text-muted-foreground">
                {upiName}
              </div>
            )}
            <div className="truncate font-mono text-xs text-foreground">
              {upiId}
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleCopy}
            className="shrink-0 cursor-pointer gap-1 text-xs"
          >
            {copied ? (
              <>
                <CheckCircle className="size-3.5 text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <CopyIcon className="size-3.5" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>

        <Button
          size="sm"
          render={<a href={uri} />}
          className="w-full gap-1.5 text-xs sm:hidden"
        >
          <ExternalLinkIcon className="size-3.5" />
          <span>Open in UPI app</span>
        </Button>
      </div>

      <div className="flex gap-2 rounded-lg border border-border/40 bg-background/60 p-2.5 text-[11px] leading-relaxed text-muted-foreground">
        <Info className="mt-px size-3.5 shrink-0" />
        <p>
          Already paid? You can ignore this QR. Payments aren&apos;t tracked
          automatically, so the balance updates once {upiName || "the lender"}{" "}
          confirms they received it.
        </p>
      </div>
    </div>
  )
}
