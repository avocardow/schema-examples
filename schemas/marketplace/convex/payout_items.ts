// payout_items: Individual vendor order amounts included in a payout batch.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const payoutItems = defineTable({
  payoutId: v.id("payouts"),
  vendorOrderId: v.id("vendor_orders"),
  amount: v.number(),
  commission: v.number(),
})
  .index("by_payout_id", ["payoutId"])
  .index("by_payout_id_vendor_order_id", ["payoutId", "vendorOrderId"]);
