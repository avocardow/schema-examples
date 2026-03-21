// permissions: Granular capabilities using resource:action naming convention.
// Assigned to roles (not directly to users).
// See README.md for full design rationale and field documentation.

import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const permissions = pgTable(
  "permissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").unique().notNull(), // e.g., "posts:create", "billing:read", "users:delete".
    name: text("name").notNull(), // Display name (e.g., "Create Posts").
    description: text("description"),
    resourceType: text("resource_type"), // Groups permissions by resource for building permission UIs.
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_permissions_resource_type")
      .on(table.resourceType)
      .where(sql`${table.resourceType} IS NOT NULL`),
  ]
);
