// task_activities: audit log of actions performed on tasks.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { tasks } from "./tasks";
import { users } from "./users";

export const taskActivityActionEnum = pgEnum("task_activity_action", [
  "created",
  "updated",
  "commented",
  "assigned",
  "unassigned",
  "labeled",
  "unlabeled",
  "moved",
  "archived",
  "restored",
]);

export const taskActivities = pgTable(
  "task_activities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    taskId: uuid("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    action: taskActivityActionEnum("action").notNull(),
    field: text("field"),
    oldValue: text("old_value"),
    newValue: text("new_value"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_task_activities_task_id_created_at").on(table.taskId, table.createdAt),
    index("idx_task_activities_user_id").on(table.userId),
  ]
);
