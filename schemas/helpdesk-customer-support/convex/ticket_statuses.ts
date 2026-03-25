// ticket_statuses: lookup table for ticket lifecycle states with ordering and closed/default flags.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const ticket_statuses = defineTable({
  name: v.string(),
  slug: v.string(),
  sortOrder: v.number(),
  color: v.optional(v.string()),
  isClosed: v.boolean(),
  isDefault: v.boolean(),
  description: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_sort_order", ["sortOrder"]);
