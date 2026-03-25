// custom_field_options: selectable choices for dropdown-type custom fields.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const custom_field_options = defineTable({
  customFieldId: v.id("custom_fields"),
  label: v.string(),
  value: v.string(),
  sortOrder: v.number(),
})
  .index("by_custom_field_id_and_sort_order", ["customFieldId", "sortOrder"]);
