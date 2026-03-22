// file_metadata_values: Custom metadata values per file — each row stores one field's value for one file.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const file_metadata_values = defineTable({
  fileId: v.id("files"), // The file this metadata belongs to. Cascade: deleting a file removes all its metadata values.
  fieldId: v.id("file_metadata_fields"), // Which metadata field this value is for. Cascade: deleting a field definition removes all its values.

  // The actual value, stored as text regardless of field_type.
  // Application validates against field_type before saving.
  // Null means "explicitly empty".
  value: v.optional(v.string()),

  updatedAt: v.number(),
})
  .index("by_file_id_field_id", ["fileId", "fieldId"])
  .index("by_field_id_value", ["fieldId", "value"]);
