// asset_tags: Junction table associating tags with assets.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const assetTags = defineTable({
  assetId: v.id("assets"),
  tagId: v.id("tags"),
  assignedBy: v.id("users"),
})
  .index("by_asset_id_and_tag_id", ["assetId", "tagId"])
  .index("by_tag_id", ["tagId"]);
