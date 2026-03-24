// task_assignees: links users to tasks with a role such as assignee or reviewer.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";
import { tasks } from "./tasks";
import { users } from "./users";

export const taskAssigneeRoleEnum = pgEnum("task_assignee_role", [
  "assignee",
  "reviewer",
]);

export const taskAssignees = pgTable(
  "task_assignees",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    taskId: uuid("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: taskAssigneeRoleEnum("role").notNull().default("assignee"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_task_assignees_task_id_user_id").on(table.taskId, table.userId),
    index("idx_task_assignees_user_id").on(table.userId),
  ]
);
