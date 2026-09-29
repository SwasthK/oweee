"use client"

import * as React from "react"

const emptySubscribe = () => () => {}

export function useIsOverdue(
  dueDate: Date | string | null | undefined,
  isClosed: boolean
): boolean {
  const now = React.useSyncExternalStore(
    emptySubscribe,
    () => Date.now(),
    () => 0
  )

  if (isClosed || !dueDate || !now) {
    return false
  }

  return new Date(dueDate).getTime() < now
}
