// positions: Job positions with department linkage and pay grade.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const positions = defineTable({
  departmentId: v.optional(v.id("departments")),
  title: v.string(),
  code: v.optional(v.string()),
  description: v.optional(v.string()),
  level: v.optional(v.int64()),
  payGrade: v.optional(v.string()),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_department_id", ["departmentId"])
  .index("by_is_active", ["isActive"]);
