// custom_field_values: actual values stored for custom fields on specific entities.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index, unique } from "drizzle-orm/pg-core";
import { customFields } from "./custom_fields";

export const customFieldValues = pgTable(
  "custom_field_values",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customFieldId: uuid("custom_field_id").notNull().references(() => customFields.id, { onDelete: "cascade" }),
    entityId: uuid("entity_id").notNull(),
    value: text("value").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_custom_field_values").on(table.customFieldId, table.entityId),
    index("idx_custom_field_values_entity_id").on(table.entityId),
  ]
);
