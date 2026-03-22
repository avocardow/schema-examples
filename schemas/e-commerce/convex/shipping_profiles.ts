// shipping_profiles: Reusable shipping configuration templates for products.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const shippingProfiles = defineTable({
  name: v.string(),
  type: v.union(
    v.literal("default"),
    v.literal("digital"),
    v.literal("custom")
  ),
  description: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_type", ["type"]);
