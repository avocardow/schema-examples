// deduction_types: Catalogue of payroll deduction types (tax, retirement, insurance, etc.)
// with pre-tax flag and active status for configuration management.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const deduction_types = defineTable({
  name: v.string(),
  code: v.string(),
  category: v.union(
    v.literal("tax"),
    v.literal("retirement"),
    v.literal("insurance"),
    v.literal("garnishment"),
    v.literal("other"),
  ),
  isPretax: v.boolean(),
  isActive: v.boolean(),
  description: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_code", ["code"])
  .index("by_category", ["category"])
  .index("by_is_active", ["isActive"]);
