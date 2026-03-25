// sla_policies: service-level agreement definitions with optional business schedule linkage.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const sla_policies = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  isActive: v.boolean(),
  sortOrder: v.number(),
  scheduleId: v.optional(v.id("business_schedules")),
  updatedAt: v.number(),
})
  .index("by_is_active_and_sort_order", ["isActive", "sortOrder"]);
