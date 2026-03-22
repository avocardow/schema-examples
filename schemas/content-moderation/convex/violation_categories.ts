// violation_categories: Hierarchical taxonomy of content violation types.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const violation_categories = defineTable({
  name: v.string(), // Machine-readable identifier (e.g., "hate_speech", "csam"). Must be unique — enforce in mutations.
  displayName: v.string(), // Human-readable label (e.g., "Hate Speech", "Child Sexual Abuse Material").
  description: v.optional(v.string()), // Detailed explanation of what this category covers.

  // Parent category for hierarchical taxonomy.
  // Undefined = top-level category.
  // Restrict: cannot delete a parent that has children.
  parentId: v.optional(v.id("violation_categories")),

  // Default severity when this category is cited in an action.
  // info = informational/advisory.
  // low = minor policy violation.
  // medium = standard violation.
  // high = serious violation requiring prompt action.
  // critical = illegal content, imminent harm — highest priority.
  severity: v.union(
    v.literal("info"),
    v.literal("low"),
    v.literal("medium"),
    v.literal("high"),
    v.literal("critical")
  ),

  isActive: v.boolean(), // Soft-disable without deleting. Inactive categories cannot be selected for new violations but remain for history.
  sortOrder: v.number(), // Display ordering within the parent group.

  // Timestamps (only updatedAt — createdAt is auto via _creationTime)
  updatedAt: v.number(),
})
  .index("by_name", ["name"])
  .index("by_parent_id", ["parentId"])
  .index("by_is_active_and_sort_order", ["isActive", "sortOrder"]);
