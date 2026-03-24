// services: bookable service definitions with duration, pricing, and capacity settings.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const services = defineTable({
  categoryId: v.optional(v.id("service_categories")),
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  duration: v.number(),
  bufferBefore: v.number(),
  bufferAfter: v.number(),
  price: v.optional(v.number()),
  currency: v.optional(v.string()),
  maxAttendees: v.number(),
  minAttendees: v.number(),
  minNotice: v.number(),
  maxAdvance: v.number(),
  slotInterval: v.optional(v.number()),
  isActive: v.boolean(),
  isPrivate: v.boolean(),
  color: v.optional(v.string()),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_category_id", ["categoryId"])
  .index("by_is_active_is_private", ["isActive", "isPrivate"])
  .index("by_created_by", ["createdBy"])
  .index("by_slug", ["slug"]);
