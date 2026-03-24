// project_members: join table linking users to projects with a specific role.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { users } from "./users";

export const projectMemberRoleEnum = pgEnum("project_member_role", [
  "owner",
  "admin",
  "member",
  "viewer",
]);

export const projectMembers = pgTable(
  "project_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: projectMemberRoleEnum("role").notNull().default("member"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_project_members_project_id_user_id").on(table.projectId, table.userId),
    index("idx_project_members_user_id").on(table.userId),
  ]
);
