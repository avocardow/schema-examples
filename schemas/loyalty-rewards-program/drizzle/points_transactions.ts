// points_transactions: Immutable ledger of every point movement (earn, redeem, expire, adjust).
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { loyaltyMembers } from "./loyalty_members";
import { earningRules } from "./earning_rules";
import { promotions } from "./promotions";
import { rewardRedemptions } from "./reward_redemptions";

export const pointsTransactionType = pgEnum("points_transaction_type", ["earn", "redeem", "expire", "adjust", "bonus"]);

export const pointsTransactions = pgTable("points_transactions", {
    id: uuid("id").primaryKey().defaultRandom(),
    memberId: uuid("member_id").notNull().references(() => loyaltyMembers.id, { onDelete: "restrict" }),
    type: pointsTransactionType("type").notNull(),
    points: integer("points").notNull(),
    balanceAfter: integer("balance_after").notNull(),
    description: text("description"),
    sourceReferenceType: text("source_reference_type"),
    sourceReferenceId: text("source_reference_id"),
    earningRuleId: uuid("earning_rule_id").references(() => earningRules.id, { onDelete: "set null" }),
    promotionId: uuid("promotion_id").references(() => promotions.id, { onDelete: "set null" }),
    redemptionId: uuid("redemption_id").references(() => rewardRedemptions.id, { onDelete: "set null" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    isPending: boolean("is_pending").notNull().default(false),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  }, (table) => [
    index("idx_points_transactions_member_id_created_at").on(table.memberId, table.createdAt),
    index("idx_points_transactions_type").on(table.type),
    index("idx_points_transactions_expires_at").on(table.expiresAt),
    index("idx_points_transactions_is_pending").on(table.isPending),
    index("idx_points_transactions_source_ref").on(table.sourceReferenceType, table.sourceReferenceId),
  ]
);
