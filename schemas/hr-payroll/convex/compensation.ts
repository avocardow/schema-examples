// compensation: Tracks employee pay rates, types, and frequency over time.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const compensation = defineTable({
  employeeId: v.id("employees"),
  payType: v.union(v.literal("salary"), v.literal("hourly")),
  amount: v.int64(), // Stored in minor units (cents) to avoid floating-point issues.
  currency: v.string(), // ISO 4217 code. Defaults to "USD" at the application layer.
  payFrequency: v.union(
    v.literal("weekly"),
    v.literal("biweekly"),
    v.literal("semimonthly"),
    v.literal("monthly"),
    v.literal("annually"),
  ),
  effectiveDate: v.string(), // ISO 8601 date (e.g., "2026-01-01").
  endDate: v.optional(v.string()), // Null means current/active compensation.
  reason: v.optional(v.string()), // E.g., "annual raise", "promotion", "market adjustment".
  updatedAt: v.number(),
})
  .index("by_employee_id", ["employeeId"])
  .index("by_effective_date", ["effectiveDate"]);
