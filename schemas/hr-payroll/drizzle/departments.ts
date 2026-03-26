// departments: Organizational units that group employees for reporting, budgeting, and hierarchy.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const departments = pgTable(
  "departments",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id").references(() => departments.id, { onDelete: "set null" }),

    name: text("name").notNull(),
    code: text("code"),
    description: text("description"),

    isActive: boolean("is_active").notNull().default(true),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_departments_organization_id").on(table.organizationId),
    index("idx_departments_parent_id").on(table.parentId),
    index("idx_departments_is_active").on(table.isActive),
  ]
);
