// locale_fallbacks: Fallback chain definitions per locale.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const locale_fallbacks = defineTable({
  localeId: v.id("locales"),
  fallbackLocaleId: v.id("locales"),
  priority: v.number(), // Default 0.
  updatedAt: v.number(),
})
  .index("by_locale_id_and_fallback", ["localeId", "fallbackLocaleId"])
  .index("by_locale_id_and_priority", ["localeId", "priority"]);
