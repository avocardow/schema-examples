// reward_redemptions: Records of members redeeming points for rewards with fulfillment lifecycle.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { loyaltyMembers } from "./loyalty_members";
import { rewards } from "./rewards";

export const redemptionStatus = pgEnum("redemption_status", ["pending", "fulfilled", "canceled", "expired"]);

export const rewardRedemptions = pgTable("reward_redemptions", {
    id: uuid("id").primaryKey().defaultRandom(),
    memberId: uuid("member_id").notNull().references(() => loyaltyMembers.id, { onDelete: "restrict" }),
    rewardId: uuid("reward_id").notNull().references(() => rewards.id, { onDelete: "restrict" }),
    pointsSpent: integer("points_spent").notNull(),
    status: redemptionStatus("status").notNull().default("pending"),
    couponCode: text("coupon_code"),
    fulfilledAt: timestamp("fulfilled_at", { withTimezone: true }),
    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  }, (table) => [
    index("idx_reward_redemptions_member_id_created_at").on(table.memberId, table.createdAt),
    index("idx_reward_redemptions_reward_id").on(table.rewardId),
    index("idx_reward_redemptions_status").on(table.status),
  ]
);
