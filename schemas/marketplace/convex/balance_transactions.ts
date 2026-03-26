// balance_transactions: Ledger entries tracking all vendor balance movements.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const balanceTransactions = defineTable({
  vendorId: v.id("vendors"),
  type: v.union(
    v.literal("earning"),
    v.literal("commission"),
    v.literal("payout"),
    v.literal("refund"),
    v.literal("adjustment"),
    v.literal("hold"),
    v.literal("release")
  ),
  amount: v.number(),
  currency: v.string(),
  runningBalance: v.number(),
  referenceType: v.optional(v.string()),
  referenceId: v.optional(v.string()),
  description: v.optional(v.string()),
})
  .index("by_vendor_id_created", ["vendorId", "_creationTime"])
  .index("by_type", ["type"])
  .index("by_reference", ["referenceType", "referenceId"]);
