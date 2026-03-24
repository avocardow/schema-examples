// service_categories: hierarchical grouping of bookable services.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";

export const serviceCategories = pgTable(
  "service_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    description: text("description"),
    parentId: uuid("parent_id").references(() => serviceCategories.id, { onDelete: "set null" }),
    position: integer("position").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_service_categories_parent_id").on(table.parentId),
    index("idx_service_categories_is_active_position").on(table.isActive, table.position),
  ]
);
