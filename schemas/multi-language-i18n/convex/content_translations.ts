// content_translations: Translated field values for content entities.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const content_translations = defineTable({
  resourceId: v.id("translatable_resources"),
  entityId: v.string(),
  localeId: v.id("locales"),
  fieldName: v.string(),
  value: v.string(),
  status: v.union(
    v.literal("draft"),
    v.literal("in_review"),
    v.literal("approved"),
    v.literal("published"),
    v.literal("rejected")
  ),
  sourceDigest: v.optional(v.string()),
  translatorId: v.optional(v.id("users")),
  version: v.number(), // Default 1.
  updatedAt: v.number(),
})
  .index("by_resource_entity_locale_field", ["resourceId", "entityId", "localeId", "fieldName"])
  .index("by_resource_entity", ["resourceId", "entityId"])
  .index("by_locale_id", ["localeId"])
  .index("by_status", ["status"]);
