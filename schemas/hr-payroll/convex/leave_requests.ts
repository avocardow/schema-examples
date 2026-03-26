// leave_requests: Employee time-off requests tied to a leave policy, tracked through an approval workflow.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const leave_requests = defineTable({
  employeeId: v.id("employees"),
  leavePolicyId: v.id("leave_policies"),
  startDate: v.string(), // ISO 8601 date (YYYY-MM-DD).
  endDate: v.string(), // ISO 8601 date (YYYY-MM-DD).
  daysRequested: v.float64(), // Supports half-days (e.g. 0.5, 1.5).

  status: v.union(
    v.literal("pending"),
    v.literal("approved"),
    v.literal("rejected"),
    v.literal("cancelled"),
  ),

  reason: v.optional(v.string()),
  reviewerId: v.optional(v.id("users")),
  reviewedAt: v.optional(v.number()), // Unix epoch ms.
  reviewerNote: v.optional(v.string()),
  updatedAt: v.number(), // Unix epoch ms.
})
  .index("by_employee_id", ["employeeId"])
  .index("by_leave_policy_id", ["leavePolicyId"])
  .index("by_status", ["status"])
  .index("by_start_date", ["startDate"]);
