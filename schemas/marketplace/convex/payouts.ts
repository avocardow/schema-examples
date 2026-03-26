// payouts: Scheduled vendor payment disbursements with provider tracking.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const payouts = defineTable({
  vendorId: v.id("vendors"),
  payoutNumber: v.string(),
  status: v.union(
    v.literal("pending"),
    v.literal("processing"),
    v.literal("completed"),
    v.literal("failed"),
    v.literal("canceled")
  ),
  currency: v.string(),
  amount: v.number(),
  fee: v.number(),
  netAmount: v.number(),
  provider: v.optional(v.string()),
  providerId: v.optional(v.string()),
  periodStart: v.number(),
  periodEnd: v.number(),
  note: v.optional(v.string()),
  completedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_vendor_id_status", ["vendorId", "status"])
  .index("by_status", ["status"])
  .index("by_period", ["periodStart", "periodEnd"])
  .index("by_payout_number", ["payoutNumber"]);
