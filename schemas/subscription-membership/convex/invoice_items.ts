// invoice_items: line items on invoices.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const invoice_items = defineTable({
  invoiceId: v.id("invoices"),
  planPriceId: v.optional(v.id("plan_prices")),
  description: v.string(),
  amount: v.number(),
  currency: v.string(),
  quantity: v.number(),
  isProration: v.boolean(),
  periodStart: v.optional(v.number()),
  periodEnd: v.optional(v.number()),
  providerType: v.optional(v.string()),
  providerId: v.optional(v.string()),
})
  .index("by_invoice_id", ["invoiceId"])
  .index("by_plan_price_id", ["planPriceId"]);
