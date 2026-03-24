// projects: top-level containers that group tasks, statuses, labels, and members.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const projectVisibilityEnum = pgEnum("project_visibility", [
  "public",
  "private",
]);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    key: text("key").notNull().unique(),
    description: text("description"),
    icon: text("icon"),
    color: text("color"),
    visibility: projectVisibilityEnum("visibility").notNull().default("public"),
    taskCount: integer("task_count").notNull().default(0),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_projects_created_by").on(table.createdBy),
  ]
);
