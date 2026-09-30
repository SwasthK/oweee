"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toggleShareAction } from "@/lib/actions/lends"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  CheckCircle,
  CopyIcon,
  ExternalLinkIcon,
  LinkIcon,
} from "@/components/ui/icons"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface ShareLendDialogProps {
  lend: {
    id: string
    borrowerName: string
    shareToken: string
    isPublic: boolean
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareLendDialog({
  lend,
  open,
  onOpenChange,
}: ShareLendDialogProps) {
  const router = useRouter()
  const [overridePublic, setOverridePublic] = React.useState<boolean | null>(null)
  const [prevProps, setPrevProps] = React.useState({
    id: lend.id,
    isPublic: lend.isPublic,
    open,
  })
  const [toggling, setToggling] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  if (
    prevProps.id !== lend.id ||
    prevProps.isPublic !== lend.isPublic ||
    prevProps.open !== open
  ) {
    setPrevProps({ id: lend.id, isPublic: lend.isPublic, open })
    setOverridePublic(null)
  }

  const isPublic = overridePublic !== null ? overridePublic : lend.isPublic

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/share/${lend.shareToken}`
      : `/share/${lend.shareToken}`

  const handleToggle = async (nextValue: boolean) => {
    setToggling(true)
    setOverridePublic(nextValue)
    try {
      const res = await toggleShareAction({
        lendId: lend.id,
        isPublic: nextValue,
      })
      if (res.success) {
        router.refresh()
      } else {
        setOverridePublic(lend.isPublic)
      }
    } catch (err) {
      console.error("Failed to toggle public share:", err)
      setOverridePublic(lend.isPublic)
    } finally {
      setToggling(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border/80 bg-card p-6 shadow-lg sm:rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg border border-border/70 bg-muted text-primary">
              <LinkIcon className="size-4" />
            </div>
            <div>
              <DialogTitle className="font-heading text-lg tracking-tight">
                Share Lend Record
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Public read-only link for {lend.borrowerName}&apos;s record.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Main Toggle Row */}
          <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/30 p-3.5">
            <div className="space-y-0.5 pr-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">
                  Public Share Link
                </span>
                {isPublic && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {isPublic
                  ? "Anyone with the link can view this lend record"
                  : "Link access is disabled and private"}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isPublic}
              disabled={toggling}
              onClick={() => handleToggle(!isPublic)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                isPublic ? "bg-primary" : "bg-muted-foreground/30"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-flex size-5 items-center justify-center rounded-full bg-background shadow-md ring-0 transition duration-200 ease-in-out",
                  isPublic ? "translate-x-5" : "translate-x-0"
                )}
              >
                {toggling && <Spinner size="xs" />}
              </span>
            </button>
          </div>

          {/* Conditional content based on enabled/disabled */}
          {isPublic ? (
            <div className="space-y-2 rounded-xl border border-border/60 bg-card p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Shareable URL</span>
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground hover:underline"
                >
                  <span>Preview</span>
                  <ExternalLinkIcon className="size-3" />
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={shareUrl}
                  className="font-mono text-[11px] bg-muted/40 select-all"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-1.5 shrink-0 text-xs cursor-pointer"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="size-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="size-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 p-5 text-center">
              <p className="text-xs text-muted-foreground">
                The public link is currently turned off.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={toggling}
                onClick={() => handleToggle(true)}
                className="mt-3 gap-1.5 text-xs cursor-pointer"
              >
                {toggling ? (
                  <>
                    <Spinner size="xs" />
                    <span>Enabling...</span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="size-3.5" />
                    <span>Enable Public Link</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs cursor-pointer"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
