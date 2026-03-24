// customFieldOptions: selectable options for select and multi-select custom fields.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const customFieldOptions = defineTable({
  customFieldId: v.id("customFields"),
  value: v.string(),
  color: v.optional(v.string()),
  position: v.number(),
})
  .index("by_custom_field_id_position", ["customFieldId", "position"]);
