// task_dependencies: directed relationships between tasks such as blocking or duplication.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";
import { tasks } from "./tasks";

export const taskDependencyTypeEnum = pgEnum("task_dependency_type", [
  "blocks",
  "is_blocked_by",
  "relates_to",
  "duplicates",
]);

export const taskDependencies = pgTable(
  "task_dependencies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    taskId: uuid("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
    dependsOnId: uuid("depends_on_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
    type: taskDependencyTypeEnum("type").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_task_dependencies_task_id_depends_on_id_type").on(table.taskId, table.dependsOnId, table.type),
    index("idx_task_dependencies_depends_on_id").on(table.dependsOnId),
  ]
);
