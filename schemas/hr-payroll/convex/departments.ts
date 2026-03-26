// departments: Organizational units that group employees (supports hierarchy via parentId).
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const departments = defineTable({
  organizationId: v.optional(v.id("organizations")),
  parentId: v.optional(v.id("departments")),
  name: v.string(),
  code: v.optional(v.string()),
  description: v.optional(v.string()),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_organization_id", ["organizationId"])
  .index("by_parent_id", ["parentId"])
  .index("by_is_active", ["isActive"]);
