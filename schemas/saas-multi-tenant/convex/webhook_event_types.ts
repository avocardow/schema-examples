// webhook_event_types: Catalogue of event types that can trigger webhook deliveries.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const webhook_event_types = defineTable({
  key: v.string(),
  name: v.string(),
  description: v.optional(v.string()),
  isEnabled: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_key", ["key"])
  .index("by_is_enabled", ["isEnabled"]);
