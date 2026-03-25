// ticket_statuses: configurable ticket lifecycle states with sort order and closed flag.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";

export const ticketStatuses = pgTable(
  "ticket_statuses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    sortOrder: integer("sort_order").notNull().default(0),
    color: text("color"),
    isClosed: boolean("is_closed").notNull().default(false),
    isDefault: boolean("is_default").notNull().default(false),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_ticket_statuses_sort_order").on(table.sortOrder),
  ]
);
