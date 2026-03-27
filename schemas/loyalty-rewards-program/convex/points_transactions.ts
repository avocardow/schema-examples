// points_transactions: Immutable ledger of every point movement (earn, redeem, expire, adjust).
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const pointsTransactions = defineTable({
  memberId: v.id("loyalty_members"),
  type: v.union(
    v.literal("earn"),
    v.literal("redeem"),
    v.literal("expire"),
    v.literal("adjust"),
    v.literal("bonus")
  ),
  points: v.number(),
  balanceAfter: v.number(),
  description: v.optional(v.string()),
  sourceReferenceType: v.optional(v.string()),
  sourceReferenceId: v.optional(v.string()),
  earningRuleId: v.optional(v.id("earning_rules")),
  promotionId: v.optional(v.id("promotions")),
  redemptionId: v.optional(v.id("reward_redemptions")),
  expiresAt: v.optional(v.number()),
  isPending: v.boolean(),
  confirmedAt: v.optional(v.number()),
})
  .index("by_member_id_and_creation_time", ["memberId", "_creationTime"])
  .index("by_type", ["type"])
  .index("by_expires_at", ["expiresAt"])
  .index("by_is_pending", ["isPending"])
  .index("by_source_reference", ["sourceReferenceType", "sourceReferenceId"]);
