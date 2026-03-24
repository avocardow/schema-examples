// locations: physical or virtual venues where services are offered.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const locations = defineTable({
  name: v.string(),
  slug: v.string(),
  type: v.union(v.literal("physical"), v.literal("virtual")),
  description: v.optional(v.string()),
  addressLine1: v.optional(v.string()),
  addressLine2: v.optional(v.string()),
  city: v.optional(v.string()),
  state: v.optional(v.string()),
  postalCode: v.optional(v.string()),
  country: v.optional(v.string()),
  virtualUrl: v.optional(v.string()),
  timezone: v.string(),
  phone: v.optional(v.string()),
  email: v.optional(v.string()),
  isActive: v.boolean(),
  position: v.number(),
  updatedAt: v.number(),
})
  .index("by_type", ["type"])
  .index("by_is_active_position", ["isActive", "position"])
  .index("by_slug", ["slug"]);
