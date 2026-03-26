// pay_schedules: Defines payroll cadences (weekly, biweekly, etc.).
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const pay_schedules = defineTable({
  name: v.string(),
  frequency: v.union(
    v.literal("weekly"),
    v.literal("biweekly"),
    v.literal("semimonthly"),
    v.literal("monthly"),
  ),
  anchorDate: v.string(),
  isActive: v.boolean(),
  description: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_frequency", ["frequency"])
  .index("by_is_active", ["isActive"]);
