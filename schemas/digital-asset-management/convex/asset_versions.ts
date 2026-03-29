// asset_versions: Tracks version history for each asset.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const assetVersions = defineTable({
  assetId: v.id("assets"),
  versionNumber: v.number(),
  storageKey: v.string(),
  mimeType: v.string(),
  fileSize: v.number(),
  fileExtension: v.string(),
  checksumSha256: v.optional(v.string()),
  changeSummary: v.optional(v.string()),
  createdBy: v.id("users"),
})
  .index("by_asset_id_and_version_number", ["assetId", "versionNumber"]);
