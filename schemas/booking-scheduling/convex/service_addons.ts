// service_addons: optional extras that can be added to a service booking.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const serviceAddons = defineTable({
  serviceId: v.id("services"),
  name: v.string(),
  description: v.optional(v.string()),
  duration: v.number(),
  price: v.number(),
  currency: v.optional(v.string()),
  position: v.number(),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_service_id_position", ["serviceId", "position"])
  .index("by_is_active", ["isActive"]);
