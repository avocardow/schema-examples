// screenshot_key_links: Many-to-many between screenshots and translation keys.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const screenshot_key_links = defineTable({
  screenshotId: v.id("screenshots"),
  translationKeyId: v.id("translation_keys"),
  x: v.optional(v.number()),
  y: v.optional(v.number()),
  width: v.optional(v.number()),
  height: v.optional(v.number()),

  // No updatedAt — append-only.
})
  .index("by_screenshot_and_key", ["screenshotId", "translationKeyId"])
  .index("by_translation_key_id", ["translationKeyId"]);
