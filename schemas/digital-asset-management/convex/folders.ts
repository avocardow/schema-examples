// folders: Hierarchical folder structure for organizing assets within workspaces.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const folders = defineTable({
  workspaceId: v.id("workspaces"),
  parentId: v.optional(v.id("folders")),
  name: v.string(),
  path: v.string(),
  depth: v.number(),
  description: v.optional(v.string()),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_workspace_id_and_path", ["workspaceId", "path"])
  .index("by_workspace_id_parent_id_and_name", ["workspaceId", "parentId", "name"])
  .index("by_parent_id", ["parentId"])
  .index("by_workspace_id_and_depth", ["workspaceId", "depth"]);
