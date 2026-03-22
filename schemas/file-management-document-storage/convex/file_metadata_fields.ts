// file_metadata_fields: Custom metadata field definitions with type information for application-level validation.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const file_metadata_fields = defineTable({
  name: v.string(), // Machine-readable key (e.g., "invoice_number", "project_code").
  label: v.string(), // Human-readable display name (e.g., "Invoice Number", "Project Code").

  // Determines validation rules applied at the application layer.
  // string = free text. integer/float = numeric validation. boolean = true/false.
  // date = ISO 8601 date string. url = URL format validation. select = must match an options[] value.
  fieldType: v.union(
    v.literal("string"),
    v.literal("integer"),
    v.literal("float"),
    v.literal("boolean"),
    v.literal("date"),
    v.literal("url"),
    v.literal("select")
  ),

  description: v.optional(v.string()), // Explain what this field is for or how to fill it in.

  // If true, every file must have a value for this field.
  // Enforced at the application layer, not as a DB constraint.
  isRequired: v.boolean(),

  defaultValue: v.optional(v.string()), // Default value for new files. Stored as text, same as values.

  // For select-type fields: array of valid values.
  // e.g., ["low", "medium", "high"] or ["draft", "final", "archived"].
  // Null for non-select types.
  options: v.optional(v.any()),

  updatedAt: v.number(),
})
  .index("by_name", ["name"]);
