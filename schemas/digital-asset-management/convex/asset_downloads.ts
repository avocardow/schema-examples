// asset_downloads: Immutable log of every asset download event.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const assetDownloads = defineTable({
  assetId: v.id("assets"),
  downloadedBy: v.optional(v.id("users")),
  shareLinkId: v.optional(v.id("share_links")),
  presetId: v.optional(v.id("download_presets")),
  format: v.string(),
  fileSize: v.number(),
  ipAddress: v.optional(v.string()),
  userAgent: v.optional(v.string()),
})
  .index("by_asset_id", ["assetId"])
  .index("by_downloaded_by", ["downloadedBy"])
  .index("by_creation_time", ["_creationTime"]);
