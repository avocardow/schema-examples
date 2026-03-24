// pipelines: sales pipelines that organize deal stages.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";

export const pipelines = pgTable(
  "pipelines",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    isDefault: boolean("is_default").notNull().default(false),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_pipelines_position").on(table.position),
  ]
);
