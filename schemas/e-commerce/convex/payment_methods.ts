// payment_methods: Saved payment instruments for users.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const paymentMethods = defineTable({
  userId: v.id("users"),
  type: v.union(
    v.literal("card"),
    v.literal("bank_account"),
    v.literal("paypal"),
    v.literal("apple_pay"),
    v.literal("google_pay"),
  ),
  provider: v.string(),
  providerId: v.string(),
  label: v.optional(v.string()),
  lastFour: v.optional(v.string()),
  brand: v.optional(v.string()),
  expMonth: v.optional(v.number()),
  expYear: v.optional(v.number()),
  isDefault: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_user_id", ["userId"])
  .index("by_provider_provider_id", ["provider", "providerId"]);
