import { db } from "@/db"
import { lendAuditLogs } from "@/db/schema"
import { desc, eq } from "drizzle-orm"

export interface AuditLogParams {
  lendId: string
  userId?: string | null
  action:
    | "created"
    | "updated"
    | "payment_recorded"
    | "status_changed"
    | "share_toggled"
    | "deleted"
  details?: Record<string, any>
}

export async function recordAuditLog(params: AuditLogParams) {
  try {
    const [inserted] = await db
      .insert(lendAuditLogs)
      .values({
        lendId: params.lendId,
        userId: params.userId ?? null,
        action: params.action,
        details: params.details ?? {},
      })
      .returning()

    return inserted
  } catch (error) {
    console.error("Failed to record audit log:", error)
    // Non-blocking: audit logs should not crash the main transaction
    return null
  }
}

export async function getAuditLogsForLend(lendId: string) {
  return await db
    .select()
    .from(lendAuditLogs)
    .where(eq(lendAuditLogs.lendId, lendId))
    .orderBy(desc(lendAuditLogs.createdAt))
}
