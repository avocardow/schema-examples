// orders: ticket purchase transactions with payment and buyer details.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const orders = defineTable({
  eventId: v.id("events"),
  userId: v.id("users"),
  promoCodeId: v.optional(v.id("promo_codes")),
  subtotal: v.int64(),
  discountAmount: v.int64(),
  total: v.int64(),
  currency: v.string(),
  status: v.union(
    v.literal("pending"),
    v.literal("confirmed"),
    v.literal("cancelled"),
    v.literal("refunded")
  ),
  paymentStatus: v.union(
    v.literal("not_required"),
    v.literal("pending"),
    v.literal("paid"),
    v.literal("refunded"),
    v.literal("partially_refunded"),
    v.literal("failed")
  ),
  paymentMethod: v.optional(v.string()),
  buyerName: v.string(),
  buyerEmail: v.string(),
  cancelledAt: v.optional(v.number()),
  refundedAt: v.optional(v.number()),
  confirmedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_event_id_status", ["eventId", "status"])
  .index("by_user_id", ["userId"])
  .index("by_status", ["status"])
  .index("by_buyer_email", ["buyerEmail"]);
