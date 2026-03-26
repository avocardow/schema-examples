// framework_requirements: Individual requirements within a compliance framework, supporting hierarchical nesting.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, timestamp, unique, index } from "drizzle-orm/pg-core";
import { frameworks } from "./frameworks";

export const frameworkRequirements = pgTable(
  "framework_requirements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    frameworkId: uuid("framework_id")
      .notNull()
      .references(() => frameworks.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id").references(() => frameworkRequirements.id, { onDelete: "cascade" }),
    identifier: text("identifier").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_framework_requirements_framework_id_identifier").on(table.frameworkId, table.identifier),
    index("idx_framework_requirements_parent_id").on(table.parentId),
    index("idx_framework_requirements_sort_order").on(table.sortOrder),
  ]
);
