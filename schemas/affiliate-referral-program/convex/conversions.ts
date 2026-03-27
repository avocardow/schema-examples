// conversions: Tracks individual conversion events tied to a referral and affiliate, with amount, status, and approval workflow.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const conversions = defineTable({
  referralId: v.id("referrals"),
  affiliateId: v.id("affiliates"),
  externalId: v.optional(v.string()),
  referenceType: v.optional(v.string()),
  amount: v.number(),
  currency: v.string(),
  status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"), v.literal("reversed")),
  metadata: v.optional(v.any()),
  approvedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_referral_id", ["referralId"])
  .index("by_affiliate_id_and_status", ["affiliateId", "status"])
  .index("by_external_id", ["externalId"])
  .index("by_status", ["status"])
  .index("by_creation_time", ["_creationTime"]);
