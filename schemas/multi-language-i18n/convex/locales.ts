// locales: Supported locales with BCP 47 tags and metadata.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const locales = defineTable({
  code: v.string(), // BCP 47 language tag. Unique — enforce in mutation logic.
  name: v.string(),
  nativeName: v.optional(v.string()),
  textDirection: v.union(v.literal("ltr"), v.literal("rtl")),
  script: v.optional(v.string()),
  pluralRule: v.optional(v.string()),
  pluralForms: v.number(), // Default 2.
  isDefault: v.boolean(), // Default false.
  isEnabled: v.boolean(), // Default true.
  dateFormat: v.optional(v.string()),
  timeFormat: v.optional(v.string()),
  numberFormat: v.optional(v.string()),
  currencyCode: v.optional(v.string()),
  currencySymbol: v.optional(v.string()),
  firstDayOfWeek: v.number(), // Default 1. 0=Sunday, 1=Monday, 6=Saturday.
  measurementSystem: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_code", ["code"])
  .index("by_is_enabled", ["isEnabled"]);
