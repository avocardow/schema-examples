// metadata_values: Stores custom metadata field values for individual assets.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const metadataValues = defineTable({
  assetId: v.id("assets"),
  schemaId: v.id("metadata_schemas"),
  value: v.string(),
  updatedAt: v.number(),
})
  .index("by_asset_id_and_schema_id", ["assetId", "schemaId"])
  .index("by_schema_id", ["schemaId"]);
