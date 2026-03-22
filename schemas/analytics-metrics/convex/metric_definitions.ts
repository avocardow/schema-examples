// metric_definitions: Semantic metrics layer.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const metric_definitions = defineTable({
  name: v.string(),
  displayName: v.string(),
  description: v.optional(v.string()),
  aggregation: v.union(
    v.literal("count"),
    v.literal("sum"),
    v.literal("average"),
    v.literal("min"),
    v.literal("max"),
    v.literal("count_unique"),
    v.literal("percentile"),
  ),
  eventTypeId: v.optional(v.id("event_types")),
  propertyKey: v.optional(v.string()),
  filters: v.optional(v.any()),
  unit: v.optional(v.string()),
  format: v.optional(v.string()),
  isActive: v.boolean(),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_name", ["name"])
  .index("by_event_type_id", ["eventTypeId"])
  .index("by_aggregation", ["aggregation"])
  .index("by_is_active", ["isActive"])
  .index("by_created_by", ["createdBy"]);
