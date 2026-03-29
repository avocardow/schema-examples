// collection_assets: Junction table linking assets to collections with ordering.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const collectionAssets = defineTable({
  collectionId: v.id("collections"),
  assetId: v.id("assets"),
  position: v.number(),
  addedBy: v.id("users"),
})
  .index("by_collection_id_and_asset_id", ["collectionId", "assetId"])
  .index("by_asset_id", ["assetId"]);
