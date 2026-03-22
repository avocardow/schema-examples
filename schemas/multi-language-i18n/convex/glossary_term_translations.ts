// glossary_term_translations: Per-locale translations of glossary terms.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const glossary_term_translations = defineTable({
  termId: v.id("glossary_terms"),
  localeId: v.id("locales"),
  translation: v.string(),
  notes: v.optional(v.string()),
  status: v.union(v.literal("draft"), v.literal("approved")),
  updatedAt: v.number(),
})
  .index("by_term_and_locale", ["termId", "localeId"])
  .index("by_locale_id", ["localeId"]);
