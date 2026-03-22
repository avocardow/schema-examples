// locale_settings: Per-locale formatting preferences. One-to-one with locales.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const locale_settings = defineTable({
  localeId: v.id("locales"),
  dateFormat: v.optional(v.string()),
  timeFormat: v.optional(v.string()),
  numberFormat: v.optional(v.string()),
  currencyCode: v.optional(v.string()),
  currencySymbol: v.optional(v.string()),
  firstDayOfWeek: v.number(), // Default 1 (Monday).
  measurementSystem: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_locale_id", ["localeId"]);
