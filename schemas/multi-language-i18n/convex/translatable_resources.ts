// translatable_resources: Registry of entity types supporting translation.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const translatable_resources = defineTable({
  resourceType: v.string(), // Unique — enforce in mutation logic.
  displayName: v.string(),
  translatableFields: v.any(), // JSON array of field definitions.
  description: v.optional(v.string()),
  isEnabled: v.boolean(), // Default true.
  updatedAt: v.number(),
})
  .index("by_resource_type", ["resourceType"]);
