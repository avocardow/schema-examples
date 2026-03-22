// translation_key_tags: Tagging system for translation keys.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const translation_key_tags = defineTable({
  translationKeyId: v.id("translation_keys"),
  tag: v.string(),
})
  .index("by_key_and_tag", ["translationKeyId", "tag"])
  .index("by_tag", ["tag"]);
