// hashtags: Normalized hashtag registry with usage counters.
// See README.md for full design rationale.
import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";

export const hashtags = pgTable(
  "hashtags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").unique().notNull(),
    postCount: integer("post_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_hashtags_post_count").on(table.postCount),
  ]
);
