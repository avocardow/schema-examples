// shipping_zones: Geographic regions grouped by country for shipping rate calculation.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const shippingZones = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  countries: v.array(v.string()),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_is_active", ["isActive"]);
