// event_categories: hierarchical classification of events by type or topic.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const event_categories = defineTable({
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  parentId: v.optional(v.id("event_categories")),
  position: v.number(),
  color: v.optional(v.string()),
  icon: v.optional(v.string()),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_parent_id", ["parentId"])
  .index("by_is_active_position", ["isActive", "position"]);
