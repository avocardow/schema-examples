// ticket_priorities: lookup table for ticket urgency levels with ordering and default flag.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const ticket_priorities = defineTable({
  name: v.string(),
  slug: v.string(),
  sortOrder: v.number(),
  color: v.optional(v.string()),
  isDefault: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_sort_order", ["sortOrder"]);
