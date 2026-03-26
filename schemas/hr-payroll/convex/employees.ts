// employees: Employee profile and employment details.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const employees = defineTable({
  userId: v.optional(v.id("users")),
  employeeNumber: v.optional(v.string()),
  firstName: v.string(),
  lastName: v.string(),
  email: v.string(),
  phone: v.optional(v.string()),
  dateOfBirth: v.optional(v.string()),
  hireDate: v.string(),
  terminationDate: v.optional(v.string()),
  employmentType: v.union(
    v.literal("full_time"),
    v.literal("part_time"),
    v.literal("contractor"),
    v.literal("intern"),
    v.literal("temporary")
  ),
  status: v.union(
    v.literal("active"),
    v.literal("on_leave"),
    v.literal("suspended"),
    v.literal("terminated")
  ),
  metadata: v.optional(v.any()),
  updatedAt: v.number(),
})
  .index("by_employee_number", ["employeeNumber"])
  .index("by_user_id", ["userId"])
  .index("by_status", ["status"])
  .index("by_employment_type", ["employmentType"]);
