// compliance_taggables: Polymorphic join table linking tags to any compliance entity.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const complianceTaggables = defineTable({
  tagId: v.id("compliance_tags"),
  taggableType: v.union(
    v.literal("control"),
    v.literal("risk"),
    v.literal("policy"),
    v.literal("audit"),
    v.literal("finding"),
    v.literal("evidence")
  ),
  taggableId: v.string(),
})
  .index("by_tag_id_and_taggable_type_and_taggable_id", ["tagId", "taggableType", "taggableId"])
  .index("by_taggable_type", ["taggableType"])
  .index("by_taggable_id", ["taggableId"]);
