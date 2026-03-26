// vendor_balances: Running financial balances for vendor available and pending funds.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const vendorBalances = defineTable({
  vendorId: v.id("vendors"),
  currency: v.string(),
  available: v.number(),
  pending: v.number(),
  totalEarned: v.number(),
  totalPaidOut: v.number(),
  updatedAt: v.number(),
})
  .index("by_vendor_id", ["vendorId"]);
