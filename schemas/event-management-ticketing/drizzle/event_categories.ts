// event_categories: Hierarchical classification of events with optional parent categories.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const eventCategories = pgTable(
  "event_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    parentId: uuid("parent_id").references(() => eventCategories.id, {
      onDelete: "set null",
    }),
    position: integer("position").notNull().default(0),
    color: text("color"),
    icon: text("icon"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_event_categories_parent_id").on(table.parentId),
    index("idx_event_categories_is_active_position").on(
      table.isActive,
      table.position,
    ),
  ],
);
