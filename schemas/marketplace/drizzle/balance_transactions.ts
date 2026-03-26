// balance_transactions: Immutable ledger of vendor balance changes with running totals.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { vendors } from "./vendors";

export const balanceTransactionType = pgEnum("balance_transaction_type", [
  "earning",
  "commission",
  "payout",
  "refund",
  "adjustment",
  "hold",
  "release",
]);

export const balanceTransactions = pgTable(
  "balance_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => vendors.id, { onDelete: "restrict" }),
    type: balanceTransactionType("type").notNull(),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull(),
    runningBalance: integer("running_balance").notNull(),
    referenceType: text("reference_type"),
    referenceId: text("reference_id"),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_balance_transactions_vendor_id_created_at").on(
      table.vendorId,
      table.createdAt
    ),
    index("idx_balance_transactions_type").on(table.type),
    index("idx_balance_transactions_reference_type_reference_id").on(
      table.referenceType,
      table.referenceId
    ),
  ]
);
