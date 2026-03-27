// affiliate_balances: Tracks monetary balances for each affiliate account.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { affiliates } from "./affiliates";

export const affiliateBalances = pgTable("affiliate_balances", {
  id: uuid("id").primaryKey().defaultRandom(),
  affiliateId: uuid("affiliate_id").notNull().unique().references(() => affiliates.id, { onDelete: "cascade" }),
  currency: text("currency").notNull(),
  available: integer("available").notNull().default(0),
  pending: integer("pending").notNull().default(0),
  totalEarned: integer("total_earned").notNull().default(0),
  totalPaidOut: integer("total_paid_out").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
});
