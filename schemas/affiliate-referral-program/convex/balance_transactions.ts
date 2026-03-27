// balance_transactions: Ledger of all balance-affecting events for each affiliate.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const balanceTransactions = defineTable({
  affiliateId: v.id("affiliates"),
  type: v.union(v.literal("commission"), v.literal("payout"), v.literal("reversal"), v.literal("adjustment")),
  amount: v.number(),
  currency: v.string(),
  runningBalance: v.number(),
  referenceType: v.optional(v.string()),
  referenceId: v.optional(v.string()),
  description: v.optional(v.string()),
})
  .index("by_affiliate_id_and_creation_time", ["affiliateId", "_creationTime"])
  .index("by_type", ["type"])
  .index("by_reference_type_and_reference_id", ["referenceType", "referenceId"]);
