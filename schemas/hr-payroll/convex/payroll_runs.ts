// payroll_runs: Execution of a pay cycle, tracking totals and state from draft through completion.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const payroll_runs = defineTable({
  payScheduleId: v.id("pay_schedules"),

  // Pay period boundaries and payment date (ISO-8601 date strings).
  periodStart: v.string(),
  periodEnd: v.string(),
  payDate: v.string(),

  // Lifecycle status.
  status: v.union(
    v.literal("draft"),
    v.literal("processing"),
    v.literal("completed"),
    v.literal("failed"),
    v.literal("voided")
  ),

  // Monetary totals stored as integers (cents).
  totalGross: v.int64(),
  totalDeductions: v.int64(),
  totalNet: v.int64(),

  employeeCount: v.int64(),
  currency: v.string(),

  // Processing metadata.
  processedAt: v.optional(v.number()),
  processedBy: v.optional(v.id("users")),
  notes: v.optional(v.string()),

  updatedAt: v.number(),
})
  .index("by_pay_schedule_id", ["payScheduleId"])
  .index("by_status", ["status"])
  .index("by_pay_date", ["payDate"]);
