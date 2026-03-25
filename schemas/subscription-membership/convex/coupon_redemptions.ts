// coupon_redemptions: records of applied coupons.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const coupon_redemptions = defineTable({
  couponId: v.id("coupons"),
  customerId: v.id("customers"),
  subscriptionId: v.optional(v.id("subscriptions")),
  redeemedAt: v.number(),
  providerType: v.optional(v.string()),
  providerId: v.optional(v.string()),
})
  .index("by_coupon_id", ["couponId"])
  .index("by_customer_id", ["customerId"])
  .index("by_subscription_id", ["subscriptionId"]);
