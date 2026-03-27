// loyalty_members: Enrollment of a user in a loyalty program with cached point balances.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const loyaltyMembers = defineTable({
  programId: v.id("loyalty_programs"),
  userId: v.id("users"),
  memberNumber: v.string(),
  status: v.union(
    v.literal("active"),
    v.literal("suspended"),
    v.literal("banned")
  ),
  pointsBalance: v.number(),
  pointsPending: v.number(),
  lifetimePoints: v.number(),
  pointsRedeemed: v.number(),
  pointsExpired: v.number(),
  enrolledAt: v.number(),
  suspendedAt: v.optional(v.number()),
  metadata: v.optional(v.any()),
  updatedAt: v.number(),
})
  .index("by_program_id_and_user_id", ["programId", "userId"])
  .index("by_member_number", ["memberNumber"])
  .index("by_user_id", ["userId"])
  .index("by_status", ["status"])
  .index("by_points_balance", ["pointsBalance"]);
