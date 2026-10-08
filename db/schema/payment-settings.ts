import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { user } from "./auth"

export const paymentSettings = pgTable("payment_settings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  upiId: text("upi_id").notNull(),
  upiName: text("upi_name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})
