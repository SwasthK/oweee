"use server"

import { db } from "@/db"
import { lends } from "@/db/schema"
import { getAuditLogsForLend } from "./audit"
import { and, eq, isNull } from "drizzle-orm"

export async function getPublicLendByToken(shareToken: string) {
  if (!shareToken || shareToken.trim().length === 0) {
    return null
  }

  const [lend] = await db
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
    })
    .from(lends)
    .where(
      and(
        eq(lends.shareToken, shareToken),
        eq(lends.isPublic, true),
        isNull(lends.deletedAt)
      )
    )

  if (!lend) {
    return null
  }

  const auditLogs = await getAuditLogsForLend(lend.id)

  return {
    ...lend,
    auditLogs: auditLogs.map((log) => ({
      id: log.id,
      action: log.action,
      details: log.details,
      createdAt: log.createdAt,
    })),
  }
}
