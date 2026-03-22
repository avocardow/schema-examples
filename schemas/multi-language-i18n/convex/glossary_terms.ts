// glossary_terms: Terminology entries with metadata.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const glossary_terms = defineTable({
  term: v.string(),
  description: v.optional(v.string()),
  partOfSpeech: v.optional(v.string()),
  domain: v.optional(v.string()),
  sourceLocaleId: v.id("locales"),
  isForbidden: v.boolean(), // Default false.
  isCaseSensitive: v.boolean(), // Default false.
  notes: v.optional(v.string()),
  createdBy: v.optional(v.id("users")),
  updatedAt: v.number(),
})
  .index("by_source_locale_and_term", ["sourceLocaleId", "term"])
  .index("by_source_locale_id", ["sourceLocaleId"])
  .index("by_domain", ["domain"]);
