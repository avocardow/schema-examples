// balance_transactions: Tracks all balance-affecting transactions for affiliate accounts.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { affiliates } from "./affiliates";

export const balanceTransactionType = pgEnum("balance_transaction_type", ["commission", "payout", "reversal", "adjustment"]);

export const balanceTransactions = pgTable("balance_transactions", {
    id: uuid("id").primaryKey().defaultRandom(),
    affiliateId: uuid("affiliate_id").notNull().references(() => affiliates.id, { onDelete: "restrict" }),
    type: balanceTransactionType("type").notNull(),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull(),
    runningBalance: integer("running_balance").notNull(),
    referenceType: text("reference_type"),
    referenceId: text("reference_id"),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  }, (table) => [
    index("idx_balance_transactions_affiliate_id_created_at").on(table.affiliateId, table.createdAt),
    index("idx_balance_transactions_type").on(table.type),
    index("idx_balance_transactions_reference").on(table.referenceType, table.referenceId),
  ]
);
