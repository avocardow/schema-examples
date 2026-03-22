// translation_keys: Translatable string identifiers with context.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const translation_keys = defineTable({
  namespaceId: v.id("namespaces"),
  key: v.string(),
  description: v.optional(v.string()),
  maxLength: v.optional(v.number()),
  isPlural: v.boolean(), // Default false.
  format: v.string(), // Default "text".
  isHidden: v.boolean(), // Default false.
  updatedAt: v.number(),
})
  .index("by_namespace_id_and_key", ["namespaceId", "key"])
  .index("by_is_plural", ["isPlural"]);
