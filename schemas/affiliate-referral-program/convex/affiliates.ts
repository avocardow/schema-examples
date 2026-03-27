// affiliates: Individual affiliate accounts linked to a program and user, with referral/coupon codes and payout info.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const affiliates = defineTable({
  programId: v.id("programs"),
  userId: v.id("users"),
  referralCode: v.string(),
  couponCode: v.optional(v.string()),
  status: v.union(v.literal("pending"), v.literal("active"), v.literal("suspended"), v.literal("rejected")),
  customCommissionRate: v.optional(v.number()),
  payoutMethod: v.optional(v.string()),
  payoutEmail: v.optional(v.string()),
  metadata: v.optional(v.any()),
  referredBy: v.optional(v.id("affiliates")),
  approvedAt: v.optional(v.number()),
  suspendedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_program_id_and_user_id", ["programId", "userId"])
  .index("by_referral_code", ["referralCode"])
  .index("by_user_id", ["userId"])
  .index("by_status", ["status"])
  .index("by_referred_by", ["referredBy"]);
