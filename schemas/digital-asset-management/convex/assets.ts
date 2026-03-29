// assets: Core table representing digital files managed in the system.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const assets = defineTable({
  workspaceId: v.id("workspaces"),
  folderId: v.optional(v.id("folders")),
  name: v.string(),
  originalFilename: v.string(),
  description: v.optional(v.string()),
  storageKey: v.string(),
  mimeType: v.string(),
  fileSize: v.number(),
  fileExtension: v.string(),
  assetType: v.union(
    v.literal("image"),
    v.literal("video"),
    v.literal("audio"),
    v.literal("document"),
    v.literal("font"),
    v.literal("archive"),
    v.literal("other")
  ),
  status: v.union(
    v.literal("draft"),
    v.literal("active"),
    v.literal("archived"),
    v.literal("expired")
  ),
  currentVersionId: v.optional(v.id("asset_versions")),
  versionCount: v.number(),
  width: v.optional(v.number()),
  height: v.optional(v.number()),
  durationSeconds: v.optional(v.number()),
  colorSpace: v.optional(v.string()),
  dpi: v.optional(v.number()),
  uploadedBy: v.id("users"),
  checksumSha256: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_workspace_id_and_folder_id", ["workspaceId", "folderId"])
  .index("by_workspace_id_and_asset_type", ["workspaceId", "assetType"])
  .index("by_workspace_id_and_status", ["workspaceId", "status"])
  .index("by_uploaded_by", ["uploadedBy"])
  .index("by_mime_type", ["mimeType"])
  .index("by_storage_key", ["storageKey"]);
