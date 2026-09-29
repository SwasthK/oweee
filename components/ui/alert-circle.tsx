"use client"

import * as React from "react"
import { AlertTriangle } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

export function AlertCircle({ className, ...props }: React.ComponentProps<"svg">) {
  return <AlertTriangle className={cn("size-4 shrink-0", className)} {...props} />
}
