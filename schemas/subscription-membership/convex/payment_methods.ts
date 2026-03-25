// payment_methods: tokenized payment instruments.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const payment_methods = defineTable({
  customerId: v.id("customers"),
  type: v.union(
    v.literal("card"), v.literal("bank_account"), v.literal("paypal"),
    v.literal("sepa_debit"), v.literal("ideal"), v.literal("other")
  ),
  cardBrand: v.optional(v.string()),
  cardLast4: v.optional(v.string()),
  cardExpMonth: v.optional(v.number()),
  cardExpYear: v.optional(v.number()),
  isDefault: v.boolean(),
  providerType: v.optional(v.string()),
  providerId: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_customer_id", ["customerId"])
  .index("by_provider", ["providerType", "providerId"]);
