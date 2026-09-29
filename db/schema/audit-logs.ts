import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core"
import { user } from "./auth"
import { lends } from "./lends"

export const lendAuditLogs = pgTable("lend_audit_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  lendId: text("lend_id")
    .notNull()
    .references(() => lends.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  details: jsonb("details").$type<{
    amount?: string | number
    paidAmount?: string | number
    paymentAmount?: string | number
    previousStatus?: string
    newStatus?: string
    note?: string
    [key: string]: any
  }>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
