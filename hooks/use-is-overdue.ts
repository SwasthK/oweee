"use client"

import * as React from "react"

let cachedNow: number | null = null

function getNowSnapshot(): number {
  if (cachedNow === null) {
    cachedNow = Date.now()
  }
  return cachedNow
}

function getServerSnapshot(): number {
  return 0
}

function subscribe(callback: () => void) {
  // Update the snapshot at most once per minute
  const interval = setInterval(() => {
    cachedNow = Date.now()
    callback()
  }, 60000)

  return () => clearInterval(interval)
}

export function useIsOverdue(
  dueDate: Date | string | null | undefined,
  isClosed: boolean
): boolean {
  const now = React.useSyncExternalStore(
    subscribe,
    getNowSnapshot,
    getServerSnapshot
  )

  if (isClosed || !dueDate || !now) {
    return false
  }

  return new Date(dueDate).getTime() < now
}
