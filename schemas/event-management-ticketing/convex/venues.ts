// venues: physical, virtual, or hybrid locations where events take place.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const venues = defineTable({
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  type: v.union(
    v.literal("physical"),
    v.literal("virtual"),
    v.literal("hybrid")
  ),
  addressLine1: v.optional(v.string()),
  addressLine2: v.optional(v.string()),
  city: v.optional(v.string()),
  state: v.optional(v.string()),
  postalCode: v.optional(v.string()),
  country: v.optional(v.string()),
  latitude: v.optional(v.number()),
  longitude: v.optional(v.number()),
  virtualUrl: v.optional(v.string()),
  virtualPlatform: v.optional(v.string()),
  capacity: v.optional(v.number()),
  timezone: v.string(),
  phone: v.optional(v.string()),
  email: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
  isActive: v.boolean(),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_type", ["type"])
  .index("by_city_state", ["city", "state"])
  .index("by_is_active", ["isActive"])
  .index("by_created_by", ["createdBy"]);
