// shipping_methods: Available delivery options with pricing and constraints per zone.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const shippingMethods = defineTable({
  zoneId: v.id("shipping_zones"),
  profileId: v.optional(v.id("shipping_profiles")),
  name: v.string(),
  description: v.optional(v.string()),
  price: v.number(),
  currency: v.string(),
  minDeliveryDays: v.optional(v.number()),
  maxDeliveryDays: v.optional(v.number()),
  minOrderAmount: v.optional(v.number()),
  maxWeightGrams: v.optional(v.number()),
  isActive: v.boolean(),
  sortOrder: v.number(),
  updatedAt: v.number(),
})
  .index("by_zone_id_is_active_sort_order", ["zoneId", "isActive", "sortOrder"])
  .index("by_profile_id", ["profileId"]);
