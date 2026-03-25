// custom_field_options: selectable choices for dropdown-type custom fields.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, index } from "drizzle-orm/pg-core";
import { customFields } from "./custom_fields";

export const customFieldOptions = pgTable(
  "custom_field_options",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customFieldId: uuid("custom_field_id").notNull().references(() => customFields.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    value: text("value").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    index("idx_custom_field_options_custom_field_id_sort_order").on(table.customFieldId, table.sortOrder),
  ]
);
