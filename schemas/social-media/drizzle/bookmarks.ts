// bookmarks: User-saved posts for later reading.
// See README.md for full design rationale.
import { pgTable, uuid, timestamp, index, unique } from "drizzle-orm/pg-core";
import { users } from "./users";
import { posts } from "./posts";

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_bookmarks_user_post").on(table.userId, table.postId),
    index("idx_bookmarks_user_id_created_at").on(table.userId, table.createdAt),
  ]
);
