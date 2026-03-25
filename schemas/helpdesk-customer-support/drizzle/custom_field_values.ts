// custom_field_values: actual data stored for custom fields against specific tickets.
// See README.md for full design rationale.

import { pgTable, uuid, text, index, uniqueIndex } from "drizzle-orm/pg-core";
import { customFields } from "./custom_fields";
import { tickets } from "./tickets";

export const customFieldValues = pgTable(
  "custom_field_values",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customFieldId: uuid("custom_field_id").notNull().references(() => customFields.id, { onDelete: "cascade" }),
    ticketId: uuid("ticket_id").notNull().references(() => tickets.id, { onDelete: "cascade" }),
    value: text("value"),
  },
  (table) => [
    uniqueIndex("uq_custom_field_values_custom_field_id_ticket_id").on(table.customFieldId, table.ticketId),
    index("idx_custom_field_values_ticket_id").on(table.ticketId),
  ]
);
