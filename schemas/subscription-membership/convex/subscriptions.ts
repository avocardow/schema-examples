// subscriptions: core subscription records.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const subscriptions = defineTable({
  customerId: v.id("customers"),
  status: v.union(
    v.literal("trialing"), v.literal("active"), v.literal("past_due"),
    v.literal("paused"), v.literal("canceled"), v.literal("expired"),
    v.literal("incomplete")
  ),
  currentPeriodStart: v.optional(v.number()),
  currentPeriodEnd: v.optional(v.number()),
  trialStart: v.optional(v.number()),
  trialEnd: v.optional(v.number()),
  canceledAt: v.optional(v.number()),
  endedAt: v.optional(v.number()),
  cancelAtPeriodEnd: v.boolean(),
  pausedAt: v.optional(v.number()),
  resumesAt: v.optional(v.number()),
  billingCycleAnchor: v.optional(v.number()),
  couponId: v.optional(v.id("coupons")),
  metadata: v.optional(v.any()),
  providerType: v.optional(v.string()),
  providerId: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_customer_id", ["customerId"])
  .index("by_status", ["status"])
  .index("by_provider", ["providerType", "providerId"]);
