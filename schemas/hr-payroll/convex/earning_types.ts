// earning_types: Classification of earning categories for payroll processing.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const earning_types = defineTable({
  name: v.string(),
  code: v.string(),
  category: v.union(
    v.literal("regular"),
    v.literal("overtime"),
    v.literal("bonus"),
    v.literal("commission"),
    v.literal("reimbursement"),
    v.literal("other"),
  ),
  isTaxable: v.boolean(),
  isActive: v.boolean(),
  description: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_code", ["code"])
  .index("by_category", ["category"])
  .index("by_is_active", ["isActive"]);
