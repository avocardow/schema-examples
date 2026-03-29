// collections: Curated groupings of assets for sharing and organization.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const collections = defineTable({
  workspaceId: v.id("workspaces"),
  name: v.string(),
  description: v.optional(v.string()),
  coverAssetId: v.optional(v.id("assets")),
  isPublic: v.boolean(),
  assetCount: v.number(),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_workspace_id", ["workspaceId"])
  .index("by_created_by", ["createdBy"]);
