// tasks: individual work items within a project, supporting hierarchy and classification.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { taskLists } from "./task_lists";
import { projectStatuses } from "./project_statuses";
import { milestones } from "./milestones";
import { users } from "./users";

export const taskTypeEnum = pgEnum("task_type", [
  "task",
  "bug",
  "story",
  "epic",
]);

export const taskPriorityEnum = pgEnum("task_priority", [
  "none",
  "urgent",
  "high",
  "medium",
  "low",
]);

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    taskListId: uuid("task_list_id").references(() => taskLists.id, { onDelete: "set null" }),
    parentId: uuid("parent_id").references(() => tasks.id, { onDelete: "cascade" }),
    statusId: uuid("status_id").references(() => projectStatuses.id, { onDelete: "set null" }),
    milestoneId: uuid("milestone_id").references(() => milestones.id, { onDelete: "set null" }),
    number: integer("number").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    type: taskTypeEnum("type").notNull().default("task"),
    priority: taskPriorityEnum("priority").notNull().default("none"),
    dueDate: text("due_date"),
    startDate: text("start_date"),
    estimatePoints: integer("estimate_points"),
    position: integer("position").notNull().default(0),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_tasks_project_id_number").on(table.projectId, table.number),
    index("idx_tasks_project_id_status_id").on(table.projectId, table.statusId),
    index("idx_tasks_task_list_id_position").on(table.taskListId, table.position),
    index("idx_tasks_parent_id").on(table.parentId),
    index("idx_tasks_milestone_id").on(table.milestoneId),
    index("idx_tasks_type").on(table.type),
    index("idx_tasks_due_date").on(table.dueDate),
    index("idx_tasks_created_by").on(table.createdBy),
  ]
);
