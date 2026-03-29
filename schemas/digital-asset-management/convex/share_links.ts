// share_links: Tokenized URLs for sharing assets or collections externally.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const shareLinks = defineTable({
  workspaceId: v.id("workspaces"),
  assetId: v.optional(v.id("assets")),
  collectionId: v.optional(v.id("collections")),
  token: v.string(),
  passwordHash: v.optional(v.string()),
  allowDownload: v.boolean(),
  expiresAt: v.optional(v.number()),
  viewCount: v.number(),
  maxViews: v.optional(v.number()),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_workspace_id", ["workspaceId"])
  .index("by_asset_id", ["assetId"])
  .index("by_collection_id", ["collectionId"])
  .index("by_expires_at", ["expiresAt"])
  .index("by_token", ["token"]);
