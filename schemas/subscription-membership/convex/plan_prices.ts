// plan_prices: price points for plans.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const plan_prices = defineTable({
  planId: v.id("plans"),
  nickname: v.optional(v.string()),
  type: v.union(
    v.literal("recurring"), v.literal("one_time"), v.literal("usage_based")
  ),
  amount: v.number(),
  currency: v.string(),
  interval: v.optional(v.union(
    v.literal("day"), v.literal("week"), v.literal("month"), v.literal("year")
  )),
  intervalCount: v.number(),
  trialPeriodDays: v.optional(v.number()),
  isActive: v.boolean(),
  metadata: v.optional(v.any()),
  providerType: v.optional(v.string()),
  providerId: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_plan_id", ["planId"])
  .index("by_is_active", ["isActive"])
  .index("by_provider", ["providerType", "providerId"]);
