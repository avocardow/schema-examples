// translation_memory_entries: Source-target segment pairs for translation memory.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const translation_memory_entries = defineTable({
  sourceLocaleId: v.id("locales"),
  targetLocaleId: v.id("locales"),
  sourceText: v.string(),
  targetText: v.string(),
  sourceHash: v.string(),
  domain: v.optional(v.string()),
  qualityScore: v.optional(v.number()),
  usageCount: v.number(), // Default 0.
  source: v.string(), // Default "human".
  createdBy: v.optional(v.id("users")),
  updatedAt: v.number(),
})
  .index("by_source_target_hash", ["sourceLocaleId", "targetLocaleId", "sourceHash"])
  .index("by_source_target", ["sourceLocaleId", "targetLocaleId"])
  .index("by_domain", ["domain"]);
