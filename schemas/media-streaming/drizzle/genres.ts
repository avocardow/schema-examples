// genres: Music genre categories for classifying artists and tracks.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const genres = pgTable(
  "genres",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").unique().notNull(),
    slug: text("slug").unique().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  }
);
