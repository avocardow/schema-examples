// company_tags: many-to-many join between companies and tags.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const companyTags = defineTable({
  companyId: v.id("companies"),
  tagId: v.id("tags"),
})
  .index("by_company_id_and_tag_id", ["companyId", "tagId"])
  .index("by_tag_id", ["tagId"]);
