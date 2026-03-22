// translation_groups: Links content entries that are translations of each other.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const translation_groups = defineTable({
  resourceId: v.id("translatable_resources"),
  entityId: v.string(),
  sourceLocaleId: v.id("locales"),
  updatedAt: v.number(),
})
  .index("by_resource_entity", ["resourceId", "entityId"])
  .index("by_source_locale_id", ["sourceLocaleId"]);
