import { type InferSelectModel, type InferInsertModel } from "drizzle-orm"
import { lends, lendAuditLogs } from "@/db/schema"

export type Lend = InferSelectModel<typeof lends>
export type NewLend = InferInsertModel<typeof lends>

export type LendAuditLog = InferSelectModel<typeof lendAuditLogs>
export type NewLendAuditLog = InferInsertModel<typeof lendAuditLogs>

export type LendStatus = "open" | "partial" | "closed"

export interface LendMetrics {
  totalLent: number
  totalPaid: number
  totalOutstanding: number
  activeCount: number
  closedCount: number
}

export interface LendWithAuditLogs extends Lend {
  auditLogs: LendAuditLog[]
}
