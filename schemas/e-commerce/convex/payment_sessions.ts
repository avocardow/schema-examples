// payment_sessions: Payment provider sessions tracking authorization and capture status.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const paymentSessions = defineTable({
  cartId: v.id("carts"),
  provider: v.string(),
  providerId: v.optional(v.string()),
  status: v.union(
    v.literal("pending"),
    v.literal("authorized"),
    v.literal("requires_action"),
    v.literal("completed"),
    v.literal("canceled"),
    v.literal("error")
  ),
  amount: v.number(),
  currency: v.string(),
  data: v.optional(v.any()),
  isSelected: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_cart_id", ["cartId"])
  .index("by_provider_provider_id", ["provider", "providerId"])
  .index("by_status", ["status"]);
