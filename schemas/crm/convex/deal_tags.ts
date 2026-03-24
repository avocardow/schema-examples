// deal_tags: many-to-many join between deals and tags.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const dealTags = defineTable({
  dealId: v.id("deals"),
  tagId: v.id("tags"),
})
  .index("by_deal_id_and_tag_id", ["dealId", "tagId"])
  .index("by_tag_id", ["tagId"]);
