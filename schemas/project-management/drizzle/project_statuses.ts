// project_statuses: workflow statuses scoped to a project with ordering and category.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const projectStatusCategoryEnum = pgEnum("project_status_category", [
  "backlog",
  "unstarted",
  "started",
  "completed",
  "cancelled",
]);

export const projectStatuses = pgTable(
  "project_statuses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color"),
    category: projectStatusCategoryEnum("category").notNull(),
    position: integer("position").notNull().default(0),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_project_statuses_project_id_position").on(table.projectId, table.position),
    index("idx_project_statuses_project_id_category").on(table.projectId, table.category),
  ]
);
