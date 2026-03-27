// reward_redemptions: Records of members redeeming points for rewards with fulfillment lifecycle.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const rewardRedemptions = defineTable({
  memberId: v.id("loyalty_members"),
  rewardId: v.id("rewards"),
  pointsSpent: v.number(),
  status: v.union(
    v.literal("pending"),
    v.literal("fulfilled"),
    v.literal("canceled"),
    v.literal("expired")
  ),
  couponCode: v.optional(v.string()),
  fulfilledAt: v.optional(v.number()),
  canceledAt: v.optional(v.number()),
  expiresAt: v.optional(v.number()),
  metadata: v.optional(v.any()),
  updatedAt: v.number(),
})
  .index("by_member_id_and_creation_time", ["memberId", "_creationTime"])
  .index("by_reward_id", ["rewardId"])
  .index("by_status", ["status"]);
