// invoices: local copies of billing invoices.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const invoices = defineTable({
  customerId: v.id("customers"),
  subscriptionId: v.optional(v.id("subscriptions")),
  status: v.union(
    v.literal("draft"), v.literal("open"), v.literal("paid"),
    v.literal("void"), v.literal("uncollectible")
  ),
  currency: v.string(),
  subtotal: v.number(),
  tax: v.number(),
  total: v.number(),
  amountPaid: v.number(),
  amountDue: v.number(),
  periodStart: v.optional(v.number()),
  periodEnd: v.optional(v.number()),
  dueDate: v.optional(v.number()),
  paidAt: v.optional(v.number()),
  hostedInvoiceUrl: v.optional(v.string()),
  invoicePdfUrl: v.optional(v.string()),
  metadata: v.optional(v.any()),
  providerType: v.optional(v.string()),
  providerId: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_customer_id", ["customerId"])
  .index("by_subscription_id", ["subscriptionId"])
  .index("by_status", ["status"])
  .index("by_provider", ["providerType", "providerId"]);
