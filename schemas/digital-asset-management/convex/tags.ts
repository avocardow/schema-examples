// tags: Workspace-scoped labels for categorizing and searching assets.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tags = defineTable({
  workspaceId: v.id("workspaces"),
  name: v.string(),
})
  .index("by_workspace_id_and_name", ["workspaceId", "name"]);
