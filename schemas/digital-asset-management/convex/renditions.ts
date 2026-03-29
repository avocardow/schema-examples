// renditions: Pre-generated derivative formats of assets for various use cases.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const renditions = defineTable({
  assetId: v.id("assets"),
  presetName: v.string(),
  storageKey: v.string(),
  mimeType: v.string(),
  fileSize: v.number(),
  width: v.optional(v.number()),
  height: v.optional(v.number()),
  format: v.string(),
})
  .index("by_asset_id_and_preset_name", ["assetId", "presetName"]);
