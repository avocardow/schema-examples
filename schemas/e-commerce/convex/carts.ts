// carts: Shopping carts supporting both authenticated and guest users.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const carts = defineTable({
  userId: v.optional(v.id("users")),
  sessionId: v.optional(v.string()),
  currency: v.string(),
  shippingAddressId: v.optional(v.id("addresses")),
  billingAddressId: v.optional(v.id("addresses")),
  discountCode: v.optional(v.string()),
  note: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_user_id", ["userId"])
  .index("by_session_id", ["sessionId"]);
