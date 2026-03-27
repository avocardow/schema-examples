// payout_items: Links individual commissions to a payout, recording the amount disbursed per commission.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const payoutItems = defineTable({
  payoutId: v.id("payouts"),
  commissionId: v.id("commissions"),
  amount: v.number(),
})
  .index("by_payout_id_and_commission_id", ["payoutId", "commissionId"])
  .index("by_commission_id", ["commissionId"]);
