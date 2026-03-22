// moderation_policies: Community/platform rule definitions.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const moderation_policies = defineTable({
  // Scope
  scope: v.union(v.literal("global"), v.literal("community"), v.literal("channel")),
  scopeId: v.optional(v.string()), // ID of the community/channel. Null when scope = global. String, not FK — supports external ID formats.

  // Required fields
  title: v.string(), // Short policy title (e.g., "No Hate Speech").
  description: v.string(), // Full policy text explaining what's prohibited and why.

  // Foreign keys
  violationCategoryId: v.optional(v.id("violation_categories")), // Which violation category this policy maps to. Set null if category is deleted.

  // Ordering & status
  sortOrder: v.number(), // Display ordering within the scope.
  isActive: v.boolean(), // Soft-disable without deleting.

  // Timestamps (no createdAt — Convex provides _creationTime)
  updatedAt: v.number(),
})
  .index("by_scope", ["scope", "scopeId"])
  .index("by_violation_category_id", ["violationCategoryId"])
  .index("by_is_active", ["isActive"]);
