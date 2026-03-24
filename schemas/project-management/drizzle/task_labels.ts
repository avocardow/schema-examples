// task_labels: many-to-many join between tasks and labels.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";
import { tasks } from "./tasks";
import { labels } from "./labels";

export const taskLabels = pgTable(
  "task_labels",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    taskId: uuid("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
    labelId: uuid("label_id").notNull().references(() => labels.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_task_labels_task_id_label_id").on(table.taskId, table.labelId),
    index("idx_task_labels_label_id").on(table.labelId),
  ]
);
