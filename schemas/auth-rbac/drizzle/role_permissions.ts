// role_permissions: Junction table linking roles to permissions.
// See README.md for full design rationale and field documentation.

import { index, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { roles } from "./roles";
import { permissions } from "./permissions";

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.roleId, table.permissionId] }), // Composite PK. No separate id column needed.
    index("idx_role_permissions_permission_id").on(table.permissionId),    // "Which roles have this permission?" (reverse lookup).
  ]
);
