// affiliate_balances: Running balance per affiliate and currency, tracking available, pending, earned, and paid-out totals.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const affiliateBalances = defineTable({
  affiliateId: v.id("affiliates"),
  currency: v.string(),
  available: v.number(),
  pending: v.number(),
  totalEarned: v.number(),
  totalPaidOut: v.number(),
  updatedAt: v.number(),
})
  .index("by_affiliate_id", ["affiliateId"]);
