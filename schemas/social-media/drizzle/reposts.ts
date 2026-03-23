// reposts: Shares of existing posts to a user's timeline.
// See README.md for full design rationale.
import { pgTable, uuid, timestamp, index, unique } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { users } from "./users";

export const reposts = pgTable(
  "reposts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_reposts_post_user").on(table.postId, table.userId),
    index("idx_reposts_user_id_created_at").on(table.userId, table.createdAt),
  ]
);
