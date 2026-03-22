// file_metadata_values: Custom metadata values per file — each row stores one field's value for one file.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { files } from "./files";
import { fileMetadataFields } from "./file_metadata_fields";

export const fileMetadataValues = pgTable(
  "file_metadata_values",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fileId: uuid("file_id")
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),
    fieldId: uuid("field_id")
      .notNull()
      .references(() => fileMetadataFields.id, { onDelete: "cascade" }),

    // The actual value, stored as text regardless of field_type.
    // Application validates against field_type before saving.
    // Null means "explicitly empty".
    value: text("value"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    // One value per field per file.
    uniqueIndex("uq_file_metadata_values_file_id_field_id").on(
      table.fileId,
      table.fieldId
    ),

    // "All files where invoice_number = 'INV-2024-001'."
    index("idx_file_metadata_values_field_id_value").on(
      table.fieldId,
      table.value
    ),
  ]
);
