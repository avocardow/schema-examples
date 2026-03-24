// tags: reusable labels that can be applied to contacts, companies, and deals.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    color: text("color"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  }
);
