// segments: Dynamic contact groups defined by filter criteria.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";

export const segments = pgTable(
  "segments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    filterCriteria: jsonb("filter_criteria").notNull(),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_segments_created_by").on(table.createdBy),
  ],
);
