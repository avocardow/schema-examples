// payouts: Records of payments made to affiliates, tracking status, amounts, fees, and completion.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const payouts = defineTable({
  affiliateId: v.id("affiliates"),
  payoutNumber: v.string(),
  status: v.union(
    v.literal("pending"),
    v.literal("processing"),
    v.literal("completed"),
    v.literal("failed"),
    v.literal("canceled"),
  ),
  currency: v.string(),
  amount: v.number(),
  fee: v.number(),
  netAmount: v.number(),
  payoutMethod: v.optional(v.string()),
  providerId: v.optional(v.string()),
  note: v.optional(v.string()),
  completedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_payout_number", ["payoutNumber"])
  .index("by_affiliate_id_and_status", ["affiliateId", "status"])
  .index("by_status", ["status"])
  .index("by_creation_time", ["_creationTime"]);
