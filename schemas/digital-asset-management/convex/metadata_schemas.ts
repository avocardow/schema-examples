// metadata_schemas: Defines custom metadata fields available per workspace.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const metadataSchemas = defineTable({
  workspaceId: v.id("workspaces"),
  fieldName: v.string(),
  fieldLabel: v.string(),
  fieldType: v.union(
    v.literal("text"),
    v.literal("number"),
    v.literal("date"),
    v.literal("boolean"),
    v.literal("single_select"),
    v.literal("multi_select")
  ),
  options: v.optional(v.any()),
  isRequired: v.boolean(),
  displayOrder: v.number(),
  updatedAt: v.number(),
})
  .index("by_workspace_id_and_field_name", ["workspaceId", "fieldName"]);
