// custom_field_options: selectable values for select and multi-select custom fields.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { customFields } from "./custom_fields";

export const customFieldOptions = pgTable(
  "custom_field_options",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customFieldId: uuid("custom_field_id").notNull().references(() => customFields.id, { onDelete: "cascade" }),
    value: text("value").notNull(),
    color: text("color"),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_custom_field_options_custom_field_id_position").on(table.customFieldId, table.position),
  ]
);
