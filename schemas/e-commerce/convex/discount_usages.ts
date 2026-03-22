// discount_usages: Tracks each application of a discount to an order for enforcing usage limits.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const discountUsages = defineTable({
  discountId: v.id("discounts"),
  orderId: v.id("orders"),
  userId: v.optional(v.id("users")),
})
  .index("by_discountId_userId", ["discountId", "userId"])
  .index("by_discountId_orderId", ["discountId", "orderId"]);
