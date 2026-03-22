// prices: Currency-specific pricing for product variants, supporting quantity tiers and time-bound promotions.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const prices = defineTable({
  variantId: v.id("product_variants"),
  currency: v.string(),
  amount: v.number(),
  compareAtAmount: v.optional(v.number()),
  minQuantity: v.optional(v.number()),
  startsAt: v.optional(v.number()),
  endsAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_variantId_currency", ["variantId", "currency"])
  .index("by_startsAt_endsAt", ["startsAt", "endsAt"]);
