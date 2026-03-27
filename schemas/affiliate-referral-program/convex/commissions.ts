// commissions: Tracks earned commissions per conversion, with approval and payout lifecycle.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const commissions = defineTable({
  conversionId: v.id("conversions"),
  affiliateId: v.id("affiliates"),
  programId: v.id("programs"),
  amount: v.number(),
  currency: v.string(),
  status: v.union(v.literal("pending"), v.literal("approved"), v.literal("paid"), v.literal("voided")),
  commissionType: v.union(v.literal("percentage"), v.literal("flat"), v.literal("hybrid")),
  commissionRate: v.optional(v.number()),
  commissionFlat: v.optional(v.number()),
  tierLevel: v.number(),
  approvedAt: v.optional(v.number()),
  paidAt: v.optional(v.number()),
  voidedAt: v.optional(v.number()),
  voidedReason: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_conversion_id", ["conversionId"])
  .index("by_affiliate_id_and_status", ["affiliateId", "status"])
  .index("by_program_id_and_status", ["programId", "status"])
  .index("by_status", ["status"])
  .index("by_creation_time", ["_creationTime"]);
