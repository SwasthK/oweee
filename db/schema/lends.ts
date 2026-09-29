import {
  pgTable,
  text,
  timestamp,
  boolean,
  numeric,
  pgEnum,
} from "drizzle-orm/pg-core"
import { user } from "./auth"

export const lendStatusEnum = pgEnum("lend_status", [
  "open",
  "partial",
  "closed",
])

export const lends = pgTable("lends", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  borrowerName: text("borrower_name").notNull(),
  borrowerContact: text("borrower_contact"),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  paidAmount: numeric("paid_amount", { precision: 12, scale: 2 })
    .notNull()
    .default("0.00"),
  currency: text("currency").notNull().default("INR"),
  status: lendStatusEnum("status").notNull().default("open"),
  lentAt: timestamp("lent_at", { withTimezone: true }).notNull().defaultNow(),
  dueDate: timestamp("due_date", { withTimezone: true }),
  notes: text("notes"),
  shareToken: text("share_token")
    .notNull()
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
  isPublic: boolean("is_public").notNull().default(false),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})
