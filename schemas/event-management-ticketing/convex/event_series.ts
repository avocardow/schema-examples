// event_series: groups of recurring or related events under a single series.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const event_series = defineTable({
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  recurrenceRule: v.optional(v.string()),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_created_by", ["createdBy"]);
