// event_types: Catalog of trackable event types with schema definitions.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  boolean,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const eventTypes = pgTable(
  "event_types",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").unique().notNull(),
    category: text("category"),
    displayName: text("display_name").notNull(),
    description: text("description"),
    isActive: boolean("is_active").notNull().default(true),
    schema: jsonb("schema"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_event_types_category").on(table.category),
    index("idx_event_types_is_active").on(table.isActive),
  ]
);
