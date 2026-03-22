// file_metadata_fields: Custom metadata field definitions with type information for application-level validation.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

export const fileMetadataFieldTypeEnum = pgEnum("file_metadata_field_type", [
  "string",
  "integer",
  "float",
  "boolean",
  "date",
  "url",
  "select",
]);

export const fileMetadataFields = pgTable(
  "file_metadata_fields",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").unique().notNull(), // Machine-readable key (e.g., "invoice_number", "project_code").
    label: text("label").notNull(), // Human-readable display name (e.g., "Invoice Number", "Project Code").

    // Determines validation rules applied at the application layer.
    fieldType: fileMetadataFieldTypeEnum("field_type").notNull(),

    description: text("description"), // Explain what this field is for or how to fill it in.

    // If true, every file must have a value for this field.
    // Enforced at the application layer, not as a DB constraint.
    isRequired: boolean("is_required").notNull().default(false),

    defaultValue: text("default_value"), // Default value for new files. Stored as text, same as values.

    // For select-type fields: array of valid values. Null for non-select types.
    options: jsonb("options"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  }
);
