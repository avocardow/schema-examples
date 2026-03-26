// benefit_enrollments: Tracks employee enrollment in benefit plans with coverage and contribution details.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const benefit_enrollments = defineTable({
  employeeId: v.id("employees"),
  benefitPlanId: v.id("benefit_plans"),

  coverageLevel: v.union(
    v.literal("employee_only"),
    v.literal("employee_spouse"),
    v.literal("employee_children"),
    v.literal("family"),
  ),

  employeeContribution: v.int64(),
  employerContribution: v.int64(),
  currency: v.string(),

  effectiveDate: v.string(),
  endDate: v.optional(v.string()),

  status: v.union(
    v.literal("active"),
    v.literal("pending"),
    v.literal("terminated"),
    v.literal("waived"),
  ),

  updatedAt: v.number(),
})
  .index("by_employee_id", ["employeeId"])
  .index("by_benefit_plan_id", ["benefitPlanId"])
  .index("by_status", ["status"])
  .index("by_effective_date", ["effectiveDate"]);
