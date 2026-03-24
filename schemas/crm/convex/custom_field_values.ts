// custom_field_values: stored values for custom fields on specific entity instances.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const customFieldValues = defineTable({
  customFieldId: v.id("custom_fields"),
  entityId: v.string(),
  value: v.string(),
  updatedAt: v.number(),
})
  .index("by_custom_field_id_and_entity_id", ["customFieldId", "entityId"])
  .index("by_entity_id", ["entityId"]);
