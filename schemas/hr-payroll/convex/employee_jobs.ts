// employee_jobs: Tracks job assignments linking employees to positions, departments, and managers.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const employee_jobs = defineTable({
  // Foreign keys
  employeeId: v.id("employees"),
  positionId: v.optional(v.id("positions")), // Nullable — set null if position is deleted.
  departmentId: v.id("departments"),
  managerId: v.optional(v.id("employees")), // Nullable — set null if manager is deleted.

  // Required fields
  title: v.string(), // Job title for this assignment.
  employmentType: v.union(
    v.literal("full_time"),
    v.literal("part_time"),
    v.literal("contractor"),
    v.literal("intern"),
    v.literal("temporary"),
  ),
  effectiveDate: v.string(), // ISO-8601 date when assignment starts.

  // Optional fields
  endDate: v.optional(v.string()), // ISO-8601 date when assignment ends. Null if still active.
  reason: v.optional(v.string()), // Reason for job change (e.g., "promotion", "transfer").

  // Flags
  isPrimary: v.boolean(), // Whether this is the employee's primary job assignment.

  // Timestamps (no createdAt — Convex provides _creationTime)
  updatedAt: v.number(),
})
  .index("by_employee_id", ["employeeId"])
  .index("by_position_id", ["positionId"])
  .index("by_department_id", ["departmentId"])
  .index("by_manager_id", ["managerId"])
  .index("by_effective_date", ["effectiveDate"]);
