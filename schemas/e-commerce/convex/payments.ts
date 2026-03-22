// payments: Payment transactions linked to orders.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const payments = defineTable({
  orderId: v.id("orders"),
  paymentMethodId: v.optional(v.id("payment_methods")),
  provider: v.string(),
  providerId: v.optional(v.string()),
  type: v.union(
    v.literal("authorization"),
    v.literal("capture"),
    v.literal("sale"),
  ),
  status: v.union(
    v.literal("pending"),
    v.literal("succeeded"),
    v.literal("failed"),
    v.literal("canceled"),
  ),
  currency: v.string(),
  amount: v.number(),
  providerFee: v.optional(v.number()),
  metadata: v.optional(v.any()),
  errorMessage: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_order_id", ["orderId"])
  .index("by_provider_provider_id", ["provider", "providerId"])
  .index("by_status", ["status"]);
