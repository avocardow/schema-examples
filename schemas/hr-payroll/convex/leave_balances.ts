// Convex schema for leave_balances
// Tracks per-employee, per-policy leave accruals, usage, and carryover by year
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const leave_balances = defineTable({
  employeeId: v.id("employees"),
  leavePolicyId: v.id("leave_policies"),
  balance: v.float64(),
  accrued: v.float64(),
  used: v.float64(),
  carriedOver: v.float64(),
  year: v.int64(),
  updatedAt: v.number(),
})
  .index("by_employee_policy_year", ["employeeId", "leavePolicyId", "year"])
  .index("by_leave_policy_id", ["leavePolicyId"]);
