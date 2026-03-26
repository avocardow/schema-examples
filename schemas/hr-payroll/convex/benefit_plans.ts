// benefit_plans: Employer-sponsored benefit offerings with contribution details.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const benefit_plans = defineTable({
  name: v.string(),
  type: v.union(
    v.literal("health"),
    v.literal("dental"),
    v.literal("vision"),
    v.literal("retirement_401k"),
    v.literal("life_insurance"),
    v.literal("disability"),
    v.literal("hsa"),
    v.literal("fsa"),
    v.literal("other"),
  ),
  description: v.optional(v.string()),
  employerContribution: v.optional(v.int64()),
  employeeContribution: v.optional(v.int64()),
  currency: v.string(), // Default 'USD' enforced at application level.
  isActive: v.boolean(),
  planYearStart: v.optional(v.string()),
  planYearEnd: v.optional(v.string()),
  metadata: v.optional(v.any()),
  updatedAt: v.number(),
})
  .index("by_type", ["type"])
  .index("by_is_active", ["isActive"]);
