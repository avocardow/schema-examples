// task_views: saved view configurations for displaying tasks in different layouts.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, boolean, integer, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { users } from "./users";

export const taskViewLayoutEnum = pgEnum("task_view_layout", [
  "list",
  "board",
  "calendar",
  "timeline",
]);

export const taskViews = pgTable(
  "task_views",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    layout: taskViewLayoutEnum("layout").notNull().default("list"),
    filters: jsonb("filters"),
    sortBy: jsonb("sort_by"),
    groupBy: text("group_by"),
    isShared: boolean("is_shared").notNull().default(false),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_task_views_project_id_position").on(table.projectId, table.position),
    index("idx_task_views_created_by").on(table.createdBy),
  ]
);
