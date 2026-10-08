"use server"

import { db } from "@/db"
import { lends, paymentSettings, user } from "@/db/schema"
import { getAuditLogsForLend } from "./audit"
import { and, eq, isNull } from "drizzle-orm"
import type { AuditLogDetails } from "@/types/lend"

type AuditLog = Awaited<ReturnType<typeof getAuditLogsForLend>>[number]

// Build the activity shown on public links: only the actions a borrower needs,
// and only the detail fields each one renders (no contact info, notes, etc.).
function toPublicActivity(logs: AuditLog[]) {
  const activity: Array<{
    id: string
    action: string
    details: AuditLogDetails
    createdAt: Date
  }> = []
  let currentAmount: number | null = null

  // Logs arrive newest first; walk oldest first to detect real amount changes.
  for (const log of [...logs].reverse()) {
    const details = (log.details ?? {}) as AuditLogDetails
    let publicDetails: AuditLogDetails | null = null

    if (log.action === "created") {
      currentAmount = Number(details.amount)
      publicDetails = { amount: details.amount }
    } else if (log.action === "payment_recorded") {
      publicDetails = {
        paymentAmount: details.paymentAmount,
        note: details.note ?? undefined,
      }
    } else if (log.action === "status_changed") {
      publicDetails = { newStatus: details.newStatus }
    } else if (log.action === "updated") {
      // The edit form sends every field, so only surface actual amount edits.
      const amount = details.changes?.amount
      if (amount !== undefined && Number(amount) !== currentAmount) {
        currentAmount = Number(amount)
        publicDetails = { amount: amount as number | string }
      }
    }

    if (publicDetails) {
      activity.push({
        id: log.id,
        action: log.action,
        details: publicDetails,
        createdAt: log.createdAt,
      })
    }
  }

  return activity.reverse()
}

export async function getPublicLendByToken(shareToken: string) {
  if (!shareToken || shareToken.trim().length === 0) {
    return null
  }

  const [row] = await db
    .select({
      id: lends.id,
      borrowerName: lends.borrowerName,
      amount: lends.amount,
      paidAmount: lends.paidAmount,
      currency: lends.currency,
      status: lends.status,
      lentAt: lends.lentAt,
      dueDate: lends.dueDate,
      notes: lends.notes,
      isPublic: lends.isPublic,
      createdAt: lends.createdAt,
      upiId: paymentSettings.upiId,
      upiName: paymentSettings.upiName,
      ownerName: user.name,
    })
    .from(lends)
    .leftJoin(paymentSettings, eq(paymentSettings.userId, lends.userId))
    .leftJoin(user, eq(user.id, lends.userId))
    .where(
      and(
        eq(lends.shareToken, shareToken),
        eq(lends.isPublic, true),
        isNull(lends.deletedAt)
      )
    )

  if (!row) {
    return null
  }

  const { upiId, upiName, ownerName, ...lend } = row
  const auditLogs = await getAuditLogsForLend(lend.id)

  // Only expose the lender's UPI ID when it can be used: UPI is INR-only,
  // and there must still be a balance to pay.
  const hasBalance = Number(lend.amount) - Number(lend.paidAmount) > 0
  const canPayWithUpi =
    !!upiId &&
    lend.currency.toUpperCase() === "INR" &&
    lend.status !== "closed" &&
    hasBalance

  return {
    ...lend,
    payment: canPayWithUpi
      ? { upiId, upiName: upiName || ownerName || null }
      : null,
    auditLogs: toPublicActivity(auditLogs),
  }
}
