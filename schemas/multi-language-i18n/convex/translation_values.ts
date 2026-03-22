// translation_values: Translated string values per key/locale/plural category.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const translation_values = defineTable({
  translationKeyId: v.id("translation_keys"),
  localeId: v.id("locales"),
  pluralCategory: v.optional(v.string()),
  value: v.string(),
  status: v.union(
    v.literal("draft"),
    v.literal("in_review"),
    v.literal("approved"),
    v.literal("published"),
    v.literal("rejected")
  ),
  isMachineTranslated: v.boolean(), // Default false.
  sourceDigest: v.optional(v.string()),
  translatorId: v.optional(v.id("users")),
  reviewedBy: v.optional(v.id("users")),
  publishedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_key_locale_plural", ["translationKeyId", "localeId", "pluralCategory"])
  .index("by_locale_id_and_status", ["localeId", "status"])
  .index("by_translation_key_id", ["translationKeyId"])
  .index("by_status", ["status"])
  .index("by_translator_id", ["translatorId"]);
