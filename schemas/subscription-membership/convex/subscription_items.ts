// subscription_items: line items within a subscription.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const subscription_items = defineTable({
  subscriptionId: v.id("subscriptions"),
  planPriceId: v.id("plan_prices"),
  quantity: v.number(),
  metadata: v.optional(v.any()),
  providerType: v.optional(v.string()),
  providerId: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_subscription_and_price", ["subscriptionId", "planPriceId"])
  .index("by_plan_price_id", ["planPriceId"]);
