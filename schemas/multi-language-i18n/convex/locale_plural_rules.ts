// locale_plural_rules: Plural rule categories and formulas per locale.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const locale_plural_rules = defineTable({
  // Foreign keys
  localeId: v.id("locales"),

  // Required fields
  category: v.union(
    v.literal("zero"),
    v.literal("one"),
    v.literal("two"),
    v.literal("few"),
    v.literal("many"),
    v.literal("other")
  ),

  // Optional fields
  example: v.optional(v.string()),
  ruleFormula: v.optional(v.string()),
})
  .index("by_locale_id_and_category", ["localeId", "category"]);
