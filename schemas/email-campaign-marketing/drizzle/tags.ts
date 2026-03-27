// tags: Labels for categorizing and filtering contacts.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").unique().notNull(),
    description: text("description"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
);
