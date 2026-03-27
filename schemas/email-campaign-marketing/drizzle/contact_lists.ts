// contact_lists: Named lists for organizing contacts into mailing groups.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const contactLists = pgTable(
  "contact_lists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_contact_lists_created_by").on(table.createdBy),
  ],
);
