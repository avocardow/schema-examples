// Convex schema for leave_policies
// Defines leave/time-off policy types, accrual rules, and balances
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const leave_policies = defineTable({
  name: v.string(),
  type: v.union(
    v.literal("vacation"),
    v.literal("sick"),
    v.literal("personal"),
    v.literal("parental"),
    v.literal("bereavement"),
    v.literal("jury_duty"),
    v.literal("unpaid"),
    v.literal("other")
  ),
  accrualRate: v.optional(v.float64()),
  accrualFrequency: v.union(
    v.literal("per_pay_period"),
    v.literal("monthly"),
    v.literal("quarterly"),
    v.literal("annually"),
    v.literal("none")
  ),
  maxBalance: v.optional(v.float64()),
  maxCarryover: v.optional(v.float64()),
  isPaid: v.boolean(),
  requiresApproval: v.boolean(),
  isActive: v.boolean(),
  description: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_type", ["type"])
  .index("by_is_active", ["isActive"]);
