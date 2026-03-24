// custom_field_values: concrete values of custom fields attached to individual tasks.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";
import { tasks } from "./tasks";
import { customFields } from "./custom_fields";

export const customFieldValues = pgTable(
  "custom_field_values",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    taskId: uuid("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
    customFieldId: uuid("custom_field_id").notNull().references(() => customFields.id, { onDelete: "cascade" }),
    value: text("value").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_custom_field_values_task_id_custom_field_id").on(table.taskId, table.customFieldId),
    index("idx_custom_field_values_custom_field_id").on(table.customFieldId),
  ]
);
