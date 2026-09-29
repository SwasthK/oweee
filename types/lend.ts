import { type InferSelectModel, type InferInsertModel } from "drizzle-orm"
import { lends, lendAuditLogs } from "@/db/schema"

export type Lend = InferSelectModel<typeof lends>
export type NewLend = InferInsertModel<typeof lends>

export interface AuditLogDetails {
  amount?: number | string
  borrowerName?: string
  currency?: string
  paymentAmount?: number | string
  previousPaid?: number | string
  newPaid?: number | string
  previousStatus?: string
  newStatus?: string
  isPublic?: boolean
  note?: string
  changes?: Record<string, unknown>
}

export type LendAuditLog = Omit<
  InferSelectModel<typeof lendAuditLogs>,
  "details"
> & {
  details: AuditLogDetails | null
}

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
