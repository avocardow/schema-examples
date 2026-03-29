// download_presets: Configurable export settings for asset downloads.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const downloadPresets = defineTable({
  workspaceId: v.id("workspaces"),
  name: v.string(),
  outputFormat: v.optional(v.string()),
  maxWidth: v.optional(v.number()),
  maxHeight: v.optional(v.number()),
  quality: v.optional(v.number()),
  dpi: v.optional(v.number()),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_workspace_id", ["workspaceId"]);
