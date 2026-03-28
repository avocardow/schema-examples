// User ratings and reviews for podcast shows
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, timestamp, unique, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { shows } from "./shows";

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    showId: uuid("show_id").notNull().references(() => shows.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    title: text("title"),
    body: text("body"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_reviews_user_id_show_id").on(table.userId, table.showId),
    index("idx_reviews_show_id_created_at").on(table.showId, table.createdAt),
    index("idx_reviews_show_id_rating").on(table.showId, table.rating),
  ]
);
