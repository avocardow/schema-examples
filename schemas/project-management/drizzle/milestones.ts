// milestones: time-boxed goals within a project used to group and track task progress.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const milestoneStatusEnum = pgEnum("milestone_status", [
  "planned",
  "active",
  "completed",
  "cancelled",
]);

export const milestones = pgTable(
  "milestones",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    status: milestoneStatusEnum("status").notNull().default("planned"),
    startDate: text("start_date"),
    endDate: text("end_date"),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_milestones_project_id_status").on(table.projectId, table.status),
    index("idx_milestones_project_id_position").on(table.projectId, table.position),
  ]
);
