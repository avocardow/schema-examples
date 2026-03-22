// orders: Completed purchase records with snapshotted shipping and billing details.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const orders = defineTable({
  orderNumber: v.string(),
  userId: v.optional(v.id("users")),
  email: v.string(),
  status: v.union(
    v.literal("pending"),
    v.literal("confirmed"),
    v.literal("processing"),
    v.literal("shipped"),
    v.literal("delivered"),
    v.literal("canceled"),
    v.literal("refunded")
  ),
  currency: v.string(),
  subtotal: v.number(),
  discountTotal: v.number(),
  taxTotal: v.number(),
  shippingTotal: v.number(),
  grandTotal: v.number(),
  paymentStatus: v.union(
    v.literal("unpaid"),
    v.literal("partially_paid"),
    v.literal("paid"),
    v.literal("partially_refunded"),
    v.literal("refunded")
  ),
  fulfillmentStatus: v.union(
    v.literal("unfulfilled"),
    v.literal("partially_fulfilled"),
    v.literal("fulfilled")
  ),
  shippingName: v.optional(v.string()),
  shippingAddressLine1: v.optional(v.string()),
  shippingAddressLine2: v.optional(v.string()),
  shippingCity: v.optional(v.string()),
  shippingRegion: v.optional(v.string()),
  shippingPostalCode: v.optional(v.string()),
  shippingCountry: v.optional(v.string()),
  shippingPhone: v.optional(v.string()),
  billingName: v.optional(v.string()),
  billingAddressLine1: v.optional(v.string()),
  billingAddressLine2: v.optional(v.string()),
  billingCity: v.optional(v.string()),
  billingRegion: v.optional(v.string()),
  billingPostalCode: v.optional(v.string()),
  billingCountry: v.optional(v.string()),
  discountCode: v.optional(v.string()),
  note: v.optional(v.string()),
  canceledAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_order_number", ["orderNumber"])
  .index("by_user_id", ["userId"])
  .index("by_status", ["status"])
  .index("by_payment_status", ["paymentStatus"])
  .index("by_fulfillment_status", ["fulfillmentStatus"])
  .index("by_creation_time", ["_creationTime"]);
