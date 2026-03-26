// pay_stub_earnings: Individual earning line items on each pay stub.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  numeric,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { payStubs } from "./pay_stubs";
import { earningTypes } from "./earning_types";

export const payStubEarnings = pgTable(
  "pay_stub_earnings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    payStubId: uuid("pay_stub_id")
      .notNull()
      .references(() => payStubs.id, { onDelete: "cascade" }),
    earningTypeId: uuid("earning_type_id")
      .notNull()
      .references(() => earningTypes.id, { onDelete: "restrict" }),
    hours: numeric("hours"),
    rate: integer("rate"),
    amount: integer("amount").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_pay_stub_earnings_pay_stub_id").on(table.payStubId),
    index("idx_pay_stub_earnings_earning_type_id").on(table.earningTypeId),
  ]
);
