// custom_fields: admin-defined extra fields for extending tickets with custom data.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const custom_fields = defineTable({
  name: v.string(),
  label: v.string(),
  fieldType: v.union(
    v.literal("text"),
    v.literal("number"),
    v.literal("date"),
    v.literal("dropdown"),
    v.literal("checkbox"),
    v.literal("textarea"),
    v.literal("url"),
    v.literal("email")
  ),
  sortOrder: v.number(),
  isRequired: v.boolean(),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_name", ["name"])
  .index("by_sort_order", ["sortOrder"]);
