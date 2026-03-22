// namespaces: Organizational grouping for translation keys.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const namespaces = defineTable({
  name: v.string(), // Unique — enforce in mutation logic.
  description: v.optional(v.string()),
  isDefault: v.boolean(), // Default false.
  updatedAt: v.number(),
})
  .index("by_name", ["name"]);
