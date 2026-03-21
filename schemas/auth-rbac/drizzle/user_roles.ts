// user_roles: Environment-level (app-wide) role assignments.
// For org-scoped roles, see organization_members.role_id instead.
// See README.md for full design rationale and field documentation.

import {
  index,
  pgTable,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { roles } from "./roles";

export const userRoles = pgTable(
  "user_roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "restrict" }), // Can't delete a role that's assigned to users. Reassign them first.
    assignedBy: uuid("assigned_by")
      .references(() => users.id, { onDelete: "set null" }), // Who granted this role. Null if system-assigned.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique().on(table.userId, table.roleId),              // A user can't have the same role twice.
    index("idx_user_roles_user_id").on(table.userId),     // "What roles does this user have?"
    index("idx_user_roles_role_id").on(table.roleId),     // "Which users have the admin role?"
  ]
);
