// commission_rules: Configurable commission structures by scope, vendor, or category.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const commissionRules = defineTable({
  name: v.string(),
  scope: v.union(
    v.literal("global"),
    v.literal("vendor"),
    v.literal("category")
  ),
  vendorId: v.optional(v.id("vendors")),
  categoryId: v.optional(v.id("categories")),
  rateType: v.union(
    v.literal("percentage"),
    v.literal("flat"),
    v.literal("hybrid")
  ),
  percentageRate: v.optional(v.number()),
  flatRate: v.optional(v.number()),
  currency: v.optional(v.string()),
  minCommission: v.optional(v.number()),
  maxCommission: v.optional(v.number()),
  isActive: v.boolean(),
  priority: v.number(),
  effectiveFrom: v.optional(v.number()),
  effectiveTo: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_scope_is_active", ["scope", "isActive"])
  .index("by_vendor_id", ["vendorId"])
  .index("by_category_id", ["categoryId"]);
